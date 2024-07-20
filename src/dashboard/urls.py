from django.urls import path
from . import views

urlpatterns = [
    path("main", views.render_maindashboard),
    path("users", views.render_users),
    path("patch-notes", views.render_patchnotes),
    path("servers", views.render_servers),
    
    path("checkserver", views.check_server),
]
