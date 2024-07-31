from django.urls import re_path
from .consumers import eagle_server


websocket_urlpatterns = [
    re_path(r"^c/eagleserver/$", eagle_server.EagleServerConsumer.as_asgi()), 
]
