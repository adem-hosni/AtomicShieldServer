from django.urls import path
from . import views

urlpatterns = [
    path("scan/fivem", views.download_fivem_engine, name="download_fivem_engine"),
]
