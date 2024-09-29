from datetime import timedelta
from channels.generic.websocket import AsyncWebsocketConsumer
from .eagle_server import EagleServerConsumer
from ..models import ClientHWID, MaliciousSignatures, Ban
from shared.ws import EagleScannerPacketID, EagleServerPacketID, WebSocketGroupNames
import json
from typing import Union, Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)


class EagleScanner(AsyncWebsocketConsumer):
    """
    An asynchronous WebSocket consumer designed to handle communication between a client and a server.

    Attributes:
    -----------
    _group_name (str): The name of the WebSocket group.
    _hwid (ClientHWID): The hardware ID of the client.
    _connected_server (EagleServerConsumer): The connected server instance.
    """

    def __init__(self, *args, **kwargs):
        """
        Initializes the EagleScanner instance.

        Args:
        -----
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.
        """
        super().__init__(*args, **kwargs)
        self._group_name = ""
        self._hwid: ClientHWID = None
        self._connected_server: EagleServerConsumer = None
        self._detected_signatures: List[MaliciousSignatures] = []
        self._flagged: bool = False
        self._flag_message: str = ""

    @property
    def is_flagged(self) -> bool:
        """
        Check if the player is flagged from EagleAntiCheat

        Returns:
            bool: True if flagged else False
        """
        return self._flagged

    @property
    def flag_message(self) -> str:
        """Gets the player flag message

        Returns:
            str: The flag message
        """
        return self._flag_message

    @flag_message.setter
    def flag_message(self, message: str):
        if not isinstance(message, str):
            raise TypeError(f"expected type 'str', got '{type(message)}'")
        self._flag_message = message

    async def connect(self):
        """
        Accepts the WebSocket connection and logs the client's IP address.

        Returns:
        --------
            None
        """
        await self.accept()
        self.address = tuple(self.scope["client"])
        logger.info(
            f"{self.address[0]}:{self.address[1]} Agent asking for connection..."
        )

    async def send(
        self,
        packet_id: EagleScannerPacketID,
        data: Union[Dict[Any, Any], str, bytes],
        bytes_data=None,
        close=False,
    ):
        """
        Sends data over the WebSocket connection.

        Args:
        -----
            packet_id (EagleScannerPacketID): The packet id to send
            data (Union[Dict[Any, Any], str, bytes]): The data to be sent. Can be a dictionary, string, or bytes.
            bytes_data: Optional bytes data to be sent.
            close (bool): Whether to close the connection after sending the data.

        Returns:
        --------
            Awaitable: An awaitable object for the send operation.
        """
        # Check the packet id belongs to our registred packet ids
        if not packet_id in EagleScannerPacketID.__members__.values():
            raise ValueError(f"Invalid Packet ID, got {packet_id}")

        # If data is bytes, decode it to a string
        if isinstance(data, bytes):
            data = data.decode()

        data["type"] = packet_id.value

        data = json.dumps(data)

        return await super().send(data, bytes_data, close)

    @property
    def group_name(self) -> str:
        """
        Gets the group name.

        Returns:
        --------
            str: The group name.
        """
        return self._group_name

    @group_name.setter
    def group_name(self, value: Any):
        """
        Sets the group name.

        Args:
        -----
            value (Any): The new group name. Must be a string.

        Raises:
        ------
            TypeError: If the value is not a string.
        """
        if not isinstance(value, str):
            raise TypeError(
                f"Invalid room group name value, expected 'User' got {type(value)}"
            )
        self._group_name = value

    async def receive(self, text_data=None, bytes_data=None):
        """
        Handles incoming WebSocket messages.

        Args:
        -----
            text_data (str): The incoming text data.
            bytes_data (bytes): The incoming bytes data.

        Returns:
        --------
            None
        """
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
            handle_game_anticheat_status,
        )

        match request_body["type"]:
            case EagleScannerPacketID.NETWORK_JOIN:
                await handle_network_join(self, request_body)
            case EagleScannerPacketID.SYNC_SIGNATURES:
                await handle_signatures_sync(self, request_body)
            case EagleScannerPacketID.MALICIOUS_SIGNATURE_DETECTION:
                await handle_malicious_signature_detected(self, request_body)
            case EagleScannerPacketID.GAME_ANTICHEAT_COMPONENT_STATUS:
                await handle_game_anticheat_status(self, request_body)

    async def disconnect(self, code):
        """
        Handles the disconnection of the WebSocket.

        Args:
        -----
            code: The disconnection code.

        Returns:
        --------
            Awaitable: An awaitable object for the disconnect operation.
        """
        if self._group_name == WebSocketGroupNames.EAGLE_CLIENTSCANNER.value:
            from ..handlers.eagle_scanner import handle_scanner_disconnect

            await handle_scanner_disconnect(self)

        return await super().disconnect(code)

    @property
    def hwid(self):
        """
        Gets the hardware ID.

        Returns:
        --------
            ClientHWID: The hardware ID.
        """
        return self._hwid

    @hwid.setter
    def hwid(self, hwid: Union[ClientHWID, Any]):
        """
        Sets the hardware ID.

        Args:
        -----
            hwid (Union[ClientHWID, Any]): The new hardware ID. Must be of type ClientHWID.

        Raises:
        ------
            TypeError: If the value is not of type ClientHWID.
        """
        if not isinstance(hwid, ClientHWID):
            raise TypeError(f"Can't convert type {type(hwid)} to type ClientHWIDs")
        self._hwid = hwid

    @property
    def connected_server(self) -> EagleServerConsumer:
        """
        Gets the connected server.

        Returns:
        --------
            EagleServerConsumer: The connected server instance.
        """
        return self._connected_server

    @connected_server.setter
    def connected_server(self, server: Union[EagleServerConsumer, None]):
        """
        Sets the connected server.

        Args:
        -----
            server (Union[EagleServerConsumer, None]): The new connected server instance. Must be of type EagleServerConsumer.

        Raises:
        ------
            TypeError: If the value is not of type EagleServerConsumer.
        """
        if not isinstance(server, EagleServerConsumer):
            raise TypeError(
                f"Unable to convert type {type(server)} to 'EagleServerConsumer'"
            )
        self._connected_server = server

    @property
    def detected_signatures(self) -> List[MaliciousSignatures]:
        return self._detected_signatures

    @detected_signatures.setter
    def detected_signatures(self, value: List[MaliciousSignatures]):
        if not isinstance(value, list):
            raise TypeError(
                f"detected_signatures setter expected type 'list', got {type(value)}"
            )

        for signature in value:
            if not isinstance(signature, MaliciousSignatures):
                raise TypeError(
                    f"signature {signature}  expected type 'MaliciousSignatures', got {type(value)}"
                )

        self._detected_signatures = value

    async def kick(
        self, reason: Optional[str] = "", flag: Optional[bool] = False
    ) -> bool:
        """
        Kicks a client by sending a PLAYER_KICK packet to the connected server.

        Args:
        -----
            reason (Optional[str]): The reason for kicking the client.

        Returns:
        --------
            bool: True if the kick was successful, False otherwise.
        """
        if flag:
            self._flagged = True
            self._flag_message = (
                reason if len(reason) else "UnNormal behaviour detected"
            )

        if self._connected_server:
            await self._connected_server.send(
                EagleServerPacketID.PLAYER_KICK,
                {"ip": self.address[0], "reason": reason},
            )
            return True
        return False

    async def ban(self, reason: str, duration: timedelta):
        self.kick(reason, flag=True)
        ban = Ban(hwid=self._hwid, duration=duration, reason=reason)
        ban.save()
