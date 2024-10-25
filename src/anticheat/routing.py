from django.urls import path
from .consumers import safe_engine, safe_server


websocket_urlpatterns = [
    path("c/eagleserver/", safe_server.SafeServerConsumer.as_asgi()), 
    path("c/eaglescanner/", safe_engine.SafeEngine.as_asgi()), 
]
