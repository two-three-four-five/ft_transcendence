import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "reflected.settings")
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()


from django.urls import re_path, path

from chat.consumers import ChatConsumer
from notification.consumers import NotificationConsumer

from .middleware import TokenAuthMiddleware

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": TokenAuthMiddleware(
            URLRouter(
                [
                    path("ws/notifications/", NotificationConsumer.as_asgi()),
                    re_path(
                        r"ws/chat/(?P<room_name>\w+)/$",
                        ChatConsumer.as_asgi(),
                    ),
                ]
            )
        ),
    }
)
