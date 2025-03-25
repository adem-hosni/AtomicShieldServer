import asyncio
import os
import base64
from anticheat.models import AntiCheatConfigTemplates
from time import time
from datetime import timedelta, datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from core import atomic_core
from .safe_server import SafeServerConsumer
from django.conf import settings
from ..models import ClientHWID, MaliciousSignatures, Ban, DetectionReport
import utils
import utils.discord
from shared.models import ServerType
from shared.enums import (
    SafeEnginePacketID,
    SafeServerPacketID,
    WebSocketGroupNames,
    DetectionType,
    detection_messages
)
from shared.flags import Flag, DetectionType
from .. import config_ids
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
        self._pending_responses = {}

    async def connect(self):
        """
        Accepts the WebSocket connection and logs the client's IP address.

        Returns:
        --------
            None
        """
        await self.accept()
        self.address = tuple(self.scope["client"])
        logger.info(f"ENGINE CONNECTION ATTACHED FROM {self.address}")

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
        try:
            # Attempt to parse the incoming message as JSON
            request_body: Dict[str, Any] = json.loads(atomic_core.decode(text_data))
        except json.decoder.JSONDecodeError:
            logger.warning(f"Failed to parse request. (request body: {request_body})")
            return await self.close()

        # Verify that the request body contains a 'type' key and 'ut' key
        if not utils.check_request_body_key(request_body, "type", int):
            return await self.close()
        if not utils.check_request_body_key(request_body, "ut", int):
            return await self.close()

        # Check the request's unix timestamp for integrity
        unix_timestamp = int(request_body["ut"])
        diff = time() - unix_timestamp
        if diff >= 120:
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
            await self.process_packet(request_body)
        except Exception as err:
            logger.error(f"Error handling packet {request_body['type']} from Engine, {err.__class__.__name__}: {err}")


    async def process_packet(self, request_body: Dict[str, Any]):
        try:
            # Convert the 'type' field to a PacketID
            request_body["type"] = SafeEnginePacketID(request_body["type"])
        except ValueError:
            logger.warning(f"Undefined request type (given: {request_body['type']})")
            return await self.close()
        
        if request_body["type"] in self._pending_responses:
            if not self._pending_responses[request_body["type"]].cancelled():
                self._pending_responses[request_body["type"]].set_result(request_body)
            del self._pending_responses[request_body["type"]]
        
        from ..handlers.safe_engine import (
            handle_network_join,
            handle_cheat_detection,
        )

        match request_body["type"]:
            case SafeEnginePacketID.NETWORK_JOIN:
                asyncio.create_task(handle_network_join(self, request_body))
            case SafeEnginePacketID.CHEAT_DETECTION:
                asyncio.create_task(handle_cheat_detection(self, request_body))

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

            await handle_scanner_disconnect(self, code)

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

    def get_flags(self) -> List[Flag]:
        return self._flags

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
            return self._flags[0].message
        return ""

    async def flag_as(
        self, flag_type: DetectionType, report: Dict[str, Any] = {}
    ):
        self._flags.append(Flag(flag_type, report))

    def is_flagged_as(self, flag_type: DetectionType) -> bool:
        for flag in self._flags:
            if flag.type == flag_type:
                return True
        return False

    async def kick(
        self,
        reason: Optional[str] = "",
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
        detection_type: DetectionType = DetectionType.CUSTOM,
        report: Dict[str, Any] = {},
        image_buffer: bytes = None,
    ):
        image_path = ""
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

        # await self.kick(reason, flag=True, detection_type=detection_type)
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
                screenshot=image_path.removeprefix(settings.BASE_DIR.name).removeprefix(settings.MEDIA_URL),
                detection_type=detection_type,
            )
            await detection_report.asave()
            ban.report = detection_report

        await ban.asave()

        embed_title = "Banned Player"
        try:
            await utils.discord.send_discord_embed(
                settings.DETECTIONS_WEBHOOK_URL,
                embed_title,
                f"""
                **{self._hwid.username}** banned due to ```{reason}```
                """,
                fields=[
                    (f"{key}:", f"```{value}```", False)
                    for key, value in report.items()
                ],
                image_buffer=image_buffer,
            )
            if self._connected_server:
                send_alerts = await self._connected_server.game_server.get_config_by_id(config_ids.ALLOW_SEND_DETECTION_ALERT)

                if send_alerts:
                    webhook_url = await self._connected_server.game_server.get_config_by_id(config_id=config_ids.DISCORD_WEBHOOK_URL)
                    if len(webhook_url) > 0:
                        if detection_type == DetectionType.CHEAT_SIGNATURE_FOUND:
                            if report.get("string", "") == "D:\\Projets\\TZX\\x64\\Release\\Module.pdb":
                                reason = "External Cheat Detected (TZX)"

                        embed_title = await self._connected_server.game_server.get_config_by_id(config_id=config_ids.DISCORD_EMBED_TITLE)
                        embed_title = utils.format_string(embed_title, {"name": self._hwid.username})
                        allow_send_screenshot = bool(await self._connected_server.game_server.get_config_by_id(config_id=config_ids.ALLOW_SEND_SCREENSHOT_ALERT))


                        author_title = "Atomic Shield - FiveM AntiCheat©"
                        embed_title = "**A cheater has been Banned by AtomicShield**"
                        avatar_url = "https://media.discordapp.net/attachments/944710024670879804/1346134230106636418/atomic.png"
                        current_time = datetime.now().strftime("%a %B %d %Y %H:%M:%S GMT %z")
                        embed_description = f"""
                **Name:** {self._hwid.username}
                **Reason:** {reason}
                **Steam:** {self._hwid.steam}
                **License:** {self._hwid.fivem_license}
                **Discord:** {self._hwid.discord_id}
                **Was this a false positive? Open a ticket in our Discord.**\ndiscord.gg/atomic-shield - <https://atomic-shield.com/>
                """
                        footer_text = f"AtomicShield - {current_time}"
                        await utils.discord.send_discord_embed(
                            webhook_url,
                            embed_title,
                            embed_description,
                            author= author_title,
                            footer=footer_text,
                            footer_icon_url=avatar_url,
                            author_icon_url= avatar_url,
                            avatar_url=avatar_url,
                            image_buffer=image_buffer if allow_send_screenshot else None,
                        )


        except Exception as err:
            logger.error(
                f"An error occured while trying to send discord detection report: {err}"
            )
    
    async def handle_basic_checks(self, detection: DetectionType, report: Dict[str, Any]) -> bool:
        # Check if the malicious driver is about Process Hacker
        try:
            logger.info(report)
            if detection == DetectionType.MALICIOUS_DRIVER:
                if str(report["driver_name"]).endswith(
                    "kprocesshacker.sys"
                ):
                    try:
                        processhacker_allowed = (
                            await self._connected_server.game_server.get_config_by_id(
                                config_ids.ALLOW_PROCESS_HACKER
                            )
                        )
                    except AntiCheatConfigTemplates.DoesNotExist:
                        processhacker_allowed = False

                    if not processhacker_allowed:
                        await self.kick(detection_messages[detection])
                        return True

            # Check for Secure Boot is forced
            if detection == DetectionType.SECURE_BOOT_DISABLED:
                try:
                    force_secureboot = (
                        await self._connected_server.game_server.get_config_by_id(
                            config_ids.FORCE_SECUREBOOT
                        )
                    )
                except AntiCheatConfigTemplates.DoesNotExist:
                    force_secureboot = False
                if force_secureboot:
                    await self.kick(detection_messages[detection])
                    return True

            # Check for Force Test Signing Disabled
            if detection == DetectionType.TEST_SIGNING_ENABLED:
                try:
                    testsigning_enabled = (
                        await self._connected_server.game_server.get_config_by_id(
                            config_ids.FORCE_TESTSIGNING
                        )
                    )
                except AntiCheatConfigTemplates.DoesNotExist:
                    testsigning_enabled = False

                if testsigning_enabled:
                    await self.kick(detection_messages[detection])
                    return True
            
            # Check for Allowed Server Plugins
            if detection == DetectionType.DLL_FOUND:
                try:
                    allowed_plugins = (
                        await self._connected_server.game_server.get_config_by_id(
                            config_ids.ALLOWED_FIVEM_PLUGINS
                        )
                    )
                except AntiCheatConfigTemplates.DoesNotExist:
                    allowed_plugins = ""

                if report["plugin"].strip().lower() in allowed_plugins.lower():
                    await self.kick(utils.format_string(detection_messages[detection], report))
                    return True
                
                logger.info(f"CHEATER REPORT! {self._hwid.computer_name} is flagged as {detection} in {self._connected_server.game_server.name} ({self._connected_server.game_server.ip})")
        except Exception as err:
            logger.error(f"Unable to handle basic checks: {err}")
        return False

    async def request_screenshot(self) -> str:
        if self._connected_server:
            logger.info(f"Screenshot requested of {self._hwid.username} from {self._connected_server.game_server.name} ({self._connected_server.game_server.ip})...")
        else:
            logger.info(f"Screenshot requested of {self._hwid.username}")
        response_future = asyncio.get_event_loop().create_future()
        self._pending_responses[SafeEnginePacketID.REQUEST_SCREENSHOT] = response_future
        
        await self.send(SafeEnginePacketID.REQUEST_SCREENSHOT, {})
        response = await response_future
        
        if not response["success"]:
            logger.warning(f"Failed to retreive screenshot from {self._hwid.username}. {response['message']}")
            return None

        image_buffer = base64.b64decode(response["buffer"])

        image_path = None
        if image_buffer:
            screenshots_directory = os.path.join(
                settings.MEDIA_ROOT, "screenshot"
            )
            os.makedirs(screenshots_directory, exist_ok=True)

            image_path = os.path.join(
                screenshots_directory,
                f"{self._hwid.id}.png",
            )
            with open(image_path, "wb") as file:
                file.write(image_buffer)

        return f"{settings.MEDIA_URL}screenshot/{self._hwid.id}.png"
    
    async def run_scanners(self, run: bool) -> bool:
        response_future = asyncio.get_event_loop().create_future()
        self._pending_responses[SafeEnginePacketID.RUN_SCANNERS] = response_future        

        await self.send(SafeEnginePacketID.RUN_SCANNERS, {"run": run})

        try:
            response = await asyncio.wait_for(response_future, 12)
        except asyncio.TimeoutError:
            logger.error(f"Failed to {'start' if run else 'shutdown'} engine scanners of {self._hwid.username} {self.address}!")
            response_future.cancel()
            return False
        return response["success"]        
