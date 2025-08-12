from django.urls import path
from . import views

urlpatterns = [
    path("signin", views.SignInView.as_view(), name="signin"),
    path("signup", views.SignUpView.as_view(), name="signup"),
    path("discord/login", views.DiscordOAuthLoginView.as_view(), name="discord_login"),
    path("discord/callback", views.DiscordOAuthCallbackView.as_view(), name="discord_callback"),
    path("google/login", views.google_auth, name="google_auth"),
    path("google/callback", views.google_callback, name="google_callback"),
]

