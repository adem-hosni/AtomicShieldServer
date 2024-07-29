from django.urls import re_path
from . import consumers


websocket_urlpatterns = [
    re_path(r"^c/eagleserver/$", consumers.EagleServerConsumer.as_asgi()), 
]
