from asgiref.sync import sync_to_async
from ..consumers.eagle_scanner import EagleScanner
from eagle_manager.manager import eagle_manager
from shared.ws import WebSocketGroupNames, EagleScannerPacketID
from utils import check_request_body_key
from asgiref.sync import sync_to_async
from django.db.models import Q
from ..models import MaliciousSignatures, ClientHWID, ServerTypes, Ban
from typing import Dict, List, Any
import logging


logger = logging.getLogger(__name__)


async def handle_network_join(consumer: EagleScanner, request: Dict[str, Any]):
    if not check_request_body_key(request, "disks", list):
        return consumer.close()

    for key in [
        "username",
        "mta_serial",
        "cpu",
        "motherboard_serial",
        "bios",
    ]:
        if not check_request_body_key(request, key, str):
            return consumer.close()

    try:
        clients_queryset = await sync_to_async(list)(
            ClientHWID.objects.filter(
                Q(motherboard_serial=request["motherboard_serial"])
                | Q(bios_version=request["bios"])
                | Q(cpuid=request["cpu"])
            )
        )
        if len(clients_queryset) > 0:
            hwid = clients_queryset[0]
        else:
            hwid = None
    except ClientHWID.DoesNotExist:
        hwid = None

    if not hwid:
        hwid = ClientHWID(
            username=request["username"],
            mta_serial=request["mta_serial"],
            disks=request["disks"],
            cpuid=request["cpu"],
            motherboard_serial=request["motherboard_serial"],
            bios_version=request["bios"],
        )
        await hwid.asave()
        logger.info(f'"{hwid.username}" HWID registred!')

    logger.info(f'"{request["username"]}" agent asking for network join...')

    consumer.group_name = WebSocketGroupNames.EAGLE_CLIENTSCANNER.value
    consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    consumer.hwid = hwid
    eagle_manager.add_eagle_scanner(consumer)
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} agent joined network successfuly!"
    )

    return await consumer.send(
        EagleScannerPacketID.NETWORK_JOIN, {"success": True, "message": ""}
    )


async def handle_signatures_sync(consumer: EagleScanner, request: Dict[str, Any]):
    signatures = await sync_to_async(list)(
        MaliciousSignatures.objects.filter(type=ServerTypes.MTASA).order_by("priority")
    )
    await consumer.send(
        EagleScannerPacketID.SYNC_SIGNATURES,
        {
            "signatures": {
                signature.name: signature.signatures for signature in signatures
            },
        },
    )
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} Signatures Synced Successfuly!"
    )


async def handle_malicious_signature_detected(
    consumer: EagleScanner, request: Dict[str, Any]
):
    if not check_request_body_key(request, "signatures", list):
        return consumer.close()

    try:
        signatures_queryset: List[MaliciousSignatures] = [
            await MaliciousSignatures.objects.aget(name=signature).order_by("priority")
            for signature in request["signatures"]
        ]
    except MaliciousSignatures.DoesNotExist:
        signatures_queryset: List[MaliciousSignatures] = []

    if not len(signatures_queryset):
        return

    logger.warning(
        f"DETECTED \"{', '.join(request['signatures'])}\" ON {consumer.address[0]}:{consumer.address[1]} -> \"{signatures_queryset[0].ban_message}\""
    )

    target_ban = signatures_queryset[0]
    consumer.detected_signatures += signatures_queryset
    await consumer.ban(target_ban.ban_message, target_ban.ban_duaration)


async def handle_game_anticheat_status(consumer: EagleScanner, request: Dict[str, Any]):
    if not check_request_body_key(request, "status", bool):
        return

    if not request["status"]:
        logger.warning(f"MTA:SA AntiCheat component blocked for {consumer.address}")
        await consumer.kick("MTA:SA AntiCheat Component Blocked", True)


async def handle_scanner_disconnect(consumer: EagleScanner):
    logger.info(f"{consumer.hwid.username}'s scanner disconnected from network.")
    eagle_manager.remove_eagle_scanner(consumer)
