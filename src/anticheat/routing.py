from django.urls import path
from .consumers import eagle_server, safe_engine


websocket_urlpatterns = [
    path("c/eagleserver/", eagle_server.EagleServerConsumer.as_asgi()), 
    path("c/eaglescanner/", safe_engine.SafeEngine.as_asgi()), 
]
