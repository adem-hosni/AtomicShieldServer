import time
import uuid
import asyncio
import traceback
from asgiref.sync import sync_to_async
import os
import base64
from anticheat.models import AntiCheatConfigTemplate
from time import time
from datetime import timedelta, datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from core import atomic_core
from .atomic_server import AtomicServerConsumer
from django.conf import settings
from ..models import HWID, MaliciousSignatures, Ban, DetectionReport
import utils
import utils.discord
from shared.models import ServerType
from shared.enums import (
    AtomicEnginePacketID,
    AtomicServerPacketID,
    WebSocketGroupNames,
    DetectionType,
    AtomicHeartbeatType,
    detection_messages,
)
from shared.flags import Flag, DetectionType
from .. import config_ids
import json
from typing import Union, Dict, List, Optional, Any, Tuple
import logging

logger = logging.getLogger(__name__)


class AtomicEngineConsumer(AsyncWebsocketConsumer):
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
        self._hwid: HWID = None
        self._connected_server: AtomicServerConsumer = None
        self._detected_signatures: List[MaliciousSignatures] = []
        self._flagged: bool = False
        self._flags: List[Flag] = []
        self._type: ServerType = None
        self._pending_responses: Dict[
            Tuple[AtomicEnginePacketID, str], asyncio.Future[Any]
        ] = {}
        self.build_timestamp = "NONE"
        self.received_ip: str = "NONE"
        self.joined_at = None
        self.last_heartbeats = {
            AtomicHeartbeatType.HEURISTIC_GUARD: 0,
            AtomicHeartbeatType.PROCESS_GUARD: 0
        }
        self.hearbeat_task = None
        self.guard_check_task = None

    def generate_request_id(self) -> str:
        """
        Generates a unique request ID for tracking purposes.

        Returns:
        --------
            str: A unique request ID.
        """
        return str(uuid.uuid4())
    
    def start_tasks(self):
        if not self.hearbeat_task:
            self.hearbeat_task = asyncio.create_task(self.send_heartbeats())

        if not self.guard_check_task:
            self.guard_check_task = asyncio.create_task(self.check_engine_guards())

    async def send_heartbeats(self):
        """Send periodic heartbeats to keep connection alive"""
        from services.websocket import fivem_conn_manager

        try:
            while True:
                await asyncio.sleep(10)
                if hasattr(self, "channel_name") and await fivem_conn_manager.get_engine_by_ip(self.address[0]):
                    await fivem_conn_manager.redis_manager.update_heartbeat(self.channel_name)
                    await self.send(AtomicEnginePacketID.HEARTBEAT, {})
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error(f"Engine Heartbeat error: {e}")

    async def check_engine_guards(self):
        """Check if the engine scanners are still alive"""
        from services.websocket import fivem_conn_manager
        try:
            while True:
                if not await fivem_conn_manager.get_scanner_by_hwid(self._hwid):
                    return
                
                await asyncio.sleep(15)
                current_time = time()
                for heartbeat_type, last_beat in self.last_heartbeats.items():
                    if last_beat == 0:
                        continue
                    elapsed = current_time - last_beat
                    if elapsed > 35:
                       # logger.warning(f"Engine {self._hwid.username} ({self.address}) missed {heartbeat_type.label} heartbeat, requesting debug logs...")
                        debug_logs = await self.request_debug_logs()
                        # Save debug logs to a file in bin directory
                        debug_log_path = os.path.join(settings.BIN_DIR, "debug_logs", "guard_stopped", f"debug_logs_{self._hwid.username}_{self._hwid.id}_{int(time())}.txt")
                        with open(debug_log_path, "w") as f:
                            f.write(debug_logs or "No debug logs received.")
                      #  logger.debug(f"Debug logs saved to {debug_log_path}")
                        # await self.kick("Anticheat Stopped")
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error(f"Engine Scanner Check error: {e}")

    async def connect(self):
        """
        Accepts the WebSocket connection and logs the client's IP address.

        Returns:
        --------
            None
        """
        await self.accept()

        client_ip, client_port = self.scope.get("client", ("unknown", 0))

        headers = dict((k.lower(), v) for k, v in self.scope.get("headers", []))
        x_forwarded_for = headers.get(b"x-forwarded-for")
        if x_forwarded_for:
            client_ip = x_forwarded_for.decode().split(",")[0].strip()

        self.address = (client_ip, client_port)
        logger.info(f"ENGINE CONNECTION ATTACHED FROM {self.address}")

    async def send(
        self,
        packet_id: AtomicEnginePacketID,
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
        if not packet_id in AtomicEnginePacketID.__members__.values():
            raise ValueError(f"Invalid Packet ID, got {packet_id}")

        # If data is bytes, decode it to a string
        if isinstance(data, bytes):
            data = data.decode()

        # Add some required data to the response for security purposes
        data["type"] = packet_id.value
        data["ut"] = int(time())  # Compress the timestamp from float to int

        data = json.dumps(data)

        try:
            return await super().send(None, atomic_core.encode(data), close)
        except Exception as err:
            logger.error(f"An error occured while sending packet to {self._hwid.username}: {err}")

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
            request_buffer = atomic_core.decode(text_data)
            request_body: Dict[str, Any] = json.loads(request_buffer)
        except Exception as err:
            logger.warning(f"Failed to parse request. ({err})")
            return await self.close()

        # Verify that the request body contains a 'type' key and 'ut' key
        if not utils.check_request_body_key(request_body, "type", int):
            return await self.close()
        if not utils.check_request_body_key(request_body, "ut", int):
            return await self.close()

        # Check the request's unix timestamp for integrity
        unix_timestamp = int(request_body["ut"])
        diff = time() - unix_timestamp
        if diff >= 120 and False:
            # Request was tampered
            logger.warning(f"Tampered request received from {self.address} ({diff}s)")
            return await self.close()

        try:
            await self.process_packet(request_body)
        except Exception as err:
            logger.error(
                f"Error handling packet {request_body['type']} from Engine, {err.__class__.__name__}: {err}"
            )

    async def process_packet(self, request_body: Dict[str, Any]):
        try:
            # Convert the 'type' field to a PacketID
            request_body["type"] = AtomicEnginePacketID(request_body["type"])
        except ValueError:
            logger.warning(f"Undefined request type (given: {request_body['type']})")
            return await self.close()

        packet_type = request_body["type"]
        request_id = request_body.get("request_id", None)
        key = (packet_type, request_id) if request_id else packet_type

        if key in self._pending_responses:
            future = self._pending_responses[key]
            if not future.cancelled():
                future.set_result(request_body)
            del self._pending_responses[key]

        from ..handlers.atomic_engine import (
            handle_network_join,
            handle_cheat_detection,
            handle_filehash_request,
            handle_hard_kick,
            handle_heartbeat,
        )


        match request_body["type"]:
            case AtomicEnginePacketID.NETWORK_JOIN:
                asyncio.create_task(handle_network_join(self, request_body))
            case AtomicEnginePacketID.CHEAT_DETECTION:
                asyncio.create_task(handle_cheat_detection(self, request_body))
            case AtomicEnginePacketID.REQUEST_FILEHASH:
                asyncio.create_task(handle_filehash_request(self, request_body))
            case AtomicEnginePacketID.FORCE_HARD_KICK:
                asyncio.create_task(handle_hard_kick(self, request_body))
            case AtomicEnginePacketID.HEARTBEAT:
                asyncio.create_task(handle_heartbeat(self, request_body))

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
            from ..handlers.atomic_engine import handle_scanner_disconnect

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
    def hwid(self, hwid: Union[HWID, Any]):
        """
        Sets the hardware ID.

        Args:
        -----
            hwid (Union[ClientHWID, Any]): The new hardware ID. Must be of type ClientHWID.

        Raises:
        ------
            TypeError: If the value is not of type ClientHWID.
        """
        if not isinstance(hwid, HWID):
            raise TypeError(f"Can't convert type {type(hwid)} to type ClientHWIDs")
        self._hwid = hwid

    @property
    def connected_server(self) -> AtomicServerConsumer:
        """
        Gets the connected server.

        Returns:
        --------
            SafeServerConsumer: The connected server instance.
        """
        return self._connected_server

    @connected_server.setter
    def connected_server(self, server: Union[AtomicServerConsumer, None]):
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
        Check if the player is flagged from AtomicShield

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
    ) -> Flag:

        flag = Flag(flag_type, report)
        self._flags.append(flag)
        return flag

    def is_flagged_as(self, flag_type: DetectionType) -> bool:
        for flag in self._flags:
            if flag.type == flag_type:
                return True
        return False

    async def kick(
        self,
        reason: Optional[str] = "",
        log: Optional[bool] = True
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
        from dashboard.models import AuditLogEntry

        if log:    
            await AuditLogEntry.acreate_entry(
                action=AuditLogEntry.Action.PLAYER_KICKED,
                severity=AuditLogEntry.Severity.MEDIUM,
                game_server=self._connected_server.game_server if self._connected_server else None,
                target_object=self._hwid,
                summary="Kicked player",
                details=f"Kicked player {self._hwid.username} - {self._hwid.id} | Reason: {reason or 'No reason provided'}",
                category=AuditLogEntry.Category.PLAYER,
            )

        if self._connected_server:
            logger.info(
                f"Kicking {self._hwid.username} ({self._hwid.id}) from {self._connected_server.game_server.name} ({self._connected_server.game_server.ip}) for reason: {reason or 'No reason provided'}"
            )
            await self._connected_server.send(
                AtomicServerPacketID.PLAYER_KICK,
                {
                    "ip": self.address[0],
                    "discordid": self._hwid.discord_id or f"NoDiscord-{self._hwid.id}",
                    "steamid": self._hwid.steam or f"NoSteam-{self._hwid.id}",
                    "reason": reason,
                },
            )
            return True
    
        return False

    async def send_report(
        self,
        reason,
        report,
        image_buffer,
        ban_assigned: bool = True,
        server_consumer: Optional[AtomicServerConsumer] = None,
        ban_id: Any = None,
    ):
        sent_report = report.copy()
        sent_report.pop("ss", None)

        if not ban_assigned:
            await utils.discord.send_discord_embed(
                "https://discord.com/api/webhooks/1370769531911540807/rHtkBD7ffXLtCg7DHe9odOJpueMiw_RU-Mxu26_iip7XqPu5zBJO6Ram5UidJ3CsPtGi",
                "CHEAT DETECTION - In Lobby",
                f"""
                **{self._hwid.username} - {self._hwid.id}** Detection Report ```{reason}```
                """,
                fields=[
                    (f"{key.replace('_', ' ').title()}:", f"```{value}```", False)
                    for key, value in sent_report.items()
                ],
                image_buffer=image_buffer,
            )
            return

        await utils.discord.send_discord_embed(
            settings.DETECTIONS_WEBHOOK_URL,
            "CHEAT DETECTION",
            f"""
            **{self._hwid.username} - {self._hwid.id}** banned due to ```{reason}```
            """,
            fields=[
                (f"{key.replace('_', ' ').title()}:", f"```{value}```", False)
                for key, value in sent_report.items()
            ]
            + [
                (
                    "Server:",
                    (
                        f"```{server_consumer.game_server.name}```"
                        if server_consumer
                        else "```NO SERVER CONNECTED```"
                    ),
                    False,
                ),
                ("BAN ID: ", f"**{ban_id}**", True),
            ],
            image_buffer=image_buffer,
        )

    async def save_report(
        self, detection_type: DetectionType, image_buffer: bytes, report: Dict[str, Any]
    ) -> DetectionReport:
        saved_report = report.copy()
        saved_report.pop("ss", None)
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

        if len(saved_report) or image_buffer:
            detection_report = DetectionReport(
                hwid=self._hwid,
                report=saved_report,
                screenshot=image_path.removeprefix(settings.MEDIA_ROOT),
                detection_type=detection_type,
            )
            await detection_report.asave()
            return detection_report

    async def ban(
        self,
        reason: str,
        duration: timedelta,
        target_game_server=None,
        detection_type: DetectionType = DetectionType.CUSTOM,
        report: DetectionReport = None,
        image_buffer: bytes = None,
    ) -> Ban:
        import traceback

        if not isinstance(report, DetectionReport):
            report = await self.save_report(detection_type, image_buffer, report)

        ban = Ban(
            hwid=self._hwid,
            duration=duration,
            reason=reason,
            game_server=target_game_server,
        )
        ban.report = report
        await ban.asave()

        try:
            if target_game_server:
                send_alerts = True  # TODO: await target_game_server.configuration.aget_config("allow_send_alert")
                if send_alerts:
                    # Fetch webhook URL
                    webhook_url = (
                        await target_game_server.aget_configurations()
                    ).get_webhook_url("ban")
                    logger.debug(f"[BAN] Webhook URL: {webhook_url}")

                    if webhook_url:
                        # Special case for cheat detection
                        if detection_type == DetectionType.CHEAT_SIGNATURE_FOUND:
                            if (
                                report.report.get("string", "")
                                == "D:\\Projets\\TZX\\x64\\Release\\Module.pdb"
                            ):
                                reason = "External Cheat Detected (TZX)"
                                logger.debug(
                                    "[BAN] Cheat signature detected, updating reason"
                                )

                        # Fetch embed template
                        ban_embed = await (
                            await target_game_server.aget_configurations()
                        ).get_discord_embed("ban")
                        logger.debug(f"[BAN] Ban embed template: {ban_embed}")

                        # Format helper
                        def format_text(text: str) -> str:
                            try:
                                return utils.format_string(
                                    text or "",
                                    {
                                        "player_name": getattr(
                                            self._hwid, "username", "Unknown"
                                        ),
                                        "date": ban.banned_at.strftime(
                                            "%Y-%m-%d %H:%M:%S"
                                        ),
                                        "duration": "Permanent",
                                        "reason": ban.reason.title(),
                                        "discord": f"<@{self._hwid.discord_id}>",
                                        "server_name": getattr(
                                            target_game_server, "name", "Unknown"
                                        ),
                                        "admin": "System",
                                        "time": ban.banned_at.strftime(
                                            "%d/%m/%Y, %H:%M"
                                        ),
                                        "ip": f"||{self.address[0]}||",
                                        "fivem_license": self._hwid.fivem_license,
                                        "steam_id": self._hwid.steam,
                                        "discord_id": self._hwid.discord_id,
                                        "screenshot_url": (
                                            f"https://atomic-shield.com{settings.MEDIA_URL}{report.screenshot.name}"
                                            if report.screenshot
                                            else ""
                                        ),
                                    },
                                )
                            except Exception as e:
                                logger.error(
                                    f"[BAN] Error formatting text: {e}\n{traceback.format_exc()}"
                                )
                                return text or ""

                        # Build embed
                        embed_title = (
                            format_text(ban_embed.get("title", ""))
                            + f"| BanID: {ban.id}"
                            or "Player Banned"
                        )
                        embed_description = (
                            format_text(ban_embed.get("description", "")) or ""
                        )
                        embed_thumbnail = format_text(ban_embed.get("thumbnail", ""))

                        fields = []
                        for idx, field in enumerate(ban_embed.get("fields", [])):
                            try:
                                field_name = (
                                    format_text(field.get("name", "")) or f"Field{idx}"
                                )
                                field_value = (
                                    format_text(field.get("value", "")) or "N/A"
                                )
                                inline = bool(field.get("inline", False))
                                fields.append(
                                    (field_name, field_value, inline)
                                )  # tuple instead of dict
                            except Exception as e:
                                logger.error(
                                    f"[BAN] Error processing field {idx}: {e}\n{traceback.format_exc()}"
                                )

                        embed_color = int(
                            ban_embed.get("color", "#dc2626").lstrip("#"), 16
                        )
                        logger.debug(f"[BAN] Embed color: {embed_color}")

                        footer_conf = ban_embed.get("footer", {})
                        footer_text = format_text(footer_conf.get("text", ""))
                        footer_icon = footer_conf.get("icon", "")

                        author_title = "Atomic Shield - FiveM AntiCheat©"
                        avatar_url = "https://media.discordapp.net/attachments/1358196688661254374/1411004354441252954/atomic.png?ex=68b313b5&is=68b1c235&hm=0cb1cb9669f9dd90cfe491849cab9d01eacdccaa612c7a505c597d3d88f3cd0d&=&format=webp&quality=lossless&width=930&height=930"

                        logger.debug("[BAN] Sending embed to Discord...")
                        try:
                            response = await utils.discord.send_discord_embed(
                                webhook_url,
                                title=embed_title,
                                description=embed_description,
                                fields=fields,
                                color=embed_color,
                                author=author_title,
                                footer=footer_text,
                                footer_icon_url=footer_icon,
                                author_icon_url=avatar_url,
                                avatar_url=avatar_url,
                                image_buffer=image_buffer,
                                thumbnail_url=embed_thumbnail,
                            )
                            logger.debug(f"[BAN] Discord response: {response}")
                        except Exception as e:
                            logger.error(
                                f"[BAN] Discord sending failed: {e}\n{traceback.format_exc()}"
                            )

        except Exception as err:
            logger.error(f"[BAN] Unexpected error: {err}\n{traceback.format_exc()}")

        return ban

    async def handle_basic_checks(
        self,
        detection: DetectionType,
        report: Dict[str, Any],
        server: AtomicServerConsumer,
    ) -> bool:
        logger.debug(f"Handling {detection.label} for {self._hwid.username} {f'on {server.game_server.name}' if server else ''}")

        if not server:
            return ""

        # Check if the malicious driver is about Process Hacker
        try:
            if detection == DetectionType.MALICIOUS_DRIVER:
                if str(report["driver"]).endswith("kprocesshacker.sys"):
                    try:
                        processhacker_allowed = (
                            await (await server.game_server.aconfigurations).aget_config(
                                "block_process_hacker"
                            )
                        )
                    except AntiCheatConfigTemplate.DoesNotExist:
                        processhacker_allowed = False


                    if not processhacker_allowed:
                        await self.flag_as(detection, report)
                        return detection_messages[detection]

            # Check for Secure Boot is forced
            if detection == DetectionType.SECURE_BOOT_DISABLED:
                try:
                    force_secureboot = await (await server.game_server.aconfigurations).aget_config(
                        "force_secureboot"
                    )
                except AntiCheatConfigTemplate.DoesNotExist:
                    force_secureboot = False
                if force_secureboot:
                    await self.flag_as(detection, report)
                    return detection_messages[detection]

            # Check for Force Test Signing Disabled
            if detection == DetectionType.TEST_SIGNING_ENABLED:
                try:
                    testsigning_enabled = await (await server.game_server.aconfigurations).aget_config(
                        "force_testsigning"
                    )
                except AntiCheatConfigTemplate.DoesNotExist:
                    testsigning_enabled = False

                if testsigning_enabled:
                    await self.flag_as(detection, report)
                    return detection_messages[detection]

            # Check for Allowed Server Plugins
            if detection == DetectionType.DLL_FOUND:
                try:
                    allowed_plugins = await (await server.game_server.aconfigurations).aget_config(
                        "allowed_plugins"
                    )
                except AntiCheatConfigTemplate.DoesNotExist:
                    allowed_plugins = ""

                if report["plugin"].strip().lower() in allowed_plugins.lower():
                    await self.flag_as(detection, report)
                    return utils.format_string(detection_messages[detection], report)

                logger.info(
                    f"CHEATER REPORT! {self._hwid.computer_name} is flagged as {detection} in {self._connected_server.game_server.name if self._connected_server else 'UNKNOWN'} ({server.game_server.ip})"
                )

            # Check for Allowed Server Plugins
            if detection == DetectionType.MEMORY_INTEGRITY_DISABLED:
                try:
                    memory_integrity = await (await server.game_server.aconfigurations).aget_config(
                        "memory_integrity"
                    )
                except AntiCheatConfigTemplate.DoesNotExist:
                    memory_integrity = True

                if memory_integrity:
                    return utils.format_string(detection_messages[detection], report)

                logger.info(
                    f"CHEATER REPORT! {self._hwid.computer_name} is flagged as {detection} in {self._connected_server.game_server.name if self._connected_server else '<NO SERVER>'} ({server.game_server.ip})"
                )
        except Exception as err:
            logger.error(f"Unable to handle basic checks: {err}")
            logger.error(''.join(traceback.format_exception(err)))
        return ""

    async def request_screenshot(self, base64decode: bool = True) -> str:
        if self._connected_server:
            logger.info(
                f"Screenshot requested of {self._hwid.username} from {self._connected_server.game_server.name} ({self._connected_server.game_server.ip})..."
            )
        else:
            logger.info(f"Screenshot requested of {self._hwid.username}")
        response_future = asyncio.get_event_loop().create_future()
        request_id = self.generate_request_id()

        self._pending_responses[
            (AtomicEnginePacketID.REQUEST_SCREENSHOT, request_id)
        ] = response_future

        # notifications.notify_server(
        #     notifications.NotificationType.SCREENSHOT,
        #     self._connected_server.game_server,
        #     player_name=self._hwid.username if self._hwid else "<Unknown>",
        #     screenshot="screenshot.png",
        #     report={"created_at": timezone.now()},
        # )

        await self.send(
            AtomicEnginePacketID.REQUEST_SCREENSHOT, {"request_id": request_id}
        )
        try:
            response = await asyncio.wait_for(response_future, 35)
        except asyncio.TimeoutError:
            logger.error(
                f"Failed to retreive screenshot from {self._hwid.username} {self.address}!"
            )
            self._pending_responses.pop(
                (AtomicEnginePacketID.REQUEST_SCREENSHOT, request_id), None
            )
            return None

        if not response["success"]:
            logger.warning(
                f"Failed to retreive screenshot from {self._hwid.username}. {response['message']}"
            )
            return None

        logger.info(
            f"Screenshot of {self._hwid.username} received successfully ({len(response['buffer'])} bytes)!"
        )

        return (
            base64.b64decode(response["buffer"]) if base64decode else response["buffer"]
        )

    async def get_screenshot(self) -> str:
        image_buffer = await self.request_screenshot(base64decode=True)
        if not image_buffer:
            return None

        # Encode buffer to base64
        image_base64 = base64.b64encode(image_buffer).decode("utf-8")
        return image_base64

    async def run_scanners(self, run: bool) -> bool:
        return
        logger.info(
            f"Turning \"{self._hwid.username}\" engine scanners {'on' if run else 'off'}..."
        )
        response_future = asyncio.get_event_loop().create_future()
        request_id = self.generate_request_id()

        self._pending_responses[(AtomicEnginePacketID.RUN_SCANNERS, request_id)] = (
            response_future
        )

        await self.send(
            AtomicEnginePacketID.RUN_SCANNERS, {"run": run, "request_id": request_id}
        )

        try:
            response = await asyncio.wait_for(response_future, 12)
        except asyncio.TimeoutError:
            logger.error(
                f"Failed to {'start' if run else 'shutdown'} engine scanners of {self._hwid.username} {self.address}!"
            )
            self._pending_responses.pop(
                (AtomicEnginePacketID.RUN_SCANNERS, request_id), None
            )
            return False
        return response["success"]

    async def shutdown(self) -> bool:
        logger.info(f"Shutting down engine of {self._hwid.username} {self.address}...")
        response_future = asyncio.get_event_loop().create_future()
        request_id = self.generate_request_id()
        self._pending_responses[(AtomicEnginePacketID.ENGINE_SHUTDOWN, request_id)] = (
            response_future
        )
        await self.send(
            AtomicEnginePacketID.ENGINE_SHUTDOWN, {"request_id": request_id}
        )
        return True

    async def request_debug_logs(self) -> str:
        logger.info(
            f"Debug logs requested from {self._hwid.username} {self.address}..."
        )

        response_future = asyncio.get_event_loop().create_future()
        request_id = self.generate_request_id()
        key = (AtomicEnginePacketID.REQUEST_DEBUG_LOGS, request_id)

        self._pending_responses[key] = response_future
        await self.send(
            AtomicEnginePacketID.REQUEST_DEBUG_LOGS, {"request_id": request_id}
        )

        try:
            waited = 0
            interval = 0.5
            max_wait = 30

            while waited < max_wait:
                if response_future.done():
                    response = response_future.result()
                    logger.info(
                        f"Logs received from {self._hwid.username} {self.address} ({len(response['logs'])} bytes)"
                    )
                    return response["logs"]
                await asyncio.sleep(interval)
                waited += interval

            raise asyncio.TimeoutError("Log request timed out")

        except asyncio.CancelledError:
            logger.warning(
                f"Cancelled debug log request for {self._hwid.username} {self.address}"
            )
            return ""
        except asyncio.TimeoutError:
            logger.error(
                f"Timeout while retrieving logs from {self._hwid.username} {self.address}"
            )
            return ""
        finally:
            self._pending_responses.pop(key, None)

    async def request_file_upload(self, file_path: str) -> bytes:
        logger.info(f"File upload requested of {self._hwid.username} ({file_path})...")
        response_future = asyncio.get_event_loop().create_future()
        request_id = self.generate_request_id()

        self._pending_responses[
            (AtomicEnginePacketID.REQUEST_FILE_UPLOAD, request_id)
        ] = response_future

        await self.send(
            AtomicEnginePacketID.REQUEST_FILE_UPLOAD,
            {"file_path": file_path, "request_id": request_id},
        )

        try:
            response = await asyncio.wait_for(response_future, 120 * 2)
        except asyncio.TimeoutError:
            logger.error(
                f"Failed to retreive file upload from {self._hwid.username} {self.address}!"
            )
            self._pending_responses.pop(
                (AtomicEnginePacketID.REQUEST_FILE_UPLOAD, request_id), None
            )
            return None

        if not response["success"]:
            logger.warning(
                f"Failed to retreive file upload from {self._hwid.username}. {response['message']}"
            )
            return None

        logger.info(
            f"File upload of {self._hwid.username} received successfully ({len(response['buffer'])} bytes)!"
        )

        return base64.b64decode(response["buffer"])

    async def get_bans(self) -> List[Ban]:
        """
        Retrieves the bans associated with the client's hardware ID.

        Returns:
            List[Ban]: A list of Ban objects associated with the client's hardware ID.
        """
        return await sync_to_async(list)(
            Ban.objects.filter(hwid=self.hwid).order_by("banned_at")
        )

    async def get_last_ban(
        self, game_server_consumer: Optional[AtomicServerConsumer] = None
    ) -> Optional[Ban]:
        """
        Retrieves the last ban associated with the client's hardware ID.

        Returns:
            Optional[Ban]: The last Ban object associated with the client's hardware ID, or None if no bans exist.
        """
        bans = await self.get_bans()
        if not bans:
            return None
        for ban in reversed(bans):
            if (
                game_server_consumer
                and ban.game_server != game_server_consumer.game_server
            ):
                continue
            if not ban.is_expired and ban.active:
                return ban
        return None

    @property
    def play_time(self) -> float:
        if not self._connected_server or self.joined_at:
            return 0
        return time.time() - self.joined_at
