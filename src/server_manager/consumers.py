import json
import logging
from shared.ws import RequestType
from channels.generic.websocket import WebsocketConsumer
from typing import Dict, Any

logger = logging.getLogger(__name__)


class EagleServerConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

        print(f"{self.scope.keys()}")

        self.send(
            text_data=json.dumps(
                {"type": "connection_eastablished", "message": "Connected!"}
            )
        )

    def receive(self, text_data=None, bytes_data=None):
        # Check if the request body is json convertible
        try:
            request_body: Dict[str, Any] = json.loads(text_data)
        except json.decoder.JSONDecodeError:
            print(f"Failed to parse request. (request body: {request_body})")
            return

        # Check if the request body have a type
        if not "type" in request_body.keys():
            print(f"Failed to get request type. (given request: {request_body})")
            return

        try:
            request_body["type"] = RequestType(request_body["type"])
        except ValueError:
            print(f"Undefined request type (given: {request_body['type']})")
            return

        match request_body["type"]:
            case RequestType.CONNECT:
                ...
