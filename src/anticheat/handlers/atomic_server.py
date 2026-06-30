import time
import asyncio
from django.core.cache import cache
from datetime import timedelta
from asgiref.sync import sync_to_async
from typing import Dict, Any
from utils import check_request_body_key, represent_timedelta_string
from dashboard.models import GameServer
from shared.enums import AtomicServerPacketID, WebSocketGroupNames
from shared.models import ServerType
from services.websocket import fivem_conn_manager
from typing import Dict
from django.conf import settings
from django.db.models import Q
from ..models import Ban
from dashboard.models import ServerSubscription
from shared.enums import unstrict_detection_types, DetectionType
from dashboard.models import AuditLogEntry
from ..consumers.atomic_server import AtomicServerConsumer
import logging

# Set up logging for this module
logger = logging.getLogger(__name__)


async def handle_network_join(
    consumer: AtomicServerConsumer, request: Dict[str, Any]
) -> None:
    """
    Handles the network join request from an SafeServerConsumer.

    Args:
    -----
        consumer (SafeServerConsumer): The consumer initiating the request.
        request (Dict[str, Any]): The request data containing server key, IP, and port.
    """

    # Validate the presence and type of required keys in the request
    if not check_request_body_key(request, "server_key", str):
        return await consumer.close()

    if not check_request_body_key(request, "server_type", int):
        return await consumer.close()

    if not request["server_type"] in ServerType.values:
        request_type = request["type"]
        logger.warning(
            f"{consumer.address} trying to join network with invalid server type! ({request_type})"
        )
        await consumer.send(
            AtomicServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "Invalid server type!",
            },
        )
        return await consumer.close()

    # Attempt to retrieve the target server using the server key from the request
    try:
        subscription = await ServerSubscription.objects.aget(key=request["server_key"])
        if await subscription.game_servers.acount():
            server = await subscription.game_servers.afirst()
        else:
            # No servers associated with that subscription
            logger.warning(
                f"No servers associated with the used subscription (Subscription key: {request['server_key']})!"
            )
            await consumer.send(
                AtomicServerPacketID.NETWORK_JOIN,
                {"success": False, "message": "Invalid server key!"},
            )
            return await consumer.close()

    except ServerSubscription.DoesNotExist:
        # Log a warning and send an error message if the server key is invalid
        logger.warning(f"Invalid server key requested! (Key: {request['server_key']})")
        await consumer.send(
            AtomicServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "Invalid server key!",
            },
        )
        return await consumer.close()

    # Validate the IP address of the server
    if server.ip != consumer.address[0]:
        logger.warning(
            f"Server IP address mismatch ({server.ip} != {consumer.address[0]})"
        )
        await consumer.send(
            AtomicServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": f'Server ip address mismatch. Please update it to "{consumer.address[0]}" from https://atomic-shield.com/dashboard/servers and restart the resource',
            },
        )
        return await consumer.close()

    # Check if the server is runningAtomicShield@33070@
    if await fivem_conn_manager.is_server_running(server.ip):
        logger.info(f'"{server.name}" Network join blocked: Server already running')
        await consumer.send(
            AtomicServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "Server already running",
            },
        )
        return await consumer.close()

    # Check subscription's health
    last_subscription = await server.subscriptions.alast()
    if not last_subscription:
        await consumer.send(
            AtomicServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "No subscription found for your server",
            },
        )
        return await consumer.close()

    if not last_subscription.is_valid_for_now():
        logger.info(
            f'"{server.name}" {consumer.address} try to join network with expired subscription'
        )
        await consumer.send(
            AtomicServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "Subscription ended",
            },
        )
        return await consumer.close()

    await last_subscription.arefresh_from_db()

    # Successfully joined, add consumer to the WebSocket group and set it's game server
    consumer.group_name = WebSocketGroupNames.SAFE_SERVERS.value
    consumer.game_server = server
    await consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    consumer.type = ServerType(request["server_type"])
    await fivem_conn_manager.add_atomic_server(consumer)
    logger.info(
        f'"{consumer.game_server.name}" {consumer.address} joined AtomicShield Servers Network!'
    )

    consumer.hearbeat_task = asyncio.create_task(consumer.send_heartbeats())

    await sync_to_async(AuditLogEntry.create_entry)(
        action=AuditLogEntry.Action.SERVER_START,
        severity=AuditLogEntry.Severity.LOW,
        actor=None,  # or consumer.user if available
        game_server=consumer.game_server,
        reviewed=True,
        summary="Server Start",
        details="Server Started",
        category=AuditLogEntry.Category.SERVER,
    )

    return await consumer.send(
        AtomicServerPacketID.NETWORK_JOIN, {"success": True, "message": "SUCCESS"}
    )


async def handle_sync_anticheat_configs(
    consumer: AtomicServerConsumer, request: Dict[str, Any]
):
    """
    Handles requests for anti-cheat configurations from an SafeServerConsumer.

    Args:
    -----
        consumer (SafeServerConsumer): The consumer initiating the request.
        request (Dict[str, Any]): The request data for fetching anti-cheat configurations.

    Returns:
    --------
        None: Implementation needed for handling anti-cheat config requests.
    """
    logger.info(
        f"Syncing AntiCheat configurations for {consumer.address[0]}:{consumer.address[1]}..."
    )
    configs = await consumer.game_server.get_anticheat_configurations()

    # Send configurations to the consumer
    await consumer.send(
        AtomicServerPacketID.SYNC_ANTICHEAT_CONFIGS,
        {
            "success": True,
            "configurations": configs,
        },
    )

    logger.info(f"Synced {len(configs)} anti-cheat configurations to the server!")


async def handle_request_player_join(
    consumer: AtomicServerConsumer, request: Dict[str, Any]
):
    if not check_request_body_key(request, "ip", str):
        return

    if not check_request_body_key(request, "name", str):
        return

    server_name = (
        consumer.game_server.name
        if hasattr(consumer.game_server, "name")
        else "Unknown"
    )

    for item in ["steam", "license", "token", "discord"]:
        if item not in request.keys():
            logger.warning(
                f"Missing '{item}' in request player join for \"{server_name}\""
            )
            return

    logger.info(
        f'"{request["name"]}" wants to join "{server_name}" {consumer.address}\n\t'
        f'(IP: "{request["ip"]}" Steam: "{request["steam"]}" '
        f'License: "{request["license"]}" Discord: "{request["discord"]}")'
    )

    response = {"join": False, "message": ""}
    engine = None
    configurations = await consumer.game_server.aget_configurations()
    authenticate_with_steam = await configurations.aget_config("authenticate_with_steam")

    # Reject localhost IP immediately
    if request["ip"] == "127.0.0.1":
        response["join"] = False
        response["message"] = await configurations.aget_config("network_integrity_alert")
        logger.warning(
            f"Got a localhost IP in the server {consumer.game_server.name} {consumer.address}"
        )
        return await consumer.send(
            AtomicServerPacketID.REQUEST_PLAYER_JOIN, {"ip": request["ip"], **response}
        )

    # Engine lookup depending on config
    if authenticate_with_steam:
        logger.debug(
            f"Authenticating by Steam: received steam='{request['steam']}' for player '{request['name']}'"
        )
        engine = await fivem_conn_manager.get_engine_by_steam(request["steam"])
        if engine:
            logger.info(
                f"✅ Engine found by steam: {engine.hwid.steam} (requested steam: {request['steam']})"
            )
        else:
            logger.debug(
                f"❌ No engine found by steam: '{request['steam']}' (Agent might not be running)"
            )
    else:
        logger.debug(
            f"Authenticating by IP: received ip='{request['ip']}' for player '{request['name']}'"
        )
        engine = await fivem_conn_manager.get_engine_by_ip(request["ip"])
        if engine:
            logger.info(f"✅ Engine found by IP: {engine.address[0]}")
        else:
            logger.debug(
                f"❌ No engine found by exact IP '{request['ip']}', trying /24 subnet"
            )
            engine = await fivem_conn_manager.get_engine_by_24subnet(request["ip"])
            if engine:
                logger.info(f"✅ Engine found by /24 subnet: {engine.address[0]}")
            else:
                logger.debug(
                    f"❌ No engine found by subnet for ip '{request['ip']}' (Agent likely not running)"
                )

    if not engine:
        response["join"] = False
        response["message"] = await configurations.aget_config("agent_not_running")
        logger.warning(
            f'Connection refused: agent not running (requested ip="{request["ip"]}", steam="{request["steam"]}")'
        )
        return await consumer.send(
            AtomicServerPacketID.REQUEST_PLAYER_JOIN, {"ip": request["ip"], **response}
        )

    # Only enforce Steam presence if Steam authentication is enabled
    if authenticate_with_steam:
        logger.debug(
            f"Steam check for player '{request['name']}' (steam='{request['steam']}') with agent OK"
        )
        if not request["steam"] or request["steam"].lower() == "unknown":
            response["join"] = False
            response["message"] = (
                "Please open Steam before joining the server or contact server owner to "
                "setup Steam Authentication."
            )
            logger.warning(
                f'Connection refused for "{request["name"]}" ({request["ip"]}): Steam not running '
                f"(steam field='{request['steam']}')"
            )
            return await consumer.send(
                AtomicServerPacketID.REQUEST_PLAYER_JOIN, {"ip": request["ip"], **response}
            )

    logger.info(f'Engine found for "{request["name"]}" ({request["ip"]})')
    response["join"] = True

    # Update HWID identifiers
    if authenticate_with_steam and len(request["steam"]) and request["steam"] != "Unknown":
        engine.hwid.steam = request["steam"]
    if len(request["license"]) and request["license"] != "Unknown":
        engine.hwid.fivem_license = request["license"]
    if len(request["discord"]) and request["discord"] != "Unknown":
        engine.hwid.discord_id = request["discord"]
    for token in request["token"]:
        if token not in engine.hwid.fivem_token:
            engine.hwid.fivem_token.append(token)

    changes = await engine.hwid.get_changes()
    if changes:
        await engine.hwid.asave()
        logger.info(f'Updating fivem identifiers for "{engine.hwid.username}"')

    # ---- 4) Check flags ----
    if engine.is_flagged:
        logger.info(
            f'{engine.hwid.username} Client is flagged: "{engine.flag_message}"'
        )
        for flag in engine.get_flags():
            if flag.type in unstrict_detection_types:
                kick_message = await engine.handle_basic_checks(
                    flag.type, flag.report, consumer
                )
                logger.debug(f"Result from handling basic checks: {kick_message}")
                if kick_message:
                    response["join"] = False
                    response["message"] = kick_message
                    logger.info(
                        f'Connection refused: Strict Basic Checks Found on {engine.hwid.username}: "{flag.type.label}"'
                    )
                    break
            else:
                logger.warning(
                    f"Cheating Behaviour {flag.type.name} detected on {engine.hwid.username}'s computer! "
                    f"{flag.report.get('kick_message', '<UNKNOWN>')}"
                )
                response["join"] = False
                response["message"] = flag.report.get("kick_message", "<UNKNOWN>")

                if not flag.banned:
                    ban = await engine.ban(
                        detection_type=flag.type,
                        duration=timedelta(days=999),
                        target_game_server=consumer.game_server,
                        image_buffer=flag.report.get("ss", b""),
                        reason=flag.report.get("kick_message", "<None>"),
                        report=flag.report,
                    )
                    await engine.send_report(
                        flag.report.get("kick_message", ""),
                        flag.report,
                        flag.report["ss"],
                        server_consumer=consumer,
                        ban_id=ban.id,
                    )
                    flag.banned = True

    # ---- 5) Check bans ----
    ban = await engine.get_last_ban()
    if ban:
        response["join"] = False
        response["message"] = (
            f"You're Banned from AtomicShield servers due to cheating \n"
            f"Reason: {ban.reason}\n"
            f"Note: if you think this is an error, you can appeal your ban on discord"
        )

    # ---- 6) If allowed to join ----
    if response["join"]:
        engine.connected_server = consumer
        engine.joined_at = time.time()
        logger.info(
            f"\"{request['name']}\" ({request['ip']}) is connected to \"{server_name}\""
        )

        engine.hwid.fivem_license = request["license"]
        engine.hwid.discord_id = request["discord"]
        for token in request["token"]:
            if token not in engine.hwid.fivem_token:
                engine.hwid.fivem_token.append(token)
        await engine.hwid.asave()

    # ---- 7) Audit log ----
    await AuditLogEntry.acreate_entry(
        action=AuditLogEntry.Action.PLAYER_REQUEST_JOIN,
        severity=AuditLogEntry.Severity.LOW,
        actor=None,
        game_server=consumer.game_server,
        reviewed=True,
        target_object=engine.hwid if engine else None,
        summary="Player Request Join",
        details=f"\"{request['name']}\" connection {'accepted' if response['join'] else 'rejected'} "
                f"with message: \"{response['message']}\"",
        category=AuditLogEntry.Category.PLAYER,
    )

    # ---- Final send ----
    return await consumer.send(
        AtomicServerPacketID.REQUEST_PLAYER_JOIN, {"ip": request["ip"], **response}
    )

async def handle_server_disconnect(consumer: AtomicServerConsumer):
    await AuditLogEntry.acreate_entry(
        action=AuditLogEntry.Action.ANTICHEAT_SHUTDOWN,
        severity=AuditLogEntry.Severity.MEDIUM,
        game_server=consumer.game_server,
        reviewed=True,
        target_object=consumer.game_server if consumer else None,
        summary="AntiCheat Shutdown",
        details="AntiCheat Shutdowned",
        category=AuditLogEntry.Category.SERVER,
    )
    logger.info(
        f"{consumer.game_server.name} {consumer.address} disconnected from AtomicShield servers network."
    )
    await fivem_conn_manager.remove_atomic_server(consumer)


async def handle_player_quit(consumer: AtomicServerConsumer, request: Dict[str, Any]):
    if not check_request_body_key(request, "player_ip", str):
        return

    if not check_request_body_key(request, "name", str):
        return

    if not check_request_body_key(request, "reason", str):
        return

    player_engine = await fivem_conn_manager.get_engine_by_ip(
        request["player_ip"]
    ) or await fivem_conn_manager.get_engine_by_24subnet(request["player_ip"])

    await AuditLogEntry.acreate_entry(
        action=AuditLogEntry.Action.PLAYER_QUIT,
        severity=AuditLogEntry.Severity.LOW,
        game_server=consumer.game_server,
        reviewed=True,
        target_object=player_engine.hwid if player_engine else None,
        summary="Player Quit",
        details=f"\"{request['name']}\" quited with reason: \"{request['reason']}\"",
        category=AuditLogEntry.Category.PLAYER,
    )

    if not player_engine:
        logger.warning(
            f"Unauthorized player engine disconnected from \"{consumer.game_server.name}\" (ip: {request['player_ip']}, name: {request['name']}, reason: {request['reason']})"
        )
        await consumer.send(
            AtomicServerPacketID.PLAYER_QUIT,
            {
                "success": False,
                "message": "Unauthorized player!",
            },
        )
    else:
        if player_engine:
            player_engine.connected_server = consumer
            logger.info(
                f"\"{request['name']}\" ({player_engine.address}) Disconnected from \"{player_engine.connected_server.game_server.name}\" ({player_engine.connected_server.game_server.ip}) | Reason: \"{request['reason']}\"."
            )
    if player_engine:
        player_engine.connected_server = None
        await player_engine.run_scanners(False)


async def handle_engine_check(consumer: AtomicServerConsumer, request: Dict[str, Any]):
    if not check_request_body_key(request, "players", list):
        return

    inactive_engines = []

    for player_ip in request["players"]:
        if not await fivem_conn_manager.get_engine_by_ip(player_ip):
            inactive_engines.append(player_ip)
            logger.warning(
                f"Player engine with IP {player_ip} is not connected to the AtomicShield network!"
            )

    # Log incoming request and result
    # logger.info(
    #     f"[ENGINE_CHECK] Received from: {consumer.address} | Players: {request['players']} | Inactive: {inactive_engines}"
    # )

    return await consumer.send(
        AtomicServerPacketID.ENGINE_CHECK, {"inactive_players": inactive_engines}
    )
