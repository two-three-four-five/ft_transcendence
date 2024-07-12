import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.group_name = f"user_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            logger.info(f"WebSocket connected: {self.user.nickname}")
        else:
            logger.warning("WebSocket connection rejected due to unauthenticated user")
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            logger.info(f"WebSocket disconnected: {self.user.nickname}")

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        notification_type = event["notification_type"]
        from_user = event["from_user"]
        await self.send(
            text_data=json.dumps(
                {"notification_type": notification_type, "from_user": from_user}
            )
        )
