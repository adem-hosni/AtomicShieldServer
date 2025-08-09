from django.db import models
from time import time
from django.utils import timezone
from datetime import datetime, timedelta
from utils import represent_timedelta_string
from anticheat.consumers.safe_server import SafeServerConsumer
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async
from guards import fivem_guard
from anticheat.models import AntiCheatConfigurations, AntiCheatConfigTemplate
from shared.models import ServerType
from typing import Dict, Any, Union, List


class ServerStatus(models.IntegerChoices):
    unsubscribed = 1, "UnSubscribed"
    online = 2, "Online"
    offline = 3, "Offline"


class ServerSubscription(models.Model):
    class SubscriptionStatus(models.IntegerChoices):
        ACTIVE = 0, "Active"
        INACTIVE = 1, "Inactive"

    class Plans(models.IntegerChoices):
        BASIC = 1, "Basic"
        PRO = 2, "Pro"
        ENTREPRISE = 3, "Entreprise"
        FREE = 4, "Free"
        LIFETIME = 5, "Lifetime"

    # name = models.TextField(null=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="subscriptions",
    )
    started_at = models.DateTimeField(null=True, auto_now_add=True)
    key = models.CharField(max_length=32, null=False, blank=True)
    payment = models.ForeignKey(
        "api.Payment", on_delete=models.CASCADE, null=True, default=None, blank=True
    )
    plan = models.IntegerField(choices=Plans, null=False)
    type = models.IntegerField(choices=ServerType, null=True)
    status = models.IntegerField(
        choices=SubscriptionStatus, default=SubscriptionStatus.ACTIVE
    )

    class Meta:
        db_table = "subscriptions"
        verbose_name_plural = "subscriptions"

    @property
    def is_used(self) -> bool:
        """
        Check if the subscription is used by a server.
        """
        return GameServer.objects.filter(subscriptions=self).exists()

    @property
    def expires_at(self):
        if self.plan == 4:
            return timedelta(days=7)
        elif self.plan == 5:
            return timedelta(weeks=9999)
        return timedelta(days=(30 if self.plan == 1 else 90))

    @property
    def name(self):
        try:
            return f"{ServerType(self.type).label} - {self.Plans(self.plan).label} {represent_timedelta_string(self.expires_at)} {'- Expired' if not self.is_valid_for_now() else ''}"
        except Exception:
            return f"{__class__.__name__} - {self.id}"

    @property
    def remaining(self) -> int:
        if self.owner_id is None or self.started_at is None:
            return represent_timedelta_string(self.expires_at)

        left_duration = (
            datetime.timestamp(self.started_at)
            + self.expires_at.total_seconds()
            - time()
        )
        return (
            represent_timedelta_string(timedelta(seconds=left_duration))
            if left_duration > 0
            else "Expired"
        )

    def is_valid_for_now(self) -> bool:
        return (
            self.status == self.SubscriptionStatus.ACTIVE
            and (
                (
                    self.started_at is not None
                    and (
                        datetime.timestamp(self.started_at)
                        + self.expires_at.total_seconds()
                    )
                    > time()
                )
                or self.owner_id is None
            )
            and self.status == 0
        )

    def __str__(self) -> str:
        return (
            self.name if not self.owner_id else f"{self.owner.username} - {self.name}"
        )


class GameServer(models.Model):
    ip = models.CharField(max_length=49)
    port = models.IntegerField()
    name = models.CharField(max_length=32)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    subscriptions = models.ManyToManyField(
        ServerSubscription, related_name="game_servers"
    )
    configurations = models.ForeignKey(
        AntiCheatConfigurations,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="game_servers",
    )
    type = models.IntegerField(choices=ServerType.choices, null=True)
    status = models.IntegerField(
        choices=ServerStatus.choices, null=False, default=ServerStatus.unsubscribed
    )

    @property
    def key(self) -> str:
        try:
            return (
                self.subscriptions.last().key
                if self.subscriptions.count()
                else "NON-REGISTRED"
            )
        except ServerSubscription.DoesNotExist:
            return "NON-REGISTRED"

    @key.setter
    def key(self, other: str) -> str:
        try:
            if self.subscriptions.count():
                latest_subscription = self.subscriptions.last()
                latest_subscription.key = other
                latest_subscription.save()
        except ServerSubscription.DoesNotExist:
            ...
    
    @property
    def is_online(self) -> bool:
        return fivem_guard.is_server_running(self.ip)
    
    @property
    def active_players(self) -> List[SafeServerConsumer]:
        active_players = []
        for engine in fivem_guard.engines:
            if engine.connected_server:
                if engine.connected_server.game_server == self:
                    active_players.append(engine)
        return active_players
    
    @property
    def active_player_count(self) -> int:
        return len(self.active_players)


    class Meta:
        db_table = "gameservers"
        verbose_name = "Server"
        verbose_name_plural = "Servers"

    async def get_config_by_id(self, config_id: int) -> Union[str, int, bool]:
        await self.arefresh_from_db()
        keys = (await sync_to_async(lambda: dict(self.configurations.config))()).keys()
        if str(config_id) in keys:
            return self.configurations.config[str(config_id)]

        try:
            target_config = await AntiCheatConfigTemplate.objects.aget(id=config_id)
        except AntiCheatConfigTemplate.DoesNotExist as err:
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
            AntiCheatConfigTemplate.objects.filter(server_type=ServerType.FIVEM)
        )

        config_templates = {config.id: config.default_value for config in queryset}

        # Iterate throught config templates
        for config_id, config_value in config_templates.items():
            # Override config_templates with existing server configs
            if str(config_id) in server_configs.keys():
                config_templates[config_id] = server_configs[str(config_id)]

        return config_templates

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class Announcements(models.Model):
    author = models.CharField(
        max_length=32, default="AtomicShield Development Team", null=False
    )
    title = models.CharField(max_length=256, null=True)
    announcement = models.TextField()
    mention_everyone = models.BooleanField(default=False)
    date = models.DateTimeField(default=timezone.now, null=True, blank=True)
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
