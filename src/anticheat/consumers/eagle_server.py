import json
import logging
from shared.ws import EagleServerPacketID, WebSocketGroupNames
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from dashboard.models import GameServers
from typing import Dict, Any, Union, Optional

logger = logging.getLogger(__name__)


class EagleServerConsumer(AsyncWebsocketConsumer):
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
        self._game_server: GameServers = None

    async def connect(self):
        """
        Handles WebSocket connection acceptance.

        This method is called when a WebSocket connection is established. It sends a
        connection established message to the client and logs the connection request.
        """
        await self.accept()
        self.address = tuple(self.scope["client"])

        logger.info(f"{self.address[0]}:{self.address[1]} asking for connection...")

    async def send(
        self,
        packet_id: EagleServerPacketID,
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
        if not packet_id in EagleServerPacketID.__members__.values():
            raise ValueError(f"Invalid Packet ID, got {packet_id}")

        # If data is bytes, decode it to a string
        if isinstance(data, bytes):
            data = data.decode()

        data["type"] = packet_id.value

        data = json.dumps(data)

        return await super().send(data, bytes_data, close)

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
            request_body["type"] = EagleServerPacketID(request_body["type"])
        except ValueError:
            logger.warn(f"Undefined request type (given: {request_body['type']})")
            return self.close()

        from ..handlers.eagle_server import (
            handle_network_join,
            handle_sync_anticheat_configs,
            handle_request_player_join,
            handle_load_anticheat_scripts,
        )

        # Handle the request based on its type
        match request_body["type"]:
            case EagleServerPacketID.NETWORK_JOIN:
                await handle_network_join(self, request_body)
            case EagleServerPacketID.SYNC_ANTICHEAT_CONFIGS:
                await handle_sync_anticheat_configs(self, request_body)
            case EagleServerPacketID.REQUEST_PLAYER_JOIN:
                await handle_request_player_join(self, request_body)
            case EagleServerPacketID.SYNC_ANTICHEAT_COMPONENTS:
                await handle_load_anticheat_scripts(self, request_body)

    async def disconnect(self, code):
        if self._group_name == WebSocketGroupNames.EAGLE_SERVERS.value:
            from ..handlers.eagle_server import handle_server_disconnect

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
    def game_server(self) -> GameServers:
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
        if not isinstance(value, GameServers):
            raise TypeError(
                f"Invalid game server value, expected 'GameServers' got {type(value)}"
            )
        self._game_server = value

    async def kick_player(self, player_scanner, reason: Optional[str] = ""):
        if player_scanner.connected_server == self:
            await self.send(
                EagleServerPacketID.PLAYER_KICK,
                {"ip": player_scanner.address[0], "reason": reason},
            )

    async def request_status(self) -> Dict[str, Union[str, bool, int, float]]:
        await self.send(EagleServerPacketID.REQUEST_STATUS)

        response_event = await self.channel_layer.receive(self.channel_name)
        print(response_event)
