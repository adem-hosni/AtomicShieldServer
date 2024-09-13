from django.urls import path
from . import views

urlpatterns = [
    path("dashboard", views.render_dashboard_redirect),
    path("main", views.render_maindashboard, name="main"),
    path("users", views.render_users),
    path("patch-notes", views.render_patchnotes, name="patchnotes"),
    path("servers", views.render_servers, name="servers"),
    path("configurations", views.render_configurations),
    path("quicksetup", views.render_quicksetup, name="quick_setup"),
    path("subscriptions", views.render_subscriptions),
    path("servers/select", views.select_server),
    path("servers/refresh_key", views.refresh_server_key, name="refresh_key"),
    path("whitelist", views.render_whitelist, name="whitelist"),
    path("checkserver", views.check_server),
]
