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
    path("server/<int:server_id>/bans/<int:ban_id>/report-false-positive", views.report_false_positive, name="report_false_positive"),
    path("server/<int:server_id>/configurations", views.list_configurations, name="list_configurations"),
    path("server/<int:server_id>/moderators", views.list_moderators, name="list_moderators"),
    path("server/<int:server_id>/moderators/<int:moderator_id>/update", views.update_moderators, name="update_moderators"),
    path("server/<int:server_id>/moderators/<int:moderator_id>/action", views.set_moderator_action, name="set_moderator_action"),
    path("server/<int:server_id>/moderators/add", views.add_moderators, name="add_moderators"),
    path("moderators", views.search_for_moderator, name="search_for_moderator"),
    path("moderation/invite", views.invite_moderator, name="invite_moderator"),
    path("moderation/invite/mark", views.mark_invite, name="mark_invite"),
    path("server/<int:server_id>/audit-logs", views.list_audit_logs, name="list_audit_logs"),

    path("download-assets/", views.download_assets_view, name="dashboard"),

    path("main/", views.list_announcements, name="dashboard"),
    path("bans/", views.render_bans),
    path("patch-notes/", views.render_patchnotes, name="patchnotes"),
    path("servers/", views.render_servers, name="servers"),
    path("servers/select/", views.select_server, name="select_server"),
    path("configurations/", views.render_configurations),
    path("quicksetup/", views.render_quicksetup, name="quick_setup"),
    path("subscriptions/", views.subscriptions_api),
    path("server/<int:server_id>/players", views.render_players, name="players"),
    path("servers/refresh_key/", views.refresh_server_key, name="refresh_key"),
    path("checkserver/", views.check_server),
]
