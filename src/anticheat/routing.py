from django.urls import path
from .consumers import safe_engine, safe_server


websocket_urlpatterns = [
    path("c/safeguardserver/", safe_server.SafeServerConsumer.as_asgi()), 
    path("c/safeguardagent/", safe_engine.SafeEngineConsumer.as_asgi()), 
]
