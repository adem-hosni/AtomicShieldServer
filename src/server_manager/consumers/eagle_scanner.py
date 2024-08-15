from channels.generic.websocket import AsyncWebsocketConsumer
from .eagle_server import EagleServerConsumer
from ..models import ClientHWIDS
from shared.ws import EagleScannerPacketID, EagleServerPacketID, WebSocketGroupNames
import json
from typing import Union, Dict, List, Optional, Any
import logging


logger = logging.getLogger(__name__)


class EagleScanner(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._group_name = ""
        self._hwid: ClientHWIDS = None
        self._connected_server: EagleServerConsumer = None

    async def connect(self):
        await self.accept()
        self.address = tuple(self.scope["client"])

        logger.info(
            f"{self.address[0]}:{self.address[1]} Agent asking for connection..."
        )

    async def send(
        self,
        data: Union[Dict[Any, Any], List[Any], str, bytes],
        bytes_data=None,
        close=False,
    ):
        """
        Sends data over the WebSocket connection.

        Args:
        -----
            data (Union[Dict[Any, Any], str, bytes]): The data to be sent. Can be a dictionary, string, or bytes.
            bytes_data: Optional bytes data to be sent.
            close (bool): Whether to close the connection after sending the data.

        Returns:
        --------
            Awaitable: An awaitable object for the send operation.
        """
        # If data is bytes, decode it to a string
        if isinstance(data, bytes):
            data = data.decode()

        # If data is a dictionary, convert it to a JSON string
        if isinstance(data, dict):
            data = json.dumps(data)

        return await super().send(data, bytes_data, close)

    @property
    def group_name(self) -> str:
        return self._group_name

    @group_name.setter
    def group_name(self, value: Any):
        if not isinstance(value, str):
            raise TypeError(
                f"Invalid room group name value, expected 'User' got {type(value)}"
            )
        self._group_name = value

    async def receive(self, text_data=None, bytes_data=None):
        try:
            # Attempt to parse the incoming message as JSON
            request_body: Dict[str, Any] = json.loads(text_data)
        except json.decoder.JSONDecodeError:
            logger.warn(f"Failed to parse request. (request body: {request_body})")
            return self.close()

        # Check if the request body contains a 'type' key
        if not "type" in request_body.keys():
            logger.warn(f"Failed to get request type. (given request: {request_body})")
            return self.close()

        try:
            # Convert the 'type' field to a PacketID
            request_body["type"] = EagleScannerPacketID(request_body["type"])
        except ValueError:
            logger.warn(f"Undefined request type (given: {request_body['type']})")
            return self.close()

        from ..handlers.eagle_scanner import (
            handle_network_join,
            handle_signatures_sync,
            handle_malicious_signature_detected,
        )

        match request_body["type"]:
            case EagleScannerPacketID.NETWORK_JOIN:
                await handle_network_join(self, request_body)
            case EagleScannerPacketID.SYNC_SIGNATURES:
                await handle_signatures_sync(self, request_body)
            case EagleScannerPacketID.MALICIOUS_SIGNATURE_DETECTION:
                await handle_malicious_signature_detected(self, request_body)
                
    async def disconnect(self, code):
        if self._group_name == WebSocketGroupNames.EAGLE_CLIENTSCANNER.value:
            from ..handlers.eagle_scanner import handle_scanner_disconnect
            await handle_scanner_disconnect(self)
            
        return await super().disconnect(code)
    
    @property
    def hwid(self):
        return self._hwid
    
    @hwid.setter
    def hwid(self, hwid: Union[ClientHWIDS, Any]):
        if not isinstance(hwid, ClientHWIDS):
            raise TypeError(f"Can't convert type {type(hwid)} to type ClientHWIDs")
        self._hwid = hwid


    @property
    def connected_server(self) -> EagleServerConsumer:
        return self._connected_server
    
    @connected_server.setter
    def connected_server(self, server: Union[EagleServerConsumer, None]):
        if not isinstance(server, EagleServerConsumer):
            raise TypeError(f"Unable to convert type {type(server)} to 'EagleServerConsumer'")
        self._connected_server = server
        
    async def kick(self, reason: Optional[str] = "") -> bool:
        if self._connected_server:
            await self._connected_server.send(
                EagleServerPacketID.PLAYER_KICK,
                {"ip": self.address[0], "reason": reason},
            )
            return True
        return False
