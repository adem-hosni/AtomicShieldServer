import os
import hashlib
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

    if not check_request_body_key(request, "port", int):
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
        server = await GameServer.objects.aget(key=request["server_key"])
    except GameServer.DoesNotExist:
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
        logger.warning(f"Server IP address mismatch ({server.ip} != {request['ip']})")
        await consumer.send(
            SafeServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "Server IP address mismatch",
            },
        )
        return await consumer.close()

    # Validate the port of the server
    if server.port != request["port"]:
        logger.warning(f"Server port mismatch ({server.port} != {request['port']})")
        await consumer.send(
            SafeServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "Server port mismatch",
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
    if not last_subscription.is_valid_for_now():
        await consumer.send(
            SafeServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "Subscription ended",
            },
        )
        return await consumer.close()

    # Successfully joined, add consumer to the WebSocket group and set it's game server
    consumer.group_name = WebSocketGroupNames.SAFE_SERVERS.value
    consumer.game_server = server
    consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    consumer.type = ServerType(request["server_type"])
    fivem_guard.add_safe_server(consumer)
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} joined AtomicShield Servers Network!"
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

    # if not check_request_body_key(request, "steamid", str):
    #     return
    
    unique_identifier_message = f"Steam ID: {request['steamid']}"

    logger.info(
        f'"{request["name"]}" (IP: {request["ip"]}, {unique_identifier_message}) wants to join {consumer.address[0]}:{consumer.address[1]}'
    )

    response = {"join": False, "message": ""}

    # Check if the AtomicShield agent is connected
    engine = fivem_guard.get_scanner_by_ip(request["ip"])
    response["join"] = not engine is None
    if not response["join"]:
        response["message"] = (
            "Protected Server with AtomicShield: Open AtomicShield AntiCheat agent to join this server.\nDownload Link: https://atomic-shield.com"
        )
        logger.info('Connection refused: "AtomicShield Agent Not Connected"')
    else:
        if engine.is_flagged:
            logger.info(
                f'{engine.hwid.computer_name} Client is flagged: "{engine.flag_message}"'
            )
            
            # Check if there is some strict flags
            isstrict_flag = False
            for flag in engine.get_flags():
                if not flag in unstrict_detection_types:
                    isstrict_flag = True
                    break
                
                config_id = -1
                match flag.type:
                    case DetectionType.SECURE_BOOT_DISABLED:
                        config_id = config_ids.FORCE_SECUREBOOT
                    case DetectionType.TEST_SIGNING_ENABLED:
                        config_id = config_ids.FORCE_TESTSIGNING
                try:
                    # Found a configuration that blocks the player
                    if not await consumer.game_server.get_config_by_id(config_id):
                        response["join"] = False
                        response["message"] = engine.flag_message
                        print("join")
                    else:
                        print("dont join")
                        
                except Exception:
                    # Not Found?
                    ...

        if len(engine.detected_signatures) > 0:
            logger.info(
                f'Connection refused: Malicious signatures detected on the client: "{engine.detected_signatures[0].ban_message}"'
            )
            response["join"] = False
            response["message"] = engine.detected_signatures[0].ban_message

        # Check if the player is banned
        bans = await sync_to_async(list)(
            Ban.objects.filter(hwid=engine.hwid).order_by("banned_at")
        )

        if len(bans):
            target_ban = bans[0]
            response["join"] = False
            response["message"] = (
                f"Banned by {settings.ANTICHEAT_NAME} AntiCheat: {target_ban.reason} "
                f"(Timeleft: {represent_timedelta_string(target_ban.duration)})"
            )

    if response["join"]:
        engine.connected_server = consumer
        logger.info(f"{request['ip']}'s Fivem server connection accepted successfuly!")
    
    return await consumer.send(
        SafeServerPacketID.REQUEST_PLAYER_JOIN, {"ip": request["ip"], **response}
    )


async def handle_server_disconnect(consumer: SafeServerConsumer):
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} disconnected from AtomicShield servers network."
    )
    fivem_guard.remove_safe_server(consumer)


async def handle_load_anticheat_scripts(
    consumer: SafeServerConsumer, request: Dict[str, Any]
):
    components: Dict[str, str] = {}

    # Iterate the components folder for components folders
    for component in os.listdir("anticheat_scripts"):
        component_path = os.path.join("anticheat_scripts", component)
        # check if the component is a directory
        if os.path.isdir(component_path):
            # Iterate the component and find scripts
            for script_component in os.listdir(component_path):
                script_path = os.path.join(component_path, script_component)
                # verify the script component is a file and have the lua extension
                if os.path.isfile(script_path) and script_path.endswith(".lua"):
                    # load the script component buffer
                    with open(script_path, "r") as file:
                        component_buffer = file.read()
                    # make a sha256 hash for the buffer
                    component_hash = hashlib.sha256(
                        component_buffer.encode()
                    ).hexdigest()
                    components[component_hash] = component_buffer

    logger.info(
        f"Synced {len(components)} AntiCheat components for {consumer.address[0]}:{consumer.address[1]}"
    )
    return await consumer.send(SafeServerPacketID.SYNC_ANTICHEAT_COMPONENTS, components)


async def handle_player_quit(consumer: SafeServerConsumer, request: Dict[str, Any]):
    if not check_request_body_key(request, "ip", str):
        return

    if not check_request_body_key(request, "name", str):
        return

    if not check_request_body_key(request, "reason", str):
        return

    player_engine = fivem_guard.get_scanner_by_ip(request["ip"])
    if not player_engine:
        logger.warning(
            f"Unauthorized player engine disconnected due to {request['reason']}! (ip: {request['ip']}, name: {request['name']})"
        )
        return await consumer.send(
            SafeServerPacketID.PLAYER_QUIT,
            {
                "success": False,
                "message": "Unauthorized player!",
            },
        )

    player_engine.connected_server = None
    logger.info(
        f"\"{request['name']}\" engine disconnected from AtomicShield MTA:SA server due to \"{request['reason']}\"."
    )

    return await consumer.send(
        SafeServerPacketID.PLAYER_QUIT,
        {
            "success": True,
            "message": "",
        },
    )
