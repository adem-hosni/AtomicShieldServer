from django.urls import path
from . import views

urlpatterns = [
    path("main", views.render_maindashboard, name="main"),
    path("users", views.render_users),
    path("patch-notes", views.render_patchnotes, name="patchnotes"),
    path("servers", views.render_servers),
    path("configurations", views.render_configurations),
    path("servers/select", views.select_server),
    
    path("checkserver", views.check_server),
]
