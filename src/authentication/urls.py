from django.urls import path, include
from . import views

urlpatterns = [
    path("signin", views.SignInView.as_view(), name="signin"),
    path("signup", views.SignUpView.as_view(), name="signup"),

    path("discord/login", views.discord_login, name="discord_login"),
    path("google/login", views.google_login, name="google_login"),

    path("accounts/", include("allauth.urls")),
]

