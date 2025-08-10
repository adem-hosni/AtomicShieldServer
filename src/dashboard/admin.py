from django.db import models
from django.db.models import Q
from logging import getLogger
from django.contrib import admin
from django.http import HttpRequest
from django.utils.safestring import mark_safe
from django.contrib.auth.models import User, Group
from django.contrib.admin import SimpleListFilter
from django.utils.translation import gettext_lazy as _
from django.db.models import QuerySet
from unfold.contrib.forms.widgets import WysiwygWidget
from django.contrib.auth.admin import (
    UserAdmin as BaseUserAdmin,
    GroupAdmin as BaseGroupAdmin,
)
from .forms import SubscriptionCustomForm
from .models import GameServer, Announcements, PatchNotes, ServerSubscription, GameServerModerator

from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from guards import fivem_guard


admin.site.unregister(User)
admin.site.unregister(Group)


logger = getLogger(__name__)


@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm

    ordering = ('-date_joined',)
    list_display = ("username", "email", "date_joined", "last_login", "is_staff")
    list_display_links = list_display

    def has_delete_permission(self, request, obj = ...):
        return False


@admin.register(Group)
class GroupAdmin(BaseGroupAdmin, ModelAdmin): ...


class GameServerAdmin(ModelAdmin):
    class OnlineFilter(SimpleListFilter):
        title = _("Online")
        parameter_name = "online"

        def lookups(self, request, model_admin):
            return (
                ("online", _("Online")),
                ("offline", _("Offline")),
            )

        def queryset(self, request, queryset: QuerySet[GameServer]):
            filter_value = self.value()
            if filter_value == "online":
                queryset = queryset.filter(
                    id__in=[
                        record.id
                        for record in queryset
                        if fivem_guard.get_server_by_ip(record.ip)
                    ]
                )
            elif filter_value == "offline":
                queryset = queryset.filter(
                    id__in=[
                        record.id
                        for record in queryset
                        if not fivem_guard.get_server_by_ip(record.ip)
                    ]
                )
            return queryset


    list_display = ["name", "address", "owner", "remaining",  "type", "display_online"]
    list_display_links = list_display
    search_fields = ["name", "ip", "owner__username",  "type"]
    exclude = ("port",)

    list_filter = [OnlineFilter, "type"]

    @admin.display(description="Address")
    def address(self, obj: GameServer):
        return f"{obj.ip}"

    @admin.display(description="Owner")
    def owner(self, obj: GameServer):
        return f"{obj.owner.username}"

    @admin.display(description="Remaining")
    def remaining(self, obj: GameServer):
        return obj.subscriptions.last().remaining if obj.subscriptions.count() else "Expired"

    @admin.display(description="Type")
    def type(self, obj: GameServer):
        return f"{obj.type}"

    @admin.display(description="Online", boolean=True)
    def display_online(self, obj: GameServer):
        return bool(fivem_guard.get_server_by_ip(obj.ip))

    # def formfield_for_manytomany(self, db_field, request, **kwargs):
    #     if db_field.name == "subscriptions":
    #         kwargs["queryset"] = ServerSubscription.objects.filter(
    #             Q(owner=self.owner) | Q(owner__isnull=True)
    #         )
    #     return super().formfield_for_manytomany(db_field, request, **kwargs)


class AnnouncementAdmin(ModelAdmin):
    list_display = ["title", "author", "description", "display_views"]
    list_display_links = list_display
    search_fields = list_display

    formfield_overrides = {
        models.TextField: {
            "widget": WysiwygWidget,
        }
    }

    @admin.display(description="Description")
    def description(self, obj: Announcements):
        return mark_safe(
            obj.announcement[:128] + "..."
            if len(obj.announcement) > 128
            else obj.announcement
        )

    @admin.display(description="Viewed by")
    def display_views(self, obj: Announcements):
        return obj.seens.count()


class PatchNotesAdmin(ModelAdmin):
    list_display = ["patchnote", "author", "description", "display_views"]
    list_display_links = list_display
    search_fields = list_display

    formfield_overrides = {
        models.TextField: {
            "widget": WysiwygWidget,
        }
    }

    @admin.display(description="Patchnote")
    def patchnote(self, obj: PatchNotes):
        return obj.title

    @admin.display(description="Author")
    def author(self, obj: PatchNotes):
        return obj.author

    @admin.display(description="Description")
    def description(self, obj: PatchNotes):
        return mark_safe(
            obj.patchnotes[:128] + "..."
            if len(obj.patchnotes) > 128
            else obj.patchnotes
        )
    
    @admin.display(description="Viewed by")
    def display_views(self, obj: Announcements):
        return obj.seens.count()


class ServerSubscriptionAdmin(ModelAdmin):
    form = SubscriptionCustomForm
    list_display = ["id", "name", "key", "owner", "plan", "remaining", "status"]
    list_display_links = list_display
    search_fields = ["id", "key", "owner__username", "plan"]

    list_filter = ("plan", "status", "type")

    readonly_fields = ("key",)

    @admin.display(description="Name")
    def name(self, obj: ServerSubscription):
        return obj.name

    @admin.display(description="Owner")
    def owner(self, obj: ServerSubscription):
        return obj.owner.username

    @admin.display(description="Status")
    def status(self, obj: ServerSubscription):
        return obj.status

    def save_model(self, request: HttpRequest, obj: ServerSubscription, form, change):
        plan = form.cleaned_data.get("plan", ServerSubscription.Plans.BASIC)
        count = form.cleaned_data.get("count", 1)
        logger.info(f"\"{request.user.username}\" generated {count} {ServerSubscription.Plans(plan).label} subscription(s)")
        if count <= 0 or count < 150 and count != 1:
            for i in range(count):
                ServerSubscription.objects.create(
                    owner=None,
                    started_at=None,
                    type=form.cleaned_data.get("type"),
                    plan=plan,
                    status=form.cleaned_data.get("status", ServerSubscription.SubscriptionStatus.ACTIVE),
                )
        super().save_model(request, obj, form, change)

class GameServerModeratorAdmin(ModelAdmin):
    list_display = ('user', 'status', 'last_login', 'permission_summary')
    list_filter = ('status',)
    search_fields = ('user__username', 'user__email')

    @admin.display(description="Last Login")
    def last_login(self, obj: GameServerModerator):
        return obj.user.last_login

    fieldsets = (
        ('Platform Account', {
            'fields': ('user', 'status', 'last_login', "game_server"),
        }),
        ('Dashboard Access', {
            'classes': ('collapse',),
            'fields': ('can_view_dashboard', 'can_view_analytics'),
        }),
        ('Player Moderation', {
            'classes': ('collapse',),
            'fields': ('can_kick_players', 'can_ban_players', 'can_view_anticheat_logs'),
        }),
        ('System Configuration', {
            'classes': ('collapse',),
            'fields': ('can_manage_configuration', 'can_manage_webhook_settings'),
        }),
        ('Advanced Features', {
            'classes': ('collapse',),
            'fields': ('can_access_interactive_map', 'can_access_multi_stream', 'can_manage_moderators'),
        }),
    )

    readonly_fields = ('last_login',)

    def permission_summary(self, obj):
        perms = obj.permission_summary
        if len(perms) > 3:
            return ', '.join(perms[:3]) + f', +{len(perms) - 3} more'
        return ', '.join(perms)

    permission_summary.short_description = 'Permissions'


admin.site.register(GameServer, GameServerAdmin)
admin.site.register(Announcements, AnnouncementAdmin)
admin.site.register(PatchNotes, PatchNotesAdmin)
admin.site.register(ServerSubscription, ServerSubscriptionAdmin)
admin.site.register(GameServerModerator, GameServerModeratorAdmin)
