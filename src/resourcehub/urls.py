from django.urls import path
from . import views

urlpatterns = [
    path("scan/multitheftauto", views.download_mta_engine, name="download_agent_peb"),
    path("scan/fivem", views.download_fivem_engine, name="download_fivem_engine"),
]
