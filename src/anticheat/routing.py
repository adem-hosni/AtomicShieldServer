from django.urls import path, re_path
from .consumers import safe_engine, safe_server, streamer


websocket_urlpatterns = [
    path("c/atomicshieldserver/", safe_server.SafeServerConsumer.as_asgi()), 
    path("c/atomicshieldagent/", safe_engine.SafeEngineConsumer.as_asgi()), 
    path('ws/live/<str:room_id>/', streamer.SignalingConsumer.as_asgi()),
]
