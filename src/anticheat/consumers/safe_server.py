import asyncio
import json
import logging
from time import time
from shared.enums import SafeServerPacketID, WebSocketGroupNames
from utils import check_request_body_key
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from dashboard.models import GameServer
from typing import Dict, Any, Union, Optional
from core import atomic_core


logger = logging.getLogger(__name__)


class SafeServerConsumer(AsyncWebsocketConsumer):
    """
    A WebSocket consumer for managing connections to the Eagle server.

    This class handles WebSocket connections, processes incoming messages,
    and sends responses based on the type of request received. It is designed
    to handle specific types of network requests and maintain connection state.

    Attributes:
        _group_name (str): The name of the group the consumer belongs to.
        _owner (User): The user who owns the connection.

    Methods:
        connect: Accepts the WebSocket connection and sends a connection established message.
        send: Sends data over the WebSocket connection, supports strings, dictionaries, and bytes.
        receive: Processes incoming WebSocket messages, parses JSON data, and handles different request types.
        group_name: Property for getting and setting the group name.
        owner: Property for getting and setting the owner of the connection.
    """

    def __init__(self, *args, **kwargs):
        """
        Initializes the WebSocket consumer.

        Args:
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.
        """
        super().__init__(*args, **kwargs)
        self._group_name = ""
        self._owner: User = None
        self._game_server: GameServer = None
        self._pending_responses = {}

    async def connect(self):
        """
        Handles WebSocket connection acceptance.

        This method is called when a WebSocket connection is established. It sends a
        connection established message to the client and logs the connection request.
        """
        await self.accept()
        self.address = tuple(self.scope["client"])

        logger.info(f"FXSERVER CONNECTION ATTACHED FROM {self.address[0]}:{self.address[1]}")

    async def send(
        self,
        packet_id: SafeServerPacketID,
        data: Union[Dict[Any, Any], str, bytes],
        bytes_data=None,
        close=False,
    ):
        """
        Sends data over the WebSocket connection.

        Args:
        -----
            packet_id (EagleServerPacketID): The packet id to send
            data (Union[Dict[Any, Any], str, bytes]): The data to be sent. Can be a dictionary, string, or bytes.
            bytes_data: Optional bytes data to be sent.
            close (bool): Whether to close the connection after sending the data.

        Returns:
        --------
            Awaitable: An awaitable object for the send operation.
        """
        # Check the packet id belongs to our registred packet ids
        if not packet_id in SafeServerPacketID.__members__.values():
            raise ValueError(f"Invalid Packet ID, got {packet_id}")

        # If data is bytes, decode it to a string
        if isinstance(data, bytes):
            data = data.decode()

        data["type"] = packet_id.value
        data["ut"] = int(time())  # Compress the timestamp from float to int

        data = json.dumps(data)

        try:
            await super().send(atomic_core.encode(data).decode(), bytes_data, close)
        except Exception as err:
            logger.error(f"Failed to send packet {packet_id}, {err}")

    async def receive(self, text_data=None, bytes_data=None):
        """
        Receives and processes incoming WebSocket messages.

        Args:
        -----
            text_data (str): Optional text data received from the WebSocket.
            bytes_data (bytes): Optional bytes data received from the WebSocket.

        This method attempts to parse the incoming message as JSON and processes
        the request based on its type. If the request type is not recognized, the
        connection is closed.
        """
        if bytes_data is not None:
            text_data = bytes_data.decode('utf-8')  
        try:
            await self.process_packet(atomic_core.decode(text_data))
        except Exception as err:
            logger.error(f"Error handling packet from FxServer, {err.__class__.__name__}: {err}", exc_info=True)

    async def process_packet(self, packet: Union[str, bytes]):
        try:
            # Attempt to parse the incoming message as JSON
            request_body: Dict[str, Any] = json.loads(packet)
        except json.decoder.JSONDecodeError:
            logger.warning(f"Failed to parse request. (request body: {packet})")
            return await self.close()

        # Check if the request body contains a 'type' key
        if not "type" in request_body.keys():
            logger.warning(
                f"Failed to get request type. (given request: {request_body})"
            )
            return await self.close()

        if not check_request_body_key(request_body, "ut", int):
            return await self.close()

        # Check the request's unix timestamp for integrity
        unix_timestamp = int(request_body["ut"])
        diff = time() - unix_timestamp
        if diff >= 120 and False:
            # Request was tampered
            # Optimize the logging
            for key, value in request_body.items():
                if (isinstance(value, str) or isinstance(value, bytes)) and len(value) > 40:
                    del request_body[key]

            logger.warning(
                f"Tampered request received from {self.address} ({diff}s), request: {request_body}"
            )
            return await self.close()
    
        
        try:
            # Convert the 'type' field to a PacketID
            request_body["type"] = SafeServerPacketID(request_body["type"])
        except ValueError:
            logger.warning(f"Undefined request type (given: {request_body['type']})")
            return await self.close()
    
        if request_body["type"] in self._pending_responses:
            self._pending_responses[request_body["type"]].set_result(request_body)
            del self._pending_responses[request_body["type"]]
    
        from ..handlers.safe_server import (
            handle_network_join,
            handle_sync_anticheat_configs,
            handle_request_player_join,
            handle_player_quit,
            handle_engine_check
        )

        # Handle the request based on its type
        match request_body["type"]:
            case SafeServerPacketID.NETWORK_JOIN:
                await handle_network_join(self, request_body)
            case SafeServerPacketID.SYNC_ANTICHEAT_CONFIGS:
                await handle_sync_anticheat_configs(self, request_body)
            case SafeServerPacketID.REQUEST_PLAYER_JOIN:
                await handle_request_player_join(self, request_body)
            case SafeServerPacketID.PLAYER_QUIT:
                await handle_player_quit(self, request_body)
            case SafeServerPacketID.ENGINE_CHECK:
                await handle_engine_check(self, request_body)

    async def disconnect(self, code):
        if self._group_name == WebSocketGroupNames.SAFE_SERVERS.value:
            from ..handlers.safe_server import handle_server_disconnect

            await handle_server_disconnect(self)
        return await super().disconnect(code)

    @property
    def group_name(self) -> None:
        """
        Gets the group name of the consumer.

        Returns:
        --------
            str: The group name.
        """
        return self._group_name

    @group_name.setter
    def group_name(self, value: Any) -> None:
        """
        Sets the group name of the consumer.

        Args:
        -----
            value (Any): The new group name.

        Raises:
        -------
            TypeError: If the value is not of type str.
        """
        if not isinstance(value, str):
            raise TypeError(
                f"Invalid room group name value, expected 'str' got {type(value)}"
            )
        self._group_name = value

    @property
    def owner(self) -> None:
        """
        Gets the owner of the connection.

        Returns:
        --------
            User: The owner user.
        """
        return self._owner

    @owner.setter
    def owner(self, value: Any) -> None:
        """
        Sets the owner of the connection.

        Args:
        -----
            value (Any): The new owner.

        Raises:
        -------
            TypeError: If the value is not of type User.
        """
        if not isinstance(value, User):
            raise TypeError(
                f"Invalid room group name value, expected 'User' got {type(value)}"
            )
        self._owner = value

    @property
    def game_server(self) -> GameServer:
        """
        Get the game server.

        Returns:
        --------
            User: The game server.
        """
        return self._game_server

    @game_server.setter
    def game_server(self, value: Any) -> None:
        """
        Sets the game server

        Args:
        -----
            value (Any): The new game server.

        Raises:
        -------
            TypeError: If the value is not of type GameServers.
        """
        if not isinstance(value, GameServer):
            raise TypeError(
                f"Invalid game server value, expected 'GameServers' got {type(value)}"
            )
        self._game_server = value

    async def kick_player(self, player_scanner, reason: Optional[str] = ""):
        if player_scanner.connected_server == self:
            await self.send(
                SafeServerPacketID.PLAYER_KICK,
                {"ip": player_scanner.address[0], "reason": reason},
            )

    async def request_status(self) -> Dict[str, Union[str, bool, int, float]]:
        response_future = asyncio.get_event_loop().create_future()
        self._pending_responses[SafeServerPacketID.REQUEST_STATUS] = response_future
        await self.send(SafeServerPacketID.REQUEST_STATUS, {})
        
        response = await response_future
        return response
