from asgiref.sync import sync_to_async
from datetime import timedelta
from ..consumers.safe_engine import SafeEngineConsumer
from guards.multitheftauto import mta_guard
from django.conf import settings
from shared.ws import WebSocketGroupNames, SafeEnginePacketID
from shared.flags import FlagType
from utils import check_request_body_key, discord
from asgiref.sync import sync_to_async
from django.db.models import Q
from ..models import MaliciousSignatures, ClientHWID, ServerType, Warning
from .. import config_ids
from typing import Dict, List, Any
import logging


logger = logging.getLogger(__name__)


async def handle_network_join(consumer: SafeEngineConsumer, request: Dict[str, Any]):
    # Check if the hwid is received
    if not check_request_body_key(request, "hwid", dict):
        await consumer.send(
            SafeEnginePacketID.NETWORK_JOIN,
            {"success": False, "message": "Unable to validate your machine!"},
        )
        logger.warning(f"Missing player HWID on {consumer.address}")
        return consumer.close()

    if not check_request_body_key(request, "cache", dict):
        await consumer.send(
            SafeEnginePacketID.NETWORK_JOIN,
            {"success": False, "message": "Unable to validate your machine!"},
        )
        logger.warning(f"Missing player HWID on {consumer.address}")
        return consumer.close()

    request_hwid = request["hwid"]
    request_hwid_cache = request["cache"]
    if not len(request_hwid) or not len(request_hwid_cache):
        await consumer.send(
            SafeEnginePacketID.NETWORK_JOIN,
            {"success": False, "message": "Unable to validate your machine!"},
        )
        logger.warning(
            f"got Empty {'HWID,' if not len(request_hwid) else ''}{'HWID Cache' if not len(request_hwid_cache) else ''} on {consumer.address}"
        )
        return consumer.close()

    if not check_request_body_key(request_hwid, "extra", dict):
        await consumer.send(
            SafeEnginePacketID.NETWORK_JOIN,
            {"success": False, "message": "Unable to validate your machine!"},
        )
        logger.warning(f"No extra data received from HWID")
        return consumer.close()

    for key in [
        "username",
        "cpu",
        "motherboard_serial",
        "bios",
        "computer_name",
        "pnp_device",
    ]:
        if not check_request_body_key(request_hwid, key, str):
            await consumer.send(
                SafeEnginePacketID.NETWORK_JOIN,
                {
                    "success": False,
                    "message": "Unable to validate your machine's request!",
                },
            )
            logger.warning(
                f"Invalid request received from {consumer.address}, request body: {request_hwid}"
            )
            return consumer.close()

        if request_hwid[key] == "<unkown>" or not len(request_hwid[key]):
            await consumer.send(
                SafeEnginePacketID.NETWORK_JOIN,
                {"success": False, "message": "Unable to validate your machine!"},
            )
            logger.warning(
                f"Unable to validate {consumer.address}, got null HWID component: {key}"
            )
            return consumer.close()

    if not check_request_body_key(request, "engine_type", int):
        logger.warning(f"Received unexpected engine type from {consumer.address}!")
        return consumer.close()

    if not request["engine_type"] in ServerType.values:
        logger.warning(
            f"Invalid engine type received from {consumer.address}, request body: {request}"
        )
        return consumer.close()

    consumer.type = request["engine_type"]

    # Try to get the hwid by one component at least
    try:
        clients_queryset = await sync_to_async(list)(
            ClientHWID.objects.filter(
                Q(motherboard_serial=request_hwid["motherboard_serial"])
                | Q(bios_version=request_hwid["bios"])
                | Q(cpuid=request_hwid["cpu"])
                | Q(pnp_device=request_hwid["pnp_device"])
                | Q(disks__overlap=request_hwid["disks"])
            )
        )
        if len(clients_queryset) > 0:
            hwid = clients_queryset[0]
        else:
            hwid = None
    except ClientHWID.DoesNotExist:
        hwid = None

    # TODO: HWID not found? Check if the hwid cache already exists
    if not hwid:
        ...

    if not hwid:
        hwid = ClientHWID(
            username=request_hwid["username"],
            mta_serial=request_hwid["extra"].get("mta_serial", "<NONE>"),
            disks=request_hwid["disks"],
            cpuid=request_hwid["cpu"],
            motherboard_serial=request_hwid["motherboard_serial"],
            bios_version=request_hwid["bios"],
            computer_name=request_hwid["computer_name"],
            pnp_device=request_hwid["pnp_device"],
        )
        await hwid.asave()
        logger.info(f'"{hwid.username}" HWID registred!')
    else:
        hwid.bios_version = request_hwid["bios"]
        hwid.computer_name = request_hwid["computer_name"]
        hwid.cpuid = request_hwid["cpu"]
        hwid.disks = request_hwid["disks"]
        hwid.motherboard_serial = request_hwid["motherboard_serial"]
        hwid.mta_serial = request_hwid["extra"].get("mta_serial", "<NONE>")
        hwid.username = request_hwid["username"]
        hwid.pnp_device = request_hwid["pnp_device"]

        changes = await hwid.get_changes()

        if changes:
            await hwid.asave()
            logger.info(
                f"{request_hwid['username']}'s engine HWID updated {changes} components, Spoofed HWID?"
            )

    logger.info(
        f"{request_hwid['username']}'s engine asking for network join (Computer Name: \"{hwid.computer_name}\", Bios Version: \"{hwid.bios_version}\", CPU ID: \"{hwid.cpuid}\", Motherboard Serial: \"{hwid.motherboard_serial}\")"
    )

    consumer.group_name = WebSocketGroupNames.SAFE_ENGINES.value
    consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    consumer.hwid = hwid
    mta_guard.add_safe_scanner(consumer)
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]}'s engine joined network successfuly!"
    )

    return await consumer.send(
        SafeEnginePacketID.NETWORK_JOIN, {"success": True, "message": ""}
    )


async def handle_signatures_sync(consumer: SafeEngineConsumer, request: Dict[str, Any]):
    signatures = await sync_to_async(list)(
        MaliciousSignatures.objects.filter(type=consumer.type).order_by("priority")
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

            warn_count = await Warning.get_warns(consumer.hwid)
            if warn_count < 3:
                logger.warning(
                    f"MTA:SA AntiCheat component blocked for {consumer.address} (warns: {warn_count+1}/3)"
                )
                await Warning.warn(consumer.hwid)
            else:
                logger.warning(
                    f"MTA:SA AntiCheat component blocked for {consumer.address}"
                )
                await consumer.ban(
                    "MTA:SA AntiCheat component blocked", timedelta(days=3)
                )

            message_description = f"""SafeGuard AntiCheat detected Missing MTA:SA anticheat component for **{consumer.hwid.username}**."""
            await discord.send_discord_embed(
                settings.DETECTIONS_WEBHOOK_URL,
                "AntiCheat Alert",
                description=message_description,
                footer="SafeGuard For your servers safety",
            )

            if consumer.connected_server:
                detections_webhook_url = (
                    await consumer.connected_server.game_server.get_config_by_id(
                        config_ids.PLAYER_DETECTION_WEBHOOK_URL
                    )
                )

                if len(detections_webhook_url):
                    await discord.send_discord_embed(
                        detections_webhook_url,
                        "AntiCheat Alert",
                        description=message_description,
                        footer="SafeGuard For your servers safety",
                    )


async def handle_scanner_disconnect(consumer: SafeEngineConsumer):
    logger.info(f"{consumer.hwid.username}'s scanner disconnected from network.")
    mta_guard.remove_safe_scanner(consumer)
    await consumer.kick(
        "SafeGuard AntiCheat Agent Not Running. To join this server, please ensure the SafeGuard AntiCheat Agent is open and active.",
        True,
    )
