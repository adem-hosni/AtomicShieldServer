from django.urls import path
from . import views

urlpatterns = [
    path("signin", view=views.render_signin, name="signin"),
    path("signup", view=views.render_signup, name="signup"),
    path("logout", view=views.render_logout, name="logout"),
]
