from ..consumers.eagle_scanner import EagleScanner
from eagle_manager.manager import eagle_manager
from shared.ws import WebSocketGroupNames, EagleScannerPacketID
from utils import check_request_body_key
from asgiref.sync import sync_to_async
from django.db.models import Q
from ..models import MaliciousSignatures, ClientHWIDS, ServerTypes
from typing import Dict, Any
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
            ClientHWIDS.objects.filter(
                Q(motherboard_serial=request["motherboard_serial"])
                | Q(bios_version=request["bios"])
                | Q(cpuid=request["cpu"])
            )
        )
        if len(clients_queryset) > 0:
            hwid = clients_queryset[0]
        else:
            hwid = None
    except ClientHWIDS.DoesNotExist:
        hwid = None

    if not hwid:
        hwid = ClientHWIDS(
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


async def handle_signatures_sync(consumer: EagleScanner, request: Dict[str, Any]):
    signatures = await sync_to_async(list)(
        MaliciousSignatures.objects.filter(type=ServerTypes.MTASA).order_by("priority")
    )
    await consumer.send(
        {
            "type": EagleScannerPacketID.SYNC_SIGNATURES.value,
            "signatures": {
                signature.name: signature.signatures for signature in signatures
            },
        }
    )
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} Signatures Synced Successfuly!"
    )


async def handle_malicious_signature_detected(
    consumer: EagleScanner, request: Dict[str, Any]
):
    if not check_request_body_key(request, "signature", str):
        return consumer.close()

    logger.warn(
        f"SIGNATURE \"{request['signature']}\" DETECTED ON {consumer.address[0]}:{consumer.address[1]}!"
    )


async def handle_scanner_disconnect(consumer: EagleScanner):
    logger.info(f"{consumer.hwid.username}'s scanner disconnected from network.")
    eagle_manager.remove_eagle_scanner(consumer)
