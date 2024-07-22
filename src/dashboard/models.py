from django.db import models
from django.contrib.auth.models import User


class ServerTypes(models.IntegerChoices):
    MTASA = 1, "MTA:SA"


class ServerStatus(models.IntegerChoices):
    unsubscribed = 1, "UnSubscribed"
    online = 2, "Online"
    offline = 3, "Offline"


class ServerSubscription(models.Model):
    class SubscriptionStatus(models.IntegerChoices):
        ACTIVE = 0, "Active"
        INACTIVE = 1, "Inactive"

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    started_at = models.DateTimeField(null=True)
    expires_at = models.IntegerField(null=False)  # Started At + Expires At
    type = models.IntegerField(choices=ServerTypes, null=True)
    status = models.IntegerField(
        choices=SubscriptionStatus, default=SubscriptionStatus.INACTIVE
    )

    class Meta:
        db_table = "subscriptions"
        verbose_name_plural = "subscriptions"


class GameServers(models.Model):

    ip = models.CharField(max_length=49, unique=True)
    port = models.IntegerField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    key = models.CharField(
        max_length=16, null=False, default="UNREGISTRED", unique=True
    )
    subscriptions = models.TextField()
    type = models.IntegerField(choices=ServerTypes.choices, null=True)
    status = models.IntegerField(
        choices=ServerStatus.choices, null=False, default=ServerStatus.unsubscribed
    )

    class Meta:
        db_table = "gameservers"
        verbose_name_plural = "gameservers"

    def __str__(self) -> str:
        return f"{self.ip}:{self.port} ({self.id})"

class Announcements(models.Model):
    author = models.CharField(
        max_length=32, default="EagleAntiCheat Development Team", null=False
    )
    title = models.CharField(max_length=50, null=True)
    announcement = models.TextField(max_length=4096)
    mention_everyone = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        db_table = "announcements"
        verbose_name_plural = "announcements"

    def __str__(self) -> str:
        return self.title


class PatchNotes(models.Model):
    author = models.CharField(
        max_length=32, default="EagleAntiCheat Development Team", null=False
    )
    title = models.CharField(max_length=32, null=False)
    patchnotes = models.TextField(blank=False)
    mention_everyone = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        db_table = "patchnotes"
        verbose_name_plural = "patch-notes"

    def __str__(self) -> str:
        return self.title
