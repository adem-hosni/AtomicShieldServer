from django.contrib.auth.signals import user_logged_in
from .models import GameServer
from django.dispatch import receiver
from django.http import HttpRequest
from django.contrib.auth.base_user import AbstractBaseUser


@receiver(user_logged_in)
def user_login(sender, request: HttpRequest, user: AbstractBaseUser, **kwargs):
    if not request.session.get("selected_server"):
        request.session["selected_server"] = GameServer.objects.filter(owner=user).last().id
