from django.urls import path
from . import views

urlpatterns = [
    path("agentpeb", views.download_agent_peb, name="download_agent_peb"),
]
