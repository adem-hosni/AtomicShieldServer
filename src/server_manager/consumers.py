import json
import logging
from channels.generic.websocket import WebsocketConsumer


logger = logging.getLogger(__name__)

class EagleServerConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        
        print(f"{self.scope}")
        
        self.send(text_data=json.dumps({
            "type": "connection_eastablished",
            "message": "Connected!"
        }))
