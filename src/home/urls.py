from django.urls import path
from . import views

urlpatterns = [
    path("", view=views.render_home, name="home"),
    path("tos/", view=views.render_tos, name="tos"),
    path("privacy/", view=views.render_privacy, name="privacy"),
]
