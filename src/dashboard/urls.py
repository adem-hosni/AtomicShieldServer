from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/", views.dashboard_overview, name="dashboard"),
    path("servers/add", views.add_server, name="add_server"),
    path("servers/", views.list_servers, name="list_server"),
    path("server/<int:server_id>", views.server_dashboard, name="list_server"),
    path("server/<int:server_id>/bans", views.list_bans, name="list_bans"),
    path("server/<int:server_id>/bans/unban", views.unban_player, name="unban_player"),
    path("server/<int:server_id>/bans/ban", views.ban_player, name="ban_player"),
    path("server/<int:server_id>/configurations", views.list_configurations, name="list_configurations"),


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
