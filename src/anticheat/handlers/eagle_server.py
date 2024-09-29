import os
import hashlib
from typing import Dict, Any
from utils import check_request_body_key
from dashboard.models import GameServer
from shared.ws import EagleServerPacketID, WebSocketGroupNames
from eagle_manager.manager import eagle_manager
from typing import Dict
from ..consumers.eagle_server import EagleServerConsumer
import logging

# Set up logging for this module
logger = logging.getLogger(__name__)


async def handle_network_join(
    consumer: EagleServerConsumer, request: Dict[str, Any]
) -> None:
    """
    Handles the network join request from an EagleServerConsumer.

    Args:
    -----
        consumer (EagleServerConsumer): The consumer initiating the request.
        request (Dict[str, Any]): The request data containing server key, IP, and port.
    """

    # Validate the presence and type of required keys in the request
    if not check_request_body_key(request, "server_key", str):
        return await consumer.close()

    if not check_request_body_key(request, "ip", str):
        return await consumer.close()

    if not check_request_body_key(request, "port", int):
        return await consumer.close()

    # Attempt to retrieve the target server using the server key from the request
    try:
        server = await GameServer.objects.aget(key=request["server_key"])
    except GameServer.DoesNotExist:
        # Log a warning and send an error message if the server key is invalid
        logger.warning(f"Invalid server key requested! (Key: {request['server_key']})")
        await consumer.send(
            EagleServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "Invalid server key!\n",
            },
        )
        return await consumer.close()

    # Validate the IP address of the server
    if server.ip != request["ip"]:
        logger.warning(f"Server IP address mismatch ({server.ip} != {request['ip']})")
        await consumer.send(
            EagleServerPacketID.NETWORK_JOIN,
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
            EagleServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "Server port mismatch",
            },
        )
        return await consumer.close()

    # Check if the server is running
    if eagle_manager.is_server_running(server.ip):
        await consumer.send(
            EagleServerPacketID.NETWORK_JOIN,
            {
                "success": False,
                "message": "Server already running",
            },
        )
        return await consumer.close()

    # Successfully joined, add consumer to the WebSocket group and set it's game server
    consumer.group_name = WebSocketGroupNames.EAGLE_SERVERS.value
    consumer.game_server = server
    consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    eagle_manager.add_eagle_server(consumer)
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} joined Eagle Servers Network!"
    )

    await consumer.send(
        EagleServerPacketID.NETWORK_JOIN, {"success": True, "message": "SUCCESS"}
    )
    return
    # Retrieve and sync anti-cheat configurations


async def handle_sync_anticheat_configs(
    consumer: EagleServerConsumer, request: Dict[str, Any]
):
    """
    Handles requests for anti-cheat configurations from an EagleServerConsumer.

    Args:
    -----
        consumer (EagleServerConsumer): The consumer initiating the request.
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
        EagleServerPacketID.SYNC_ANTICHEAT_CONFIGS,
        {
            "success": True,
            "configurations": configs,
        },
    )

    logger.info(f"Synced {len(configs)} anti-cheat configurations to the server!")


async def handle_request_player_join(
    consumer: EagleServerConsumer, request: Dict[str, Any]
):
    if not check_request_body_key(request, "ip", str):
        return

    if not check_request_body_key(request, "serial", str):
        return

    if not check_request_body_key(request, "name", str):
        return

    logger.info(
        f'"{request["name"]}" (IP: {request["ip"]}, Serial: {request["serial"]}) wants to join {consumer.address[0]}:{consumer.address[1]}'
    )

    response = {"join": False, "message": "None"}

    # Check if the eagle agent is connected
    player_scanner = eagle_manager.get_scanner_by_ip(request["ip"])
    response["join"] = not player_scanner is None
    if not response["join"]:
        response["message"] = "PLEASE OPEN EAGLE ANTICHEAT AGENT"
        logger.info('Connection refused: "Eagle Agent Not Connected"')
    else:
        player_scanner.connected_server = consumer
        if player_scanner.is_flagged:
            response["join"] = False
            response["message"] = player_scanner.flag_message

        if len(player_scanner.detected_signatures) > 0:
            response["join"] = False
            response["message"] = player_scanner.detected_signatures[0].ban_message

        if player_scanner._flagged:
            response["join"] = False
            response["message"] = player_scanner.flag_message

    return await consumer.send(
        EagleServerPacketID.REQUEST_PLAYER_JOIN, {"ip": request["ip"], **response}
    )


async def handle_server_disconnect(consumer: EagleServerConsumer):
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} disconnected from eagle servers network."
    )
    eagle_manager.remove_eagle_server(consumer)


async def handle_load_anticheat_scripts(
    consumer: EagleServerConsumer, request: Dict[str, Any]
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
    return await consumer.send(
        EagleServerPacketID.SYNC_ANTICHEAT_COMPONENTS, components
    )
