import os
import base64
from time import time
from datetime import timedelta, datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from core import atomic_core
from .safe_server import SafeServerConsumer
from django.conf import settings
from ..models import ClientHWID, MaliciousSignatures, Ban, DetectionReport
from utils import discord, represent_timedelta_string, check_request_body_key
from shared.models import ServerType
from shared.enums import (
    SafeEnginePacketID,
    SafeServerPacketID,
    WebSocketGroupNames,
    DetectionType,
)
from shared.flags import Flag, DetectionType
import json
from typing import Union, Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)


class SafeEngineConsumer(AsyncWebsocketConsumer):
    """
    An asynchronous WebSocket consumer designed to handle communication between a client and a server.

    Attributes:
    -----------
    _group_name (str): The name of the WebSocket group.
    _hwid (ClientHWID): The hardware ID of the client.
    _connected_server (SafeServerConsumer): The connected server instance.
    """

    def __init__(self, *args, **kwargs):
        """
        Initializes the AtomicSHield instance.

        Args:
        -----
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.
        """
        super().__init__(*args, **kwargs)
        self._group_name = ""
        self._hwid: ClientHWID = None
        self._connected_server: SafeServerConsumer = None
        self._detected_signatures: List[MaliciousSignatures] = []
        self._flagged: bool = False
        self._flags: List[Flag] = []
        self._type: ServerType = None

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
        packet_id: SafeEnginePacketID,
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
        if not packet_id in SafeEnginePacketID.__members__.values():
            raise ValueError(f"Invalid Packet ID, got {packet_id}")

        # If data is bytes, decode it to a string
        if isinstance(data, bytes):
            data = data.decode()

        # Add some required data to the response for security purposes
        data["type"] = packet_id.value
        data["ut"] = int(time())  # Compress the timestamp from float to int

        data = json.dumps(data)

        return await super().send(None, atomic_core.encode(data), close)

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
            value (Any): The n7ew group name. Must be a string.

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
        await self.process_packet(atomic_core.decode(text_data))

    async def process_packet(self, packet: Union[str, bytes]):
        try:
            # Attempt to parse the incoming message as JSON
            request_body: Dict[str, Any] = json.loads(packet)
        except json.decoder.JSONDecodeError:
            logger.warning(f"Failed to parse request. (request body: {request_body})")
            return await self.close()

        # Verify that the request body contains a 'type' key and 'ut' key
        if not check_request_body_key(request_body, "type", int):
            return await self.close()
        if not check_request_body_key(request_body, "ut", int):
            return await self.close()

        # Check the request's unix timestamp for integrity
        unix_timestamp = int(request_body["ut"])
        if (time() - unix_timestamp) >= 20:
            # Request was tampered
            logger.warning(
                f"Tampered request received from {self.address}, request: {request_body}"
            )
            return await self.close()

        try:
            # Convert the 'type' field to a PacketID
            request_body["type"] = SafeEnginePacketID(request_body["type"])
        except ValueError:
            logger.warning(f"Undefined request type (given: {request_body['type']})")
            return await self.close()

        from ..handlers.safe_engine import (
            handle_network_join,
            handle_signatures_sync,
            handle_cheat_detection,
        )

        match request_body["type"]:
            case SafeEnginePacketID.NETWORK_JOIN:
                await handle_network_join(self, request_body)
            case SafeEnginePacketID.SYNC_SIGNATURES:
                await handle_signatures_sync(self, request_body)
            case SafeEnginePacketID.CHEAT_DETECTION:
                await handle_cheat_detection(self, request_body)

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
        if self._group_name == WebSocketGroupNames.SAFE_ENGINES.value:
            from ..handlers.safe_engine import handle_scanner_disconnect

            await handle_scanner_disconnect(self)

        return await super().disconnect(code)

    @property
    def type(self) -> ServerType:
        return self._type

    @type.setter
    def type(self, new_type: ServerType):
        try:
            self._type = ServerType(new_type)
        except ValueError as err:
            raise TypeError(
                f"Can't convert type '{type(new_type)}' to 'ServerType'"
            ) from err

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
    def connected_server(self) -> SafeServerConsumer:
        """
        Gets the connected server.

        Returns:
        --------
            SafeServerConsumer: The connected server instance.
        """
        return self._connected_server

    @connected_server.setter
    def connected_server(self, server: Union[SafeServerConsumer, None]):
        """
        Sets the connected server.

        Args:
        -----
            server (Union[SafeServerConsumer, None]): The new connected server instance. Must be of type SafeServerConsumer.
        """
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

    @property
    def is_flagged(self) -> bool:
        """
        Check if the player is flagged from EagleAntiCheat

        Returns:
            bool: True if flagged else False
        """
        return len(self._flags) > 0

    @property
    def flag_message(self) -> str:
        """Gets the player flag message

        Returns:
            str: The flag message
        """
        if self.is_flagged:
            return self._flags[0]._message
        return ""

    async def flag_as(self, flag_type: DetectionType, message: str = "UnNormal Behaviour Detected"):
        self._flags.append(Flag(flag_type, message))
        await self.kick(message)

    def is_flagged_as(self, flag_type: DetectionType) -> bool:
        for flag in self._flags:
            if flag.type == flag_type:
                return True
        return False

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
            self._flags.append(
                Flag(
                    DetectionType.CUSTOM,
                    reason if len(reason) else "UnNormal behaviour detected",
                )
            )

        if self._connected_server:
            await self._connected_server.send(
                SafeServerPacketID.PLAYER_KICK,
                {"ip": self.address[0], "reason": reason},
            )
            return True
        return False

    async def ban(
        self,
        reason: str,
        duration: timedelta,
        target_game_server=None,
        detection_type: DetectionType = None,
        report: Dict[str, Any] = {},
        image_buffer: bytes = None,
    ):
        if image_buffer:
            screenshots_directory = os.path.join(
                settings.MEDIA_ROOT, "detections", "proofs"
            )
            os.makedirs(screenshots_directory, exist_ok=True)

            image_path = os.path.join(
                screenshots_directory,
                f"{self._hwid.username}_{self._hwid.id}-{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.png",
            )
            with open(image_path, "wb") as file:
                file.write(image_buffer)

        await self.kick(reason, flag=True)
        ban = Ban(
            hwid=self._hwid,
            duration=duration,
            reason=reason,
            game_server=target_game_server,
        )

        if len(report) or image_buffer:
            detection_report = DetectionReport(
                hwid=self._hwid,
                report=report,
                screenshot=image_path,
                detection_type=detection_type,
            )
            await detection_report.asave()
            ban.report = detection_report

        await ban.asave()

        try:
            await discord.send_discord_embed(
                settings.DETECTIONS_WEBHOOK_URL,
                "Banned Player",
                f"""
                **{self._hwid.username}** banned due to ```{reason}```
                **Ban Duration**: `{represent_timedelta_string(ban.duration)}`
                """,
                fields=[
                    (f"{key}:", f"```{value}```", False)
                    for key, value in report.items()
                ],
                image_buffer=image_buffer,
            )
        except Exception as err:
            logger.error(
                f"An error occured while trying to send discord detection report: {err}"
            )
