import os
import base64
from datetime import timedelta
from asgiref.sync import sync_to_async
from typing import Dict, Any
from utils import check_request_body_key, represent_timedelta_string
from dashboard.models import GameServer
from shared.enums import SafeServerPacketID, WebSocketGroupNames
from shared.models import ServerType
from guards import fivem_guard
from typing import Dict
from django.conf import settings
from django.db.models import Q
from ..models import Ban
from dashboard.models import ServerSubscription
from shared.enums import unstrict_detection_types, DetectionType
from ..consumers.safe_server import SafeServerConsumer
from .. import config_ids
import logging

# Set up logging for this module
logger = logging.getLogger(__name__)


async def handle_network_join(
    consumer: SafeServerConsumer, request: Dict[str, Any]
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
            SafeServerPacketID.NETWORK_JOIN,
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
            logger.warning(f"No servers associated with the used subscription (Subscription key: {request['server_key']})!")
            await consumer.send(SafeServerPacketID.NETWORK_JOIN, {"success": False, "message": "Invalid server key!"})
            return await consumer.close()
    
    except ServerSubscription.DoesNotExist:
        # Log a warning and send an error message if the server key is invalid
        logger.warning(f"Invalid server key requested! (Key: {request['server_key']})")
        await consumer.send(
            SafeServerPacketID.NETWORK_JOIN,
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
            SafeServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": f'Server ip address mismatch. Please update it to "{consumer.address[0]}" from https://atomic-shield.com/dashboard/servers and restart the resource',
            },
        )
        return await consumer.close()

    # Check if the server is running
    if fivem_guard.is_server_running(server.ip):
        await consumer.send(
            SafeServerPacketID.NETWORK_JOIN,
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
            SafeServerPacketID.NETWORK_JOIN,
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
            SafeServerPacketID.NETWORK_JOIN,
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
    fivem_guard.add_safe_server(consumer)
    logger.info(
        f'"{consumer.game_server.name}" {consumer.address} joined AtomicShield Servers Network!'
    )

    return await consumer.send(
        SafeServerPacketID.NETWORK_JOIN, {"success": True, "message": "SUCCESS"}
    )


async def handle_sync_anticheat_configs(
    consumer: SafeServerConsumer, request: Dict[str, Any]
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
        SafeServerPacketID.SYNC_ANTICHEAT_CONFIGS,
        {
            "success": True,
            "configurations": configs,
        },
    )

    logger.info(f"Synced {len(configs)} anti-cheat configurations to the server!")


async def handle_request_player_join(
    consumer: SafeServerConsumer, request: Dict[str, Any]
):
    if not check_request_body_key(request, "ip", str):
        return

    if not check_request_body_key(request, "name", str):
        return

    server_name = consumer.game_server.name if hasattr(consumer.game_server, "name") else "Unknown"

    for item in ["steam", "license", "token", "discord"]:
        if not item in request.keys():
            logger.warning(
                f"Missing '{item}' in request player join for \"{server_name}\""
            )
            return

    logger.info(
        f'"{request["name"]}" wants to join "{server_name}" {consumer.address}\n\t(IP: "{request["ip"]}" Steam: "{request["steam"]}" '
        f'license: "{request["license"]}" Discord: "{request["discord"]}"'
    )

    response = {"join": False, "message": ""}

    if request["ip"] == "127.0.0.1":
        response["join"] = False
        response["message"] = await consumer.game_server.get_config_by_id(config_ids.NETWORK_CORRUPTED)
        logger.warning(f"got a localhost ip  in the server {consumer.game_server.name}{consumer.address}")
    else:
        # Check if the AtomicShield agent is connected
        engine = fivem_guard.get_scanner_by_ip(request["ip"])
        if not engine:
            logger.info(f"Trying to retreive player's engine by 24 subnet matches...")
            engine = fivem_guard.get_engine_by_24subnet(request["ip"])
        response["join"] = not engine is None
        if not response["join"]:
            response["message"] = await consumer.game_server.get_config_by_id(config_ids.AGENT_NOT_DETECTED_MSG)
            logger.info(f'Connection refused: "AtomicShield Agent is Not Connected" {request['ip']}')
        else:
            if len(request["steam"]) and request["steam"] != "Unknown":
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

            if engine.is_flagged:
                logger.info(
                    f'{engine.hwid.computer_name} Client is flagged: "{engine.flag_message}"'
                )

                # Handle the strict flags (Unallowed by the server configuration)
                for flag in engine.get_flags():
                    if flag.type in unstrict_detection_types:
                        kicked = await engine.handle_basic_checks(flag.type, flag.report, consumer)
                        if kicked:
                            response["join"] = False
                            response["message"] = flag.type.label
                            logger.info(
                                f'Connection refused: Strict Basic Checks Found on {engine.hwid.username}: "{flag.type.label}"'
                            )
                            break
                    else:
                        # Strict Detection ? Ban
                        logger.warning(
                            f"Cheating Behaviour {flag.type.name} detected on {engine.hwid.username}'s computer! {flag.report.get('kick_message', '<UNKNOWN>')}"
                        )
                        response["join"] = False
                        response["message"] = flag.report.get('kick_message', '<UNKNOWN>')

                        await engine.send_report(flag.report.get("kick_message", ""), flag.report, flag.report["ss"])
                        if not flag.banned:
                            await engine.ban(
                                detection_type=flag.type,
                                duration=timedelta(days=99),
                                target_game_server=consumer.game_server,
                                image_buffer=flag.report.get("ss", b""),
                                reason=flag.report.get("kick_message", "<None>"),
                                report=flag.report
                            )
                            flag.banned = True

            # Check if the player is banned
            bans = await sync_to_async(list)(
                Ban.objects.filter(hwid=engine.hwid).order_by("banned_at")
            )

            for ban in bans:
                if not ban.is_expired:
                    if (
                        await sync_to_async(lambda: ban.game_server)()
                    ) == consumer.game_server and ban.active:
                        response["join"] = False
                        response["message"] = (
                            f"You're Banned from AtomicShiled servers due to cheating \nReason: {ban.reason}\nNote: if you think this an error, you can appeal your ban on discord"
                        )

                        break

        # Is the player available to join the FxServer ? then start the scanners
    if response["join"]:
        engine.connected_server = consumer
        logger.info(
            f"\"{request["name"]}\" ({request['ip']}) is connected to \"{server_name}\""
        )

        # if await engine.run_scanners(True):
        # else:
        #     response["join"] = False
        #     response["message"] = "Unable to scan your computer from cheats! try to restart the agent"
        #     logger.info(f"\"{request["name"]}\" ({request['ip']}) is unable to connect to \"{server_name}\"!")

        # Store the given data from the FxServer
        engine.hwid.fivem_license = request["license"]
        engine.hwid.steam = request["steam"]
        engine.hwid.discord_id = request["discord"]

        for token in request["token"]:
            if not token in engine.hwid.fivem_token:
                engine.hwid.fivem_token.append(token)

        await engine.hwid.asave()

    return await consumer.send(
        SafeServerPacketID.REQUEST_PLAYER_JOIN, {"ip": request["ip"], **response}
    )


async def handle_server_disconnect(consumer: SafeServerConsumer):
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} disconnected from AtomicShield servers network."
    )
    fivem_guard.remove_safe_server(consumer)


async def handle_player_quit(consumer: SafeServerConsumer, request: Dict[str, Any]):

    if not check_request_body_key(request, "player_ip", str):
        return

    if not check_request_body_key(request, "name", str):
        return

    if not check_request_body_key(request, "reason", str):
        return

    player_engine = fivem_guard.get_scanner_by_ip(request["player_ip"])
    if not player_engine and not fivem_guard.get_engine_by_24subnet(request["player_ip"]):
        logger.warning(
            f"Unauthorized player engine disconnected (ip: {request['player_ip']}, name: {request['name']}, reason: {request['reason']})"
        )
        return await consumer.send(
            SafeServerPacketID.PLAYER_QUIT,
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
    player_engine.connected_server = None
    await player_engine.run_scanners(False)


async def handle_engine_check(consumer: SafeServerConsumer, request: Dict[str, Any]):
    if not check_request_body_key(request, "players", list):
        return

    inactive_engines = []

    for player_ip in request["players"]:
        if not fivem_guard.get_scanner_by_ip(player_ip):
            inactive_engines.append(player_ip)
            logger.warning(
                f"Player engine with IP {player_ip} is not connected to the AtomicShield network!"
            )

    # Log incoming request and result
    # logger.info(
    #     f"[ENGINE_CHECK] Received from: {consumer.address} | Players: {request['players']} | Inactive: {inactive_engines}"
    # )

    return await consumer.send(
        SafeServerPacketID.ENGINE_CHECK, {"inactive_players": inactive_engines}
    )
