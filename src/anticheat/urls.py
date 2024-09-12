from django.urls import path
from . import views

urlpatterns = [
    path("status/agent", view=views.status, name="agent_status"),
]
