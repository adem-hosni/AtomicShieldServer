import os
from time import time
import asyncio
from django.core.cache import cache
from django.utils import timezone
from asgiref.sync import sync_to_async
from utils import caesar_encrypt
import base64
from datetime import timedelta
from ..consumers.atomic_engine import AtomicEngineConsumer
from django.core.files.base import ContentFile
from services.websocket import fivem_conn_manager
from shared.enums import (
    WebSocketGroupNames,
    AtomicEnginePacketID,
    DetectionType,
    AtomicEngineHardKickReason,
    AtomicHeartbeatType,
    unstrict_detection_types,
    detection_messages,
)
import utils
from asgiref.sync import sync_to_async
from django.db.models import Q
from ..models import (
    MaliciousSignatures,
    HWID,
    ServerType,
    WhitelistedProcess,
    ThreatFile,
)
from dashboard.models import AuditLogEntry
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


async def handle_network_join(consumer: AtomicEngineConsumer, request: Dict[str, Any]):
    # Check if the hwid is received
    if not utils.check_request_body_key(request, "hwid", dict):
        await consumer.send(
            AtomicEnginePacketID.NETWORK_JOIN,
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
            AtomicEnginePacketID.NETWORK_JOIN,
            {"success": False, "message": "Unable to validate your machine!"},
        )
        logger.warning(
            f"got Empty {'HWID,' if not len(request_hwid) else ''}{'HWID Cache' if not len([]) else ''} on {consumer.address}"
        )
        return consumer.close()

    for component in request_hwid.keys():
        component_value = request_hwid[component]

        if isinstance(component_value, list):
            for i in range(len(component_value)):
                item = component_value[i]
                if isinstance(item, str):
                    component_value[i] = utils.decode_if_base64(item)
                else:
                    component_value[i] = item  # leave untouched
        elif isinstance(component_value, str):
            request_hwid[component] = utils.decode_if_base64(component_value)
        else:
            # leave dicts, ints, bools, etc. as-is
            request_hwid[component] = component_value

    if not utils.check_request_body_key(request_hwid, "extra", dict):
        await consumer.send(
            AtomicEnginePacketID.NETWORK_JOIN,
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
                AtomicEnginePacketID.NETWORK_JOIN,
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
                AtomicEnginePacketID.NETWORK_JOIN,
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
            HWID.objects.filter(
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
    except HWID.DoesNotExist:
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
    steam = request_hwid.get("steam")
    if steam:
        steam = steam[len("steam:"):] if steam.startswith("steam:") else steam
    if not hwid:
        hwid = HWID(
            username=request_hwid["username"],
            disks=request_hwid["disks"],
            cpuid=request_hwid["cpu"],
            motherboard_serial=request_hwid["motherboard_serial"],
            bios_version=request_hwid["bios"],
            computer_name=request_hwid["computer_name"],
            pnp_device=request_hwid["pnp_device"],
            steam=steam
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
        hwid.steam = steam

        changes = await hwid.get_changes()

        # TODO
        if len(changes) and False:
            await hwid.asave()
            changed_fields = (f"{field[0]} -> {field[1]}" for field in changes)
            logger.info(
                f"{request_hwid['username']}'s engine HWID updated (retreived from cache) components ({', '.join(changed_fields)}), Spoofed HWID?"
            )

    old_engine = await fivem_conn_manager.get_engine_by_ip(consumer.address[0])
    if old_engine:
        await fivem_conn_manager.remove_safe_scanner(old_engine)
        await old_engine.shutdown()
        await old_engine.close(1000, "Another agent connected to the network")
        logger.warning(
            f"{hwid.username if hwid else '<Unknown>'} {consumer.address} disconnected from network, another engine connected to the network"
        )

    logger.info(
        f"{request_hwid['username']}'s engine asking for network join (Computer Name: \"{hwid.computer_name}\", Bios Version: \"{hwid.bios_version}\", CPU ID: \"{hwid.cpuid}\", Motherboard Serial: \"{hwid.motherboard_serial}\", Steam: \"{hwid.steam}\") from {consumer.address}"
    )

    # Join the consumer to the network
    consumer.group_name = WebSocketGroupNames.SAFE_ENGINES.value
    await consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    consumer.hwid = hwid
    consumer.build_timestamp = request.get("build_timestamp", "")
    consumer.received_ip = request.get("ip", consumer.address[0])

    # Sometimes the client sends an empty IP address, we should use the consumer's address instead
    if not consumer.received_ip:
        consumer.received_ip = consumer.address[0]

    await cache.aset(
        f"ac:engine:{consumer.received_ip}",
        {
            "hwid_id": consumer.hwid.id,
            "address": consumer.address,
            "build_timestamp": consumer.build_timestamp,
        },
    )

    await fivem_conn_manager.add_engine(consumer)
    logger.info(
        f"{consumer.hwid.username}'s engine joined network successfuly [{consumer.received_ip}]!"
    )

    consumer.start_tasks()

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

    if hwid:
        hwid.last_seen = timezone.now()
        await hwid.asave()

    await consumer.send(
        AtomicEnginePacketID.NETWORK_JOIN,
        {
            "success": True,
            "message": "",
            "signatures": encrypted_signatures,
            "client_id": consumer.hwid.id,
        },
    )


async def handle_scanner_disconnect(consumer: AtomicEngineConsumer, code):
    (logger.error if code in [1011, 1006] else logger.info)(
        f"{consumer.hwid.username if consumer.hwid else '<Unknown>'} disconnected from {'network' if not consumer.connected_server else consumer.connected_server.game_server.name} (code: {code})"
    )
    connected_server = consumer.connected_server

    async def delayed_kick_check(
        consumer: AtomicEngineConsumer, code: int, timeout: float = 20.0
    ):
        try:
            await asyncio.sleep(timeout)

            engine = await fivem_conn_manager.get_engine_by_ip(
                consumer.address[0]
            ) or await fivem_conn_manager.get_engine_by_24subnet(consumer.address[0])

            if not engine:
                logger.info(
                    f"{consumer.hwid.username if consumer.hwid else '<Unknown>'} still disconnected after {timeout}s, kicking. (code: {code})"
                )
                await consumer.kick(
                    "AtomicShield AntiCheat was disconnected for too long. Please reconnect to the network."
                )
                cache.delete(f"ac:engine:{consumer.received_ip}")
            else:
                engine.connected_server = connected_server
                logger.info(
                    f"{engine.hwid.username if engine.hwid else '<Unknown>'} reconnected within {timeout}s, no kick necessary."
                )
        except Exception as e:
            logger.error(f"Error in delayed_kick_check: {e}")

    if consumer.hearbeat_task:
        consumer.hearbeat_task.cancel()

    try:
        if consumer.connected_server:
            asyncio.create_task(delayed_kick_check(consumer, code))
        await fivem_conn_manager.remove_safe_scanner(consumer)
    except Exception as e:
        logger.error(f"Error handling scanner disconnect: {e}")


async def handle_cheat_detection(
    consumer: AtomicEngineConsumer, request: Dict[str, Any]
):
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

        name_no_ext = os.path.splitext(process_name)[0]
        name_with_ext = name_no_ext + ".exe"

        try:
            query = (
                Q(name__iexact=name_no_ext)
                | Q(name__iexact=name_with_ext)
                | Q(name__iexact=process_name)
            )
            whitelisted_process = await WhitelistedProcess.objects.filter(
                query
            ).aexists()

            if whitelisted_process:
                logger.info(
                    f"{consumer.hwid.username} ({consumer.address}) tried to open a whitelisted process handle: {process_name} (PID: {pid})"
                )
                return
        except Exception as err:
            logger.info(
                f"No whitelisted process found for {process_name} ({pid}) (err: {err})"
            )
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
            logger.warning(
                f"FALSE BAN DETECTED!! from {consumer.hwid.username} {consumer.address}"
            )
            return
        kick_message = f"Internal Cheat Detected - {ban_message}"
    else:
        kick_message = utils.format_string(
            detection_messages[request["detection_type"]], request["report"]
        )

    request["report"]["kick_message"] = kick_message
    flag = await consumer.flag_as(request["detection_type"], request["report"])

    # Strict Detection ? Ban
    if not request["detection_type"] in unstrict_detection_types:
        logger.warning(
            f"Cheating Behaviour {request['detection_type'].name} detected on {consumer.hwid.username if consumer.hwid else "Unknown"}'s computer! {kick_message}"
        )

        report = await consumer.save_report(
            request["detection_type"], screenshot_buffer, request["report"]
        )
        if consumer.connected_server:
            await AuditLogEntry.acreate_entry(
                action=AuditLogEntry.Action.CHEAT_DETECTED,
                severity=AuditLogEntry.Severity.CRITICAL,
                game_server=consumer.connected_server.game_server,
                target_object=consumer.hwid if consumer else None,
                summary="Player Cheating Activity Detected",
                details=f"A Cheating behaviour detected on {consumer.hwid.username} ({request['report']['kick_message'] or 'Unknown'})",
                category=AuditLogEntry.Category.PLAYER,
            )
            flag.banned = True
            ban = await consumer.ban(
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

            await consumer.send_report(
                kick_message,
                request["report"],
                screenshot_buffer,
                server_consumer=consumer.connected_server,
                ban_id=ban.id,
            )
            server_configurations = await consumer.connected_server.game_server.aget_configurations()
            message = await server_configurations.aget_config("ban_message")

            fmted_message = utils.format_string(message, {"reason": kick_message})

            await consumer.kick(
                fmted_message
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
    if request["detection_type"] in unstrict_detection_types:
        result = await consumer.handle_basic_checks(
            request["detection_type"], request["report"], consumer.connected_server
        )
        if result:
            logger.info(
                f"CHEATER REPORT! {consumer.hwid.computer_name} is flagged as {request['detection_type']} in {consumer.connected_server.game_server.name if consumer.connected_server else 'None'}"
                )
            await consumer.kick(result)


async def handle_filehash_request(
    consumer: AtomicEngineConsumer, request: Dict[str, Any]
):
    if not utils.check_request_body_key(request, "filehash", str):
        logger.warning(
            f"Missing filehash in the request from {consumer.address}, closing connection"
        )
        return await consumer.close()

    if not utils.check_request_body_key(request, "filepath", str):
        logger.warning(
            f"Missing filepath in the request from {consumer.address}, closing connection"
        )
        return await consumer.close()

    logger.info(
        f"Filehash request from {consumer.hwid.username} ({consumer.address}), filehash: {request['filehash']}, filepath: {request['filepath']}"
    )

    try:
        threatfile = await ThreatFile.objects.aget(hash=request["filehash"])
    except ThreatFile.DoesNotExist:
        # File not found, upload it
        file_buffer = await consumer.request_file_upload(request["filepath"])
        if not file_buffer:
            logger.warning(
                f"Unable to upload file {request['filepath']} from {consumer.hwid.username} {consumer.address}"
            )
            return await consumer.close()
        file_buffer = ContentFile(
            file_buffer, name=request["filepath"].replace("\\", "/").split("/")[-1]
        )

        # Insert the threat file
        uploaded_threat = ThreatFile(
            found_path=request["filepath"],
            hash=request["filehash"],
            file=file_buffer,
            uploaded_by=consumer.hwid,
        )
        await uploaded_threat.asave()
        logger.info(
            f"File {request['filepath']} ({uploaded_threat.name}, {request['filehash']}) uploaded by {consumer.hwid.username} ({consumer.address})"
        )
    except Exception as err:
        logger.error(f"Error while checking filehash ({request['filehash']}): {err}")
    else:
        # File found, reject the file upload
        logger.info(
            f"File {request['filepath']} ({threatfile.name}, {request['filehash']}) already exists in the database, rejecting upload from {consumer.hwid.username} ({consumer.address})"
        )
        await consumer.send(
            AtomicEnginePacketID.REQUEST_FILEHASH,
            {
                "success": True,
                "message": "",
            },
        )

async def handle_hard_kick(consumer: AtomicEngineConsumer, request: Dict[str, Any]):
    if not utils.check_request_body_key(request, "reason", int):
        logger.warning(
            f"Missing reason in the request from {consumer.address}, closing connection"
        )
        return await consumer.close()

    if not request["reason"] in AtomicEngineHardKickReason.values:
        logger.warning(
            f"Invalid reason in the request from {consumer.address}, closing connection"
        )
        return await consumer.close()

    if not consumer.hwid:
        return

    request["reason"] = AtomicEngineHardKickReason(request["reason"])
    logger.info(
        f"Hard kick request from {consumer.hwid.username} ({consumer.address}), reason: {request['reason'].name}")
    await consumer.kick(f"AtomicShield AntiCheat was forcefully disconnected. Reason: {request['reason'].label}")


async def handle_heartbeat(consumer: AtomicEngineConsumer, request: Dict[str, Any]):
    if not utils.check_request_body_key(request, "heartbeat_type", int):
        logger.warning(
            f"Missing heartbeat type in the request from {consumer.address}, closing connection"
        )
        return await consumer.close()

    heartbeat_type = request["heartbeat_type"]
    if heartbeat_type not in AtomicHeartbeatType.values:
        logger.warning(
            f"Invalid heartbeat type in the request from {consumer.address}, closing connection"
        )
        return await consumer.close()
    
    heartbeat_type = AtomicHeartbeatType(heartbeat_type)
    consumer.last_heartbeats[heartbeat_type] = time()
