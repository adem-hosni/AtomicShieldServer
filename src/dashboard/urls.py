from django.urls import path
from . import views

urlpatterns = [
    path("/", views.dashboard_overview, name="dashboard"),


    path("main/", views.render_maindashboard, name="dashboard"),
    path("bans/", views.render_bans),
    path("patch-notes/", views.render_patchnotes, name="patchnotes"),
    path("servers/", views.render_servers, name="servers"),
    path("servers/select/", views.select_server, name="select_server"),
    path("configurations/", views.render_configurations),
    path("quicksetup/", views.render_quicksetup, name="quick_setup"),
    path("subscriptions/", views.render_subscriptions),
    path("players/", views.render_players, name="players"),
    path("servers/refresh_key/", views.refresh_server_key, name="refresh_key"),
    path("checkserver/", views.check_server),
]
