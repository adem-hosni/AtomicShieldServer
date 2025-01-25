from asgiref.sync import sync_to_async
from utils import caesar_encrypt
import base64
from datetime import timedelta
from ..consumers.safe_engine import SafeEngineConsumer
from guards import fivem_guard
from django.conf import settings
from shared.enums import (
    WebSocketGroupNames,
    SafeEnginePacketID,
    SafeUploadType,
    DetectionType,
    unstrict_detection_types,
)
from shared.flags import Flag
from utils import check_request_body_key, discord
from asgiref.sync import sync_to_async
from django.db.models import Q
from anticheat.models import AntiCheatConfigurations, AntiCheatConfigTemplates
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
        hwid_queryset = await sync_to_async(list)(
            ClientHWID.objects.filter(
                Q(motherboard_serial=request_hwid["motherboard_serial"])
                | Q(bios_version=request_hwid["bios"])
                | Q(cpuid=request_hwid["cpu"])
                | Q(pnp_device=request_hwid["pnp_device"])
                | Q(disks__overlap=request_hwid["disks"])
            )
        )
        if len(hwid_queryset) > 0:
            hwid = hwid_queryset[0]
        else:
            hwid = None
    except ClientHWID.DoesNotExist:
        hwid = None

    # HWID not found? Check if the hwid cache already exists
    if not hwid:
        try:
            hwid = await ClientHWID.objects.aget(
                Q(motherboard_serial=request_hwid_cache["motherboard_serial"])
                | Q(bios_version=request_hwid_cache["bios"])
                | Q(cpuid=request_hwid_cache["cpu"])
                | Q(pnp_device=request_hwid_cache["pnp_device"])
                | Q(disks__overlap=request_hwid_cache["disks"])
            )
        except ClientHWID.DoesNotExist:
            hwid = None

        if hwid:
            hwid.bios_version = request_hwid["bios"]
            hwid.computer_name = request_hwid["computer_name"]
            hwid.cpuid = request_hwid["cpu"]
            hwid.disks = request_hwid["disks"]
            hwid.motherboard_serial = request_hwid["motherboard_serial"]
            hwid.username = request_hwid["username"]
            hwid.pnp_device = request_hwid["pnp_device"]

            changes = await hwid.get_changes()

            if changes:
                await hwid.asave()
                logger.info(
                    f"{request_hwid['username']}'s engine HWID updated {changes} components, Spoofed HWID?"
                )

    # Create a HWID if it's does not exists
    if not hwid:
        hwid = ClientHWID(
            username=request_hwid["username"],
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
    fivem_guard.add_safe_scanner(consumer)
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

    encrypted_signatures = {}
    for signature in signatures:
        encrypted_signatures[signature.name] = [
            caesar_encrypt(sig, 3) for sig in signature.signatures
        ]

    await consumer.send(
        SafeEnginePacketID.SYNC_SIGNATURES,
        {
            "signatures": encrypted_signatures,
        },
    )
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} {len(signatures)} Signatures Synced Successfuly!"
    )


async def handle_scanner_disconnect(consumer: SafeEngineConsumer):
    logger.info(f"{consumer.hwid.username}'s scanner disconnected from network.")
    fivem_guard.remove_safe_scanner(consumer)
    await consumer.kick(
        "AtomicShield AntiCheat Agent Not Running. To join this server, please ensure the AtomicShield AntiCheat Agent is open and active.",
        True,
    )


async def handle_cheat_detection(consumer: SafeEngineConsumer, request: Dict[str, Any]):
    # Check all the request key's health
    if not check_request_body_key(request, "detection_type", int):
        logger.warning(
            f"CHEATER REPORT, Missing detection type specified in the packet from {consumer.address}"
        )
        return await consumer.close()

    if not request["detection_type"] in DetectionType.values:
        logger.warning(
            f"Got an invalid detection type {request['detection_type']} from {consumer.address}"
        )
        return await consumer.close()
    request["detection_type"] = DetectionType(request["detection_type"])

    if not check_request_body_key(request, "report", dict):
        logger.warning(
            f"CHEATER REPORT, Missing detection report in the packet from {consumer.address}"
        )
        return await consumer.close()

    if not check_request_body_key(request, "ss", str):
        logger.warning(
            f"CHEATER REPORT, Missing detection screenshot in the packet from {consumer.address}"
        )
        return await consumer.close()

    screenshot_buffer = base64.b64decode(request["ss"])

    await consumer.flag_as(request["detection_type"], request["detection_type"].label)

    # Strict Detection ? Ban
    if not request["detection_type"] in unstrict_detection_types:
        logger.warning(
            f"Strict Ban Cheating Behaviour detected on {consumer.hwid.name}'s computer!"
        )
        await consumer.ban(
            detection_type=request["detection_type"],
            duration=timedelta(days=16),
            target_game_server=consumer.game_server,
            image_buffer=screenshot_buffer,
            reason=request["detection_type"].label,
            report=request["report"]
        )

    # Unstrict Detection, check server confis
    if (
        consumer.connected_server
        and request["detection_type"] in unstrict_detection_types
    ):
        # Check if the malicious driver is about Process Hacker
        if request["detection_type"] == DetectionType.MALICIOUS_DRIVER:
            if str(request["report"]["BlackListed Driver"]).endswith(
                "kprocesshacker.sys"
            ):
                try:
                    processhacker_allowed = (
                        await consumer.connected_server.game_server.get_config_by_id(
                            config_ids.ALLOW_PROCESS_HACKER
                        )
                    )
                except AntiCheatConfigTemplates.DoesNotExist:
                    processhacker_allowed = False

                if not processhacker_allowed:
                    await consumer.kick(
                        "Process Hacker is not Allowed on the connected server"
                    )

        # Check for Secure Boot is forced
        if request["detection_type"] == DetectionType.SECURE_BOOT_DISABLED:
            try:
                force_secureboot = (
                    await consumer.connected_server.game_server.get_config_by_id(
                        config_ids.FORCE_SECUREBOOT
                    )
                )
            except AntiCheatConfigTemplates.DoesNotExist:
                force_secureboot = False
            if force_secureboot:
                await consumer.kick(
                    "This server requires Secure Boot to be enabled on your machine."
                )

        # Check for Force Test Signing Disabled
        if request["detection_type"] == DetectionType.TEST_SIGNING_ENABLED:
            try:
                testsigning_enabled = (
                    await consumer.connected_server.game_server.get_config_by_id(
                        config_ids.FORCE_TESTSIGNING
                    )
                )
            except AntiCheatConfigTemplates.DoesNotExist:
                testsigning_enabled = False

            if testsigning_enabled:
                await consumer.kick(
                    "This server requires Test Signing to be disabled on your machine."
                )
    else:
        logger.info(
            f"CHEATER REPORT! {consumer.hwid.computer_name} treated as cheater with {request['detection_type'].name}"
        )
