# signaling/consumers.py
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)

class SignalingConsumer(AsyncWebsocketConsumer):
    rooms = {}

    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'signaling_{self.room_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # Add client to room
        await self.add_client_to_room()
        
        await self.accept()
        logger.info(f"Client {self.channel_name} connected to room {self.room_id}")

    async def disconnect(self, close_code):
        await self.remove_client_from_room()
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        logger.info(f"Client {self.channel_name} disconnected from room {self.room_id}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        logger.info(f"Received data from {self.channel_name}: {data}")

        # Normalize signaling key names to 'action'
        action = data.get('action') or data.get('type')

        if action in ['offer', 'answer', 'candidate']:
            # Relay to all other clients in the room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'relay_signal',
                    'data': data,
                    'sender_channel': self.channel_name
                }
            )

    async def relay_signal(self, event):
        if self.channel_name != event['sender_channel']:
            await self.send(text_data=json.dumps(event['data']))
            logger.info(f"Relayed {event['data'].get('action') or event['data'].get('type')} to {self.channel_name}")

    @sync_to_async
    def add_client_to_room(self):
        if self.room_id not in self.rooms:
            self.rooms[self.room_id] = []
        if self.channel_name not in self.rooms[self.room_id]:
            self.rooms[self.room_id].append(self.channel_name)
            logger.info(f"Client added to room {self.room_id}. Current clients: {len(self.rooms[self.room_id])}")

    @sync_to_async
    def remove_client_from_room(self):
        if self.room_id in self.rooms and self.channel_name in self.rooms[self.room_id]:
            self.rooms[self.room_id].remove(self.channel_name)
            logger.info(f"Client removed from room {self.room_id}. Remaining: {len(self.rooms[self.room_id])}")
            if not self.rooms[self.room_id]:
                del self.rooms[self.room_id]
                logger.info(f"Room {self.room_id} deleted")
