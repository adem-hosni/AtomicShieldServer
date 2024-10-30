from asgiref.sync import sync_to_async
from ..consumers.safe_engine import SafeEngineConsumer
from guards.multitheftauto import safeguard_manager
from django.conf import settings
from shared.ws import WebSocketGroupNames, SafeEnginePacketID
from shared.flags import FlagType
from utils import check_request_body_key, discord
from asgiref.sync import sync_to_async
from django.db.models import Q
from ..models import MaliciousSignatures, ClientHWID, ServerTypes
from .. import config_ids
from typing import Dict, List, Any
import logging


logger = logging.getLogger(__name__)


async def handle_network_join(consumer: SafeEngineConsumer, request: Dict[str, Any]):
    if not check_request_body_key(request, "disks", list):
        return consumer.close()

    for key in [
        "username",
        "mta_serial",
        "cpu",
        "motherboard_serial",
        "bios",
        "computer_name",
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
            computer_name=request["computer_name"],
        )
        await hwid.asave()
        logger.info(f'"{hwid.username}" HWID registred!')

    logger.info(
        f"{request['username']}'s engine asking for network join (Computer Name: \"{hwid.computer_name}\", Bios Version: \"{hwid.bios_version}\", CPU ID: \"{hwid.cpuid}\", Motherboard Serial: \"{hwid.motherboard_serial}\")"
    )

    consumer.group_name = WebSocketGroupNames.SAFE_ENGINES.value
    consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    consumer.hwid = hwid
    safeguard_manager.add_eagle_scanner(consumer)
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]}'s engine joined network successfuly!"
    )

    return await consumer.send(
        SafeEnginePacketID.NETWORK_JOIN, {"success": True, "message": ""}
    )


async def handle_signatures_sync(consumer: SafeEngineConsumer, request: Dict[str, Any]):
    signatures = await sync_to_async(list)(
        MaliciousSignatures.objects.filter(type=ServerTypes.MTASA).order_by("priority")
    )
    await consumer.send(
        SafeEnginePacketID.SYNC_SIGNATURES,
        {
            "signatures": {
                signature.name: signature.signatures for signature in signatures
            },
        },
    )
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} {len(signatures)} Signatures Synced Successfuly!"
    )


async def handle_malicious_signature_detected(
    consumer: SafeEngineConsumer, request: Dict[str, Any]
):
    if not check_request_body_key(request, "signatures", list):
        return consumer.close()

    try:
        signatures_queryset: List[MaliciousSignatures] = [
            await MaliciousSignatures.objects.aget(name=signature)
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
    await consumer.ban(
        target_ban.ban_message,
        target_ban.ban_duaration,
        consumer.connected_server.game_server if consumer.connected_server else None,
    )


async def handle_game_anticheat_status(
    consumer: SafeEngineConsumer, request: Dict[str, Any]
):
    if not check_request_body_key(request, "status", bool):
        return

    if not request["status"]:
        if not consumer.is_flagged_as(FlagType.MISSING_MTASA_AC_COMPONENT):
            await consumer.flag_as(
                FlagType.MISSING_MTASA_AC_COMPONENT,
                "MTA:SA AntiCheat Component Blocked",
            )
            logger.warning(f"MTA:SA AntiCheat component blocked for {consumer.address}")

            message_description = f"""Missing MTA:SA anticheat component for **{consumer.hwid.username}**."""
            await discord.send_discord_embed(
                settings.DETECTIONS_WEBHOOK_URL,
                "AntiCheat Alert",
                description=message_description,
                footer="SafeGuard",
            )

            if consumer.connected_server:
                detections_webhook_url = (
                    consumer.connected_server.game_server.get_config_by_id(
                        config_ids.PLAYER_DETECTION_WEBHOOK_URL
                    )
                )
                if len(detections_webhook_url):
                    await discord.send_discord_embed(
                        detections_webhook_url,
                        "AntiCheat Alert",
                        description=message_description,
                        footer="SafeGuard",
                    )


async def handle_scanner_disconnect(consumer: SafeEngineConsumer):
    logger.info(f"{consumer.hwid.username}'s scanner disconnected from network.")
    safeguard_manager.remove_eagle_scanner(consumer)
    await consumer.kick("Anticheat Agent Closed! Please re-open the agent.", True)
