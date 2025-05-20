from asgiref.sync import sync_to_async
from utils import caesar_encrypt
import base64
from datetime import timedelta
from ..consumers.safe_engine import SafeEngineConsumer
from django.db.models.functions import Lower
from guards import fivem_guard
from shared.enums import (
    WebSocketGroupNames,
    SafeEnginePacketID,
    DetectionType,
    unstrict_detection_types,
    detection_messages,
)
from shared.flags import Flag
import utils
from asgiref.sync import sync_to_async
from django.db.models import Q
from ..models import MaliciousSignatures, ClientHWID, ServerType, WhitelistedProcess
from typing import Dict, Any
import logging


logger = logging.getLogger(__name__)


async def handle_network_join(consumer: SafeEngineConsumer, request: Dict[str, Any]):
    # Check if the hwid is received
    if not utils.check_request_body_key(request, "hwid", dict):
        await consumer.send(
            SafeEnginePacketID.NETWORK_JOIN,
            {"success": False, "message": "Unable to validate your machine!"},
        )
        logger.warning(f"Missing player HWID on {consumer.address}")
        return consumer.close()

    # if not utils.check_request_body_key(request, "cache", dict):
    #     await consumer.send(
    #         SafeEnginePacketID.NETWORK_JOIN,
    #         {"success": False, "message": "Unable to validate your machine!"},
    #     )
    #     logger.warning(f"Missing player HWID on {consumer.address}")
    #     return consumer.close()

    request_hwid = request["hwid"]
    # request_hwid_cache = request["cache"]
    # if not len(request_hwid) or not len(request_hwid_cache):
    if not len(request_hwid):
        await consumer.send(
            SafeEnginePacketID.NETWORK_JOIN,
            {"success": False, "message": "Unable to validate your machine!"},
        )
        logger.warning(
            f"got Empty {'HWID,' if not len(request_hwid) else ''}{'HWID Cache' if not len([]) else ''} on {consumer.address}"
        )
        return consumer.close()

    if not utils.check_request_body_key(request_hwid, "extra", dict):
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
        if not utils.check_request_body_key(request_hwid, key, str):
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

    if not utils.check_request_body_key(request, "engine_type", int):
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
                # Q(motherboard_serial=request_hwid["motherboard_serial"])
                # | Q(bios_version=request_hwid["bios"])
                # cpuid=request_hwid["cpu"]
                pnp_device=request_hwid["pnp_device"]
                # | Q(disks=request_hwid["disks"])
            )
        )
        if len(hwid_queryset) > 0:
            hwid = hwid_queryset[0]
        else:
            hwid = None
    except ClientHWID.DoesNotExist:
        hwid = None

    # HWID not found? Check if the hwid cache already exists
    # if not hwid and False:
        # try:
        #     hwid = await ClientHWID.objects.aget(
        #         # Q(motherboard_serial=request_hwid_cache["motherboard_serial"])
        #         # | Q(bios_version=request_hwid_cache["bios"])
        #         Q(cpuid=request_hwid_cache["cpu"])
        #         | Q(pnp_device=request_hwid_cache["pnp_device"])
        #         # | Q(disks__overlap=request_hwid_cache["disks"])
        #     )
        # except ClientHWID.DoesNotExist:
        #     hwid = None

        # if hwid:
        #     hwid.bios_version = request_hwid["bios"]
        #     hwid.computer_name = request_hwid["computer_name"]
        #     hwid.cpuid = request_hwid["cpu"]
        #     hwid.disks = request_hwid["disks"]
        #     hwid.motherboard_serial = request_hwid["motherboard_serial"]
        #     hwid.username = request_hwid["username"]
        #     hwid.pnp_device = request_hwid["pnp_device"]

        #     changes = await hwid.get_changes()

        #     if len(changes):
        #         await hwid.asave()
        #         changed_fields = (f"{field[0]} -> {field[1]}" for field in changes)
        #         logger.info(
        #             f"{request_hwid['username']}'s engine HWID updated. components: ({', '.join(changed_fields)}), Spoofed HWID?"
        #         )

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
        # HWID retreived from cache
        hwid.bios_version = request_hwid["bios"]
        hwid.computer_name = request_hwid["computer_name"]
        hwid.cpuid = request_hwid["cpu"]
        hwid.disks = request_hwid["disks"]
        hwid.motherboard_serial = request_hwid["motherboard_serial"]
        hwid.username = request_hwid["username"]
        hwid.pnp_device = request_hwid["pnp_device"]

        changes = await hwid.get_changes()

        # TODO
        if len(changes) and False:
            await hwid.asave()
            changed_fields = (f"{field[0]} -> {field[1]}" for field in changes)
            logger.info(
                f"{request_hwid['username']}'s engine HWID updated (retreived from cache) components ({', '.join(changed_fields)}), Spoofed HWID?"
            )

    old_engine = fivem_guard.get_scanner_by_ip(consumer.address[0])
    if old_engine:
        fivem_guard.remove_safe_scanner(old_engine)
        await old_engine.shutdown()
        await old_engine.close(1000, "Another agent connected to the network")
        logger.warning(
            f"{hwid.username if hwid else '<Unknown>'} {consumer.address} disconnected from network, another engine connected to the network"
        )

    logger.info(
        f"{request_hwid['username']}'s engine asking for network join (Computer Name: \"{hwid.computer_name}\", Bios Version: \"{hwid.bios_version}\", CPU ID: \"{hwid.cpuid}\", Motherboard Serial: \"{hwid.motherboard_serial}\")"
    )

    consumer.group_name = WebSocketGroupNames.SAFE_ENGINES.value
    consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    consumer.hwid = hwid

    fivem_guard.add_safe_scanner(consumer)

    logger.info(
        f"{consumer.hwid.username}'s engine joined network successfuly!"
    )

    signatures = await sync_to_async(list)(
        MaliciousSignatures.objects.filter(type=consumer.type)
    )

    encrypted_signatures = {}
    signature_count = 0
    for signature in signatures:
        encrypted_signatures[signature.name] = [
            caesar_encrypt(sig, 3) for sig in signature.signatures
        ]
        signature_count += len(signature.signatures)

    return await consumer.send(
        SafeEnginePacketID.NETWORK_JOIN,
        {"success": True, "message": "", "signatures": encrypted_signatures},
    )


async def handle_scanner_disconnect(consumer: SafeEngineConsumer, code):
    logger.info(
        f"{consumer.hwid.username if consumer.hwid else '<Unknown>'}'s scanner disconnected from network. (code: {code})"
    )
    fivem_guard.remove_safe_scanner(consumer)
    await consumer.kick(
        "AtomicShield AntiCheat Agent Not Running. To join this server, please ensure the AtomicShield AntiCheat Agent is open and active.",
    )


async def handle_cheat_detection(consumer: SafeEngineConsumer, request: Dict[str, Any]):
    # Check all the request key's health
    if not utils.check_request_body_key(request, "detection_type", int):
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

    if not utils.check_request_body_key(request, "report", dict):
        logger.warning(
            f"CHEATER REPORT, Missing detection report in the packet from {consumer.address}"
        )
        return await consumer.close()

    if not utils.check_request_body_key(request, "ss", str):
        logger.warning(
            f"CHEATER REPORT, Missing detection screenshot in the packet from {consumer.address}"
        )
        return await consumer.close()

    if not hasattr(consumer, "hwid"):
        logger.warning(f"CHEATER REPORT RECEIVED WITHOUT A CONSUMER HWID!")
        return

    if request["detection_type"] == DetectionType.MALICIOUS_PROCESS_HANDLE_OPEN:
        if not utils.check_request_body_key(request["report"], "process_name", str):
            logger.warning(
                f"CHEATER REPORT, Missing process name in the packet from {consumer.address}"
            )
            return await consumer.close()
        if not utils.check_request_body_key(request["report"], "pid", str):
            logger.warning(
                f"CHEATER REPORT, Missing process id in the packet from \"{consumer.hwid.username}\" {consumer.address} ({request['report']['process_name']})"
            )
            return await consumer.close()

        process_name = request["report"]["process_name"]
        pid = request["report"]["pid"]

        # Check if the process is whitelisted
        try:
            whitelisted_process = await WhitelistedProcess.objects.annotate(
                name_lower=Lower("name")
            ).aget(name_lower=process_name, type=consumer.type)

            if whitelisted_process:
                logger.info(
                    f"{consumer.hwid.username} ({consumer.address}) tried to open a whitelisted process handle: {process_name} (PID: {pid})"
                )
                return
        except WhitelistedProcess.DoesNotExist:
            pass

    if "string" in request["report"].keys():
        if not len(request["report"]["string"].strip().replace("\t", "")):
            logger.warning(
                f"FALSE BAN DETECTED FROM {consumer.hwid.username} {consumer.address}!"
            )

    screenshot_buffer = base64.b64decode(request["ss"])
    request["report"]["ss"] = screenshot_buffer

    if request["detection_type"] == DetectionType.CHEAT_SIGNATURE_FOUND:
        try:
            ban_message = (
                await MaliciousSignatures.objects.aget(
                    signatures__contains=request["report"]["string"]
                )
            ).ban_message
        except (MaliciousSignatures.DoesNotExist, Exception) as err:
            logger.error(err)
            ban_message = "Suspicious Behaviour"
        kick_message = f"Internal Cheat Detected: {ban_message}"
    else:
        kick_message = utils.format_string(
            detection_messages[request["detection_type"]], request["report"]
        )

    request["report"]["kick_message"] = kick_message
    flag = await consumer.flag_as(request["detection_type"], request["report"])

    # Strict Detection ? Ban
    if not request["detection_type"] in unstrict_detection_types:
        logger.warning(
            f"Cheating Behaviour {request['detection_type'].name} detected on {consumer.hwid.username}'s computer! {kick_message}"
        )

        if consumer.connected_server:
            await consumer.send_report(
                kick_message, request["report"], screenshot_buffer
            )
            report = await consumer.save_report(
                request["detection_type"], screenshot_buffer, request["report"]
            )
            flag.banned = True
            await consumer.ban(
                detection_type=request["detection_type"],
                duration=timedelta(days=99),
                target_game_server=consumer.connected_server.game_server,
                reason=kick_message,
                report=report,
                image_buffer=screenshot_buffer,
            )
            logger.info(
                f"KICKING {consumer.hwid.username} from {consumer.connected_server.game_server.name} for {kick_message}"
            )
            await consumer.kick(
                f"You're Banned from AtomicShiled servers due to cheating \nReason: {kick_message}\nNote: if you think this an error, you can appeal your ban on discord"
            )
        else:
            await consumer.send_report(
                f"{kick_message} (NOT-ASSOSCIATED)",
                request["report"],
                screenshot_buffer,
                False,
            )

            logger.warning(
                f"Unable to kick {consumer.hwid.username} ({consumer.address}) from the server, no connected server found."
            )

    # Unstrict Detection, check server configs
    if (
        consumer.connected_server
        and request["detection_type"] in unstrict_detection_types
    ):
        await consumer.handle_basic_checks(
            request["detection_type"], request["report"], consumer.connected_server
        )
