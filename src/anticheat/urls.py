from django.urls import path
from . import views

urlpatterns = [
    path("status/agent", view=views.agent_status, name="agent_status"),
    path("status/server", view=views.server_status, name="server_status"),
]
