from typing import Dict, Any
from utils import check_request_body_key
from asgiref.sync import sync_to_async
from dashboard.models import GameServers
from ..models import AntiCheatConfigTemplates
from shared.ws import PacketID, WebSocketGroupNames
from shared.models import ServerTypes
from ..consumers.eagle_server import EagleServerConsumer
import logging

# Set up logging for this module
logger = logging.getLogger(__name__)

async def handle_network_join(consumer: EagleServerConsumer, request: Dict[str, Any]) -> None:
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
        server = await GameServers.objects.aget(key=request["server_key"])
    except GameServers.DoesNotExist:
        # Log a warning and send an error message if the server key is invalid
        logger.warning(f"Invalid server key requested! (Key: {request['server_key']})")
        await consumer.send(
            {
                "type": PacketID.NETWORK_JOIN.value,
                "success": False,
                "message": "Invalid server key!",
            }
        )
        return await consumer.close()

    # Validate the IP address of the server
    if server.ip != request["ip"]:
        logger.warning(f"Server IP address mismatch ({server.ip} != {request['ip']})")
        await consumer.send(
            {
                "type": PacketID.NETWORK_JOIN.value,
                "success": False,
                "message": "Server IP address mismatch",
            }
        )
        return await consumer.close()

    # Validate the port of the server
    if server.port != request["port"]:
        logger.warning(f"Server port mismatch ({server.port} != {request['port']})")
        await consumer.send(
            {
                "type": PacketID.NETWORK_JOIN.value,
                "success": False,
                "message": "Server port mismatch",
            }
        )
        return await consumer.close()

    # Successfully joined, add consumer to the WebSocket group
    consumer.group_name = WebSocketGroupNames.EAGLE_SERVERS.value
    consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} joined Eagle Servers Network!"
    )

    # Retrieve and sync anti-cheat configurations
    configs = await server.get_anticheat_configurations()

    # Send configurations to the consumer
    await consumer.send(
        {
            "type": PacketID.SYNC_ANTICHEAT_CONFIGS.value,
            "configurations": configs,
        }
    )

    logger.info(
        f"Synced {len(configs)} anti-cheat configurations to the server!"
    )

async def handle_request_anticheat_configs(
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
    ...
