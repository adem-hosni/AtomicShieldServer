from typing import Dict, Any
from utils import check_request_body_key
from asgiref.sync import sync_to_async
from dashboard.models import GameServers
from shared.ws import RequestType
from ..consumers.eagle_server import EagleServerConsumer

async def handle_network_join(consumer: EagleServerConsumer, request: Dict[str, Any]):
    if not check_request_body_key(request, "server_key", str):
        return await consumer.close()

    if not check_request_body_key(request, "ip", str):
        return await consumer.close()

    if not check_request_body_key(request, "port", int):
        return await consumer.close()

    # Get the target server, send error message if it doesnt exists
    try:
        server = await sync_to_async(GameServers.objects.get)(key=request["server_key"])
    except GameServers.DoesNotExist:
        print(f"Invalid server key requested! (Key: {request['server_key']})")
        await consumer.send({"type": RequestType.NETWORK_JOIN.value, "success": False, "message": "Invalid server key!"})
        return await consumer.close()
    
    # Security Key Rule: Check if the server ip matches the registred ip
    if server.ip != request["ip"]:
        print(f"Server ip address mismatch ({server.ip} != {request['ip']})")
        await consumer.send({"type": RequestType.NETWORK_JOIN.value, "success": False, "message": "Server ip address mismatch"})
        return await consumer.close()

    # Security Key Rule: Check if the server port matches the registred port
    if server.port != request["port"]:
        print(f"Server port mismatch ({server.port} != {request['port']})")
        await consumer.send({"type": RequestType.NETWORK_JOIN.value, "success": False, "message": "Server port mismatch"})
        return await consumer.close()
        
