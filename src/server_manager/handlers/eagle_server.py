from typing import Dict, Any
from utils import check_request_body_key
from asgiref.sync import sync_to_async
from dashboard.models import GameServers
from ..models import AntiCheatConfigTemplates
from shared.ws import PacketID, WebSocketGroupNames
from shared.models import ServerTypes
from ..consumers.eagle_server import EagleServerConsumer
import logging


logger = logging.getLogger(__name__)


async def handle_network_join(consumer: EagleServerConsumer, request: Dict[str, Any]):
    if not check_request_body_key(request, "server_key", str):
        return await consumer.close()

    if not check_request_body_key(request, "ip", str):
        return await consumer.close()

    if not check_request_body_key(request, "port", int):
        return await consumer.close()

    # Get the target server, send error message if it doesnt exists
    try:
        server = await GameServers.objects.aget(key=request["server_key"])
    except GameServers.DoesNotExist:
        logging.warn(f"Invalid server key requested! (Key: {request['server_key']})")
        await consumer.send(
            {
                "type": PacketID.NETWORK_JOIN.value,
                "success": False,
                "message": "Invalid server key!",
            }
        )
        return await consumer.close()

    # Security Key Rule: Check if the server ip matches the registred ip
    if server.ip != request["ip"]:
        logger.warn(f"Server ip address mismatch ({server.ip} != {request['ip']})")
        await consumer.send(
            {
                "type": PacketID.NETWORK_JOIN.value,
                "success": False,
                "message": "Server ip address mismatch",
            }
        )
        return await consumer.close()

    # Security Key Rule: Check if the server port matches the registred port
    if server.port != request["port"]:
        logger.warn(f"Server port mismatch ({server.port} != {request['port']})")
        await consumer.send(
            {
                "type": PacketID.NETWORK_JOIN.value,
                "success": False,
                "message": "Server port mismatch",
            }
        )
        return await consumer.close()

    consumer.group_name = WebSocketGroupNames.EAGLE_SERVERS.value
    consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    logger.info(f"{consumer.address[0]}:{consumer.address[1]} Joined Eagle Servers Network!")

    queryset = await sync_to_async(list)(
        AntiCheatConfigTemplates.objects.filter(server_type=ServerTypes.MTASA)
    )
    config_templates = [
        {"id": config.id, "value": config.default_value} for config in queryset
    ]

    # Select target server configurations (asynchronously)
    try:
        target_server = await GameServers.objects.select_related("configurations").aget(
            id=server.id
        )
        server_configs = target_server.configurations.config
    except GameServers.DoesNotExist:
        # Set Server configs emmpty
        server_configs = {}

    # Iterate throught config templates
    for config in config_templates:
        # Override config_templates with existing server configs
        if config["id"] in server_configs.keys():
            config["value"] = server_configs[config["id"]]

    # Sync Server Settings
    await consumer.send(
        {
            "type": PacketID.SYNC_ANTICHEAT_CONFIGS.value,
            "configurations": config_templates,
        }
    )

    logger.info(
        f"Synced {len(config_templates)} anticheat configurations to the server!"
    )


async def handle_request_anticheat_configs(
    consumer: EagleServerConsumer, request: Dict[str, Any]
): ...
