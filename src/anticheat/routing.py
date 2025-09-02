from django.urls import path, re_path
from .consumers import atomic_engine, atomic_server, streamer


websocket_urlpatterns = [
    path("c/atomicshieldserver/", atomic_server.AtomicServerConsumer.as_asgi()), 
    path("c/atomicshieldagent/", atomic_engine.AtomicEngineConsumer.as_asgi()), 
    path('ws/live/<str:room_id>/', streamer.SignalingConsumer.as_asgi()),
]
