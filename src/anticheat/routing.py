from django.urls import path
from .consumers import safe_engine, safe_server


websocket_urlpatterns = [
    path("c/atomicshieldserver/", safe_server.SafeServerConsumer.as_asgi()), 
    path("c/atomicshieldagent/", safe_engine.SafeEngineConsumer.as_asgi()), 
]
