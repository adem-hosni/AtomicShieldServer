from django.urls import re_path
from .consumers import eagle_server, eagle_scanner


websocket_urlpatterns = [
    re_path(r"^c/eagleserver/$", eagle_server.EagleServerConsumer.as_asgi()), 
    re_path(r"^c/eaglescanner/$", eagle_scanner.EagleScanner.as_asgi()), 
]
