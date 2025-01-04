from django.urls import path
from . import views

urlpatterns = [
    path("status/agent", view=views.agent_status, name="agent_status"),
    path("status/isconnected", view=views.is_client_connected),
    path("status/server", view=views.server_status, name="server_status"),
    path("status/version", view=views.version_check),
]
