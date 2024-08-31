from django.urls import path
from .consumers import eagle_server, eagle_scanner


websocket_urlpatterns = [
    path("c/eagleserver/", eagle_server.EagleServerConsumer.as_asgi()), 
    path("c/eaglescanner/", eagle_scanner.EagleScanner.as_asgi()), 
]
