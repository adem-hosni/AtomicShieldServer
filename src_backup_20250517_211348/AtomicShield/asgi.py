"""
ASGI config for AtomicShield project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "AtomicShield.settings")

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from .middleware import WebSocketExceptionHandlerMiddleware

django_asgi_app = get_asgi_application()

import anticheat.routing


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": WebSocketExceptionHandlerMiddleware(AuthMiddlewareStack(
            URLRouter(anticheat.routing.websocket_urlpatterns)
        )),
    }
)
