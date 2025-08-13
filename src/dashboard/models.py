import logging
import secrets
from django.db import models
from time import time
from django.utils import timezone
from django.db.models import Q
from datetime import datetime, timedelta
from utils import represent_timedelta_string
from anticheat.consumers.safe_server import SafeServerConsumer
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async
from guards import fivem_guard
from anticheat.models import AntiCheatConfigurations, AntiCheatConfigTemplate
from shared.models import ServerType
from typing import Dict, Any, Union, List, Optional


logger = logging.getLogger(__name__)


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

    def has_permission_for(self, user: User, permission: Union[str, Any]):
        if user == self.owner:
            return True
        try:
            target_moderator = self.moderators.get(user__id=user.id)
        except Exception as err:
            logger.error(err)
            return False
        return str(permission) in target_moderator.permission_summary

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

    @classmethod
    def get_for_user(cls, server_id: int, user, **kwargs):
        return cls.objects.get(
            Q(id=server_id, **kwargs) &
            (
                Q(owner=user) |
                Q(moderators__user=user, moderators__status="active")
            )
        )

    @classmethod
    def get_user_servers(cls, user, **kwargs):
        return cls.objects.filter(
            Q(**kwargs) & (
                Q(owner=user) |
                Q(moderators__user=user, moderators__status="active")
            )
        )

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
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="authored_announcements")

    title = models.CharField(max_length=256, null=True)
    announcement = models.TextField()
    mention_everyone = models.BooleanField(default=False)
    date = models.DateTimeField(default=timezone.now, null=True, blank=True)
    seens = models.ManyToManyField(
        User,
        blank=True,
        related_name="seen_announcements",
    )
    category = models.CharField(max_length=32, default="announcement")
    is_pinned = models.BooleanField(default=False)
    is_important = models.BooleanField(default=False)
    read_time = models.CharField(max_length=32, default="2 min read")
    views = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)


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


class GameServerModerator(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("suspended", "Suspended"),
    ]

    class Permissions(models.TextChoices):
        CAN_VIEW_DASHBOARD = "view_dashboard", "Can View Dashboard"
        CAN_VIEW_ANALYTICS = "view_analytics", "Can View Analytics"
        CAN_KICK_PLAYERS = "kick_players", "Can Kick Players"
        CAN_BAN_PLAYERS = "ban_players", "Can Ban Players"
        CAN_VIEW_ANTICHEAT_LOGS = "view_anticheat_logs", "Can View Anticheat Logs"
        CAN_MANAGE_CONFIGURATION = "manage_configuration", "Can Manage Configuration"
        CAN_MANAGE_WEBHOOK_SETTINGS = (
            "manage_webhook_settings",
            "Can Manage Webhook Settings",
        )
        CAN_ACCESS_INTERACTIVE_MAP = (
            "access_interactive_map",
            "Can Access Interactive Map",
        )
        CAN_ACCESS_MULTI_STREAM = "access_multi_stream", "Can Access Multi Stream"
        CAN_MANAGE_MODERATORS = "manage_moderators", "Can Manage Moderators"

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="moderator_profile"
    )
    game_server = models.ForeignKey(
        GameServer, on_delete=models.DO_NOTHING, related_name="moderators"
    )

    can_view_dashboard = models.BooleanField(default=False)
    can_view_analytics = models.BooleanField(default=False)
    can_kick_players = models.BooleanField(default=False)
    can_ban_players = models.BooleanField(default=False)
    can_view_anticheat_logs = models.BooleanField(default=False)
    can_manage_configuration = models.BooleanField(default=False)
    can_manage_webhook_settings = models.BooleanField(default=False)
    can_access_interactive_map = models.BooleanField(default=False)
    can_access_multi_stream = models.BooleanField(default=False)
    can_manage_moderators = models.BooleanField(default=False)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")

    added_at = models.DateTimeField(null=True, auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} Moderator Profile"

    @property
    def permission_summary(self):
        perms = []
        if self.can_view_dashboard:
            perms.append(GameServerModerator.Permissions.CAN_VIEW_DASHBOARD)
        if self.can_view_analytics:
            perms.append(GameServerModerator.Permissions.CAN_VIEW_ANALYTICS)
        if self.can_kick_players:
            perms.append(GameServerModerator.Permissions.CAN_KICK_PLAYERS)
        if self.can_ban_players:
            perms.append(GameServerModerator.Permissions.CAN_BAN_PLAYERS)
        if self.can_view_anticheat_logs:
            perms.append(GameServerModerator.Permissions.CAN_VIEW_ANTICHEAT_LOGS)
        if self.can_manage_configuration:
            perms.append(GameServerModerator.Permissions.CAN_MANAGE_CONFIGURATION)
        if self.can_manage_webhook_settings:
            perms.append(GameServerModerator.Permissions.CAN_MANAGE_WEBHOOK_SETTINGS)
        if self.can_access_interactive_map:
            perms.append(GameServerModerator.Permissions.CAN_ACCESS_INTERACTIVE_MAP)
        if self.can_access_multi_stream:
            perms.append(GameServerModerator.Permissions.CAN_ACCESS_MULTI_STREAM)
        if self.can_manage_moderators:
            perms.append(GameServerModerator.Permissions.CAN_MANAGE_MODERATORS)
        return perms

    class Meta:
        verbose_name = "Game Server Moderator"
        verbose_name_plural = "Game Server Moderators"


class ModeratorInviteToken(models.Model):
    class Status(models.IntegerChoices):
        PENDING = 0, "pending"
        ACCEPTED = 1, "accepted"
        DECLINED = -1, "declined"

    invited_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="invite_tokens_sent"
    )
    to = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, related_name="invite_tokens_received"
    )
    game_server = models.ForeignKey(
        GameServer, on_delete=models.DO_NOTHING, related_name="invite_tokens"
    )
    permissions = models.JSONField(default=list, blank=False)
    sent_to_email = models.BooleanField(default=False)
    status = models.IntegerField(choices=Status, default=Status.PENDING)
    token = models.CharField(max_length=128, unique=True, db_index=True)

    invited_at = models.DateTimeField(null=True, auto_now_add=True)

    @property
    def is_expired(self) -> bool:
        return (
            self.invited_at.timestamp() + timedelta(days=7).total_seconds()
            < datetime.now().timestamp()
        )
    
    @property
    def status_text(self) -> str:
        return "expired" if self.is_expired else self.get_status_display()

    @classmethod
    def generate(
        cls,
        invited_by: GameServerModerator,
        to: User,
        permissions: List[GameServerModerator.Permissions],
        server: Optional[GameServer] = None
    ):
        # Normalize permissions to list of strings
        normalized_perms = [
            str(p.value) if hasattr(p, "value") else str(p).strip()
            for p in (permissions or [])
        ]

        # Fetch all existing invite tokens matching invited_by, to, server, and permissions
        existing_tokens = cls.objects.filter(
            invited_by=invited_by,
            to=to,
            game_server=server,
            permissions=normalized_perms,
        ).order_by("-invited_at")

        for token in existing_tokens:
            if token.is_expired:
                # Skip expired tokens
                continue

            if token.status == cls.Status.PENDING:
                # Reuse pending token
                return token

            if token.status == cls.Status.ACCEPTED:
                # Check if user is still active moderator on the server
                still_moderator = GameServerModerator.objects.filter(
                    user=to,
                    game_server=server,
                    status="active"
                ).exists()

                if still_moderator:
                    # User still active mod, reuse accepted token
                    return token
                # else user left, continue to look for other tokens or create new

            # For declined or any other status, just continue and ignore

        # No valid token found — create a new one

        # Generate unique token string
        for _ in range(5):
            candidate = secrets.token_urlsafe(32)
            if not cls.objects.filter(token=candidate).exists():
                token_str = candidate
                break
        else:
            token_str = secrets.token_urlsafe(64)

        # Create new invite token
        new_token = cls.objects.create(
            invited_by=invited_by,
            to=to,
            game_server=server,
            permissions=normalized_perms,
            token=token_str,
            invited_at=timezone.now(),
            sent_to_email=False,
            status=cls.Status.PENDING,
        )

        return new_token

    class Meta:
        verbose_name = "Game Server Invite Token"
        verbose_name_plural = "Game Server Invite Tokens"
