from django.urls import path
from . import views

urlpatterns = [
    path("", view=views.render_home, name="home"),
    path("policy/", view=views.render_policy, name="policy"),
]
