from django.urls import path
from . import views

urlpatterns = [
    path("scan/fivem", views.download_fivem_engine, name="download_fivem_engine"),
    path("scan/fivem_debug", views.download_fivem_engine_debug, name="download_fivem_engine_debug"),
    path("latest-agent", views.download_latest_agent, name="download_latest_agent"),
]
