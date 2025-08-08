import logging
from django.contrib.auth.signals import user_logged_in
from django.db.models.signals import post_save
from django.db.models.signals import pre_save
from .models import GameServer, ServerSubscription, ServerType
from django.dispatch import receiver
from django.http import HttpRequest
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import User
from utils import generate_key


logger = logging.getLogger(__name__)

@receiver(user_logged_in)
def user_login(sender, request: HttpRequest, user: AbstractBaseUser, **kwargs):
    if not request.session.get("selected_server"):
        last_game_server = GameServer.objects.filter(owner=user).last()
        if last_game_server:
            request.session["selected_server"] = last_game_server.id
        else:
            request.session["selected_server"] = None


@receiver(pre_save, sender=ServerSubscription)
def fill_subscription_key(sender, instance, **kwargs):
    if not len(instance.key.strip()):
        instance.key = generate_key(5)

# @receiver(post_save, sender=User)
# def create_free_subscription(sender, instance: User, created, **kwargs):
#     if created:
#         if not instance.subscriptions.filter(plan=ServerSubscription.Plans.FREE).exists():
#             instance.subscriptions.create(plan=ServerSubscription.Plans.FREE, type=ServerType.FIVEM)
#             logger.info(f"Created free subscription for user \"{instance.username}\"")

