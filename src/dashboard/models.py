from django.db import models
from time import time
from datetime import datetime
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async
from anticheat.models import AntiCheatConfigurations, AntiCheatConfigTemplates
from shared.models import ServerType
from typing import Dict, Any, Union


class ServerStatus(models.IntegerChoices):
    unsubscribed = 1, "UnSubscribed"
    online = 2, "Online"
    offline = 3, "Offline"


class ServerSubscription(models.Model):
    class SubscriptionStatus(models.IntegerChoices):
        ACTIVE = 0, "Active"
        INACTIVE = 1, "Inactive"

    name = models.TextField(null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    started_at = models.DateTimeField(null=True)
    expires_at = models.DurationField(null=False)  # Started At + Expires At
    type = models.IntegerField(choices=ServerType, null=True)
    status = models.IntegerField(
        choices=SubscriptionStatus, default=SubscriptionStatus.INACTIVE
    )

    class Meta:
        db_table = "subscriptions"
        verbose_name_plural = "subscriptions"

    def is_valid_for_now(self) -> bool:
        return (
            self.started_at is not None
            and (datetime.timestamp(self.started_at) + self.expires_at.total_seconds())
            > time()
            and self.status == 0
        )

    def __str__(self) -> str:
        return self.name


class GameServer(models.Model):

    ip = models.CharField(max_length=49)
    port = models.IntegerField()
    name = models.CharField(max_length=32)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    key = models.CharField(
        max_length=16, null=False, default="UNREGISTRED", unique=True
    )
    subscriptions = models.ManyToManyField(
        ServerSubscription, related_name="game_servers"
    )
    configurations = models.ForeignKey(
        AntiCheatConfigurations, on_delete=models.CASCADE, null=False, blank=False
    )
    type = models.IntegerField(choices=ServerType.choices, null=True)
    status = models.IntegerField(
        choices=ServerStatus.choices, null=False, default=ServerStatus.unsubscribed
    )

    class Meta:
        db_table = "gameservers"
        verbose_name = "Game Server"
        verbose_name_plural = "Game Servers"

    async def get_config_by_id(self, config_id: int) -> Union[str, int, bool]:
        await self.arefresh_from_db()
        keys = (await sync_to_async(lambda: dict(self.configurations.config))()).keys()
        if str(config_id) in keys:
            return self.configurations.config[str(config_id)]

        try:
            target_config = await AntiCheatConfigTemplates.objects.aget(id=config_id)
        except AntiCheatConfigTemplates.DoesNotExist as err:
            raise ValueError(f"config id ({config_id}) does not exists!") from err

        return target_config.default_value

    async def get_anticheat_configurations(self) -> Dict[str, Any]:
        try:
            target_server = await GameServer.objects.select_related(
                "configurations"
            ).aget(id=self.id)
            server_configs = target_server.configurations.config
        except GameServer.DoesNotExist:
            # Set Server configs emmpty
            server_configs = {}

        queryset = await sync_to_async(list)(
            AntiCheatConfigTemplates.objects.filter(server_type=ServerType.MTASA)
        )

        config_templates = {config.id: config.default_value for config in queryset}

        # Iterate throught config templates
        for config_id, config_value in config_templates.items():
            # Override config_templates with existing server configs
            if str(config_id) in server_configs.keys():
                config_templates[config_id] = server_configs[str(config_id)]

        return config_templates

    def __str__(self) -> str:
        return f"{self.ip}:{self.port} ({self.id})"


class Announcements(models.Model):
    author = models.CharField(
        max_length=32, default="AtomicShield Development Team", null=False
    )
    title = models.CharField(max_length=50, null=True)
    announcement = models.TextField(max_length=4096)
    mention_everyone = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True, null=True)
    seens = models.ManyToManyField(User, blank=True)

    class Meta:
        db_table = "announcements"
        verbose_name = "Announcement"
        verbose_name_plural = "Announcements"

    def __str__(self) -> str:
        return self.title


class PatchNotes(models.Model):
    author = models.CharField(
        max_length=32, default="AtomicShield Development Team", null=False
    )
    title = models.CharField(max_length=32, null=False)
    patchnotes = models.TextField(blank=False)
    mention_everyone = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True, null=True)
    seens = models.ManyToManyField(User, blank=True)

    class Meta:
        db_table = "patchnotes"
        verbose_name = "Patchnote"

    def __str__(self) -> str:
        return self.title
