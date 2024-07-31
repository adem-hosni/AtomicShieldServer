import json
import logging
from shared.ws import RequestType
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from typing import Dict, Any, Union

logger = logging.getLogger(__name__)


class EagleServerConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._group_name = ""
        self._owner: User = None

    async def connect(self):
        await self.accept()
        self.address = tuple(self.scope["client"])

        await self.send({"type": "connection_eastablished", "message": "Connected!"})
        print(f"{self.address[0]}:{self.address[1]} asking for connection...")

    async def send(
        self, data: Union[Dict[Any, Any], str, bytes], bytes_data=None, close=False
    ):
        if isinstance(data, bytes):
            data = data.decode()

        if isinstance(data, dict):
            data = json.dumps(data)

        return await super().send(data, bytes_data, close)

    async def receive(self, text_data=None, bytes_data=None):
        # Check if the request body is json convertible
        try:
            request_body: Dict[str, Any] = json.loads(text_data)
        except json.decoder.JSONDecodeError:
            print(f"Failed to parse request. (request body: {request_body})")
            return self.close()

        # Check if the request body have a type
        if not "type" in request_body.keys():
            print(f"Failed to get request type. (given request: {request_body})")
            return self.close()

        try:
            request_body["type"] = RequestType(request_body["type"])
        except ValueError:
            print(f"Undefined request type (given: {request_body['type']})")
            return self.close()

        from ..handlers.eagle_server import handle_network_join

        match request_body["type"]:
            case RequestType.NETWORK_JOIN:
                await handle_network_join(self, request_body)

    @property
    def group_name(self) -> None:
        return self._group_name

    @group_name.setter
    def group_name(self, value: Any) -> None:
        if not isinstance(value, str):
            raise TypeError(
                f"Invalid room group name value, expected 'str' got {type(value)}"
            )
        self._group_name = value

    @property
    def owner(self) -> None:
        return self._owner

    @owner.setter
    def owner(self, value: Any) -> None:
        if not isinstance(value, User):
            raise TypeError(
                f"Invalid room group name value, expected 'User' got {type(value)}"
            )
        self._owner = value
