import json
from django.db import models
from django.db.models import Q
from django.urls import reverse
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.http import HttpResponse
from django.utils import timezone
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
from .models import (
    GameServer,
    Announcements,
    PatchNotes,
    ServerSubscription,
    GameServerModerator,
    ModeratorInviteToken,
    AuditLogEntry
)

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

    ordering = ("-date_joined",)
    list_display = ("username", "email", "date_joined", "last_login", "is_staff")
    list_display_links = list_display

    def has_delete_permission(self, request, obj=...):
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

    list_display = ["name", "address", "owner", "remaining", "type", "display_online"]
    list_display_links = list_display
    search_fields = ["name", "ip", "owner__username", "type"]
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
        return (
            obj.subscriptions.last().remaining
            if obj.subscriptions.count()
            else "Expired"
        )

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
        logger.info(
            f'"{request.user.username}" generated {count} {ServerSubscription.Plans(plan).label} subscription(s)'
        )
        if count <= 0 or count < 150 and count != 1:
            for i in range(count):
                ServerSubscription.objects.create(
                    owner=None,
                    started_at=None,
                    type=form.cleaned_data.get("type"),
                    plan=plan,
                    status=form.cleaned_data.get(
                        "status", ServerSubscription.SubscriptionStatus.ACTIVE
                    ),
                )
        super().save_model(request, obj, form, change)


class GameServerModeratorAdmin(ModelAdmin):
    list_display = ("user", "status", "last_login", "permission_summary")
    list_filter = ("status",)
    search_fields = ("user__username", "user__email")

    @admin.display(description="Last Login")
    def last_login(self, obj: GameServerModerator):
        return obj.user.last_login

    fieldsets = (
        (
            "Platform Account",
            {
                "fields": ("user", "status", "last_login", "game_server"),
            },
        ),
        (
            "Dashboard Access",
            {
                "classes": ("collapse",),
                "fields": ("can_view_dashboard", "can_view_analytics"),
            },
        ),
        (
            "Player Moderation",
            {
                "classes": ("collapse",),
                "fields": (
                    "can_kick_players",
                    "can_ban_players",
                    "can_view_anticheat_logs",
                ),
            },
        ),
        (
            "System Configuration",
            {
                "classes": ("collapse",),
                "fields": ("can_manage_configuration", "can_manage_webhook_settings"),
            },
        ),
        (
            "Advanced Features",
            {
                "classes": ("collapse",),
                "fields": (
                    "can_access_interactive_map",
                    "can_access_multi_stream",
                    "can_manage_moderators",
                ),
            },
        ),
    )

    readonly_fields = ("last_login",)

    def permission_summary(self, obj):
        perms = obj.permission_summary
        if len(perms) > 3:
            return ", ".join(perms[:3]) + f", +{len(perms) - 3} more"
        return ", ".join(perms)

    permission_summary.short_description = "Permissions"


@admin.register(ModeratorInviteToken)
class ModeratorInviteTokenAdmin(ModelAdmin):
    list_display = (
        "invited_by",
        "to",
        "permissions_display",
        "status",
        "invited_at",
        "is_expired",
    )
    list_filter = (
        "status",
        "invited_at",
    )
    search_fields = (
        "token",
        "to__username",
        "invited_by__user__username",
    )
    readonly_fields = (
        "invited_at",
        "is_expired",
    )

    def permissions_display(self, obj):
        return ", ".join(obj.permissions) if obj.permissions else "(none)"

    permissions_display.short_description = "Permissions"


@admin.register(AuditLogEntry)
class AuditLogEntryAdmin(ModelAdmin):
    list_display = (
        "short_timestamp",
        "action_label",
        "severity_label",
        "actor_display",
        "game_server",
        "summary_snippet",
        "reviewed",
    )

    list_filter = ("action", "severity", "game_server", "source", "reviewed")
    search_fields = ("summary", "details", "actor_object_id", "game_server", "metadata")
    ordering = ("-timestamp",)
    readonly_fields = (
        "timestamp",
        "action",
        "severity",
        "actor_display",
        "target_display",
        "metadata_pretty",
    )

    fields = (
        ("timestamp", "action", "severity"),
        "summary",
        "details",
        ("actor_display", "actor_object_id"),
        ("target_display", "target_object_id"),
        "server_instance",
        "metadata_pretty",
        ("source", "reviewed"),
    )

    list_per_page = 50
    actions = ["mark_reviewed", "mark_unreviewed", "export_selected_as_json"]

    def short_timestamp(self, obj):
        return obj.timestamp.strftime("%Y-%m-%d %H:%M:%S") if obj.timestamp else ""

    short_timestamp.short_description = "Timestamp"
    short_timestamp.admin_order_field = "timestamp"

    def action_label(self, obj):
        return obj.get_action_display()
    action_label.short_description = "Action"
    action_label.admin_order_field = "action"

    def severity_label(self, obj):
        return obj.get_severity_display()
    severity_label.short_description = "Severity"
    severity_label.admin_order_field = "severity"

    def actor_display(self, obj):
        """
        Show a readable actor label and link to its admin change page when possible.
        Uses actor_content_type + actor_object_id.
        """
        try:
            ct = getattr(obj, "actor_content_type", None)
            aid = obj.actor_object_id
            if ct and aid:
                # Construct admin change URL: admin:{app_label}_{model}_change
                # Many actor_object_id values are strings; pass directly.
                app_label = ct.app_label
                model_name = ct.model
                try:
                    url = reverse(f"admin:{app_label}_{model_name}_change", args=[aid])
                    # Link text: try to show helpful label
                    label = obj.actor_username or str(obj.actor) or f"{app_label}.{model_name}:{aid}"
                    return format_html('<a href="{}">{}</a>', url, label)
                except Exception:
                    # If reverse fails, fallback to showing label without link
                    return obj.actor_username or str(obj.actor) or aid
            # fallback: display resolved GenericFK (may trigger query)
            return obj.actor_username or (str(obj.actor) if obj.actor else "")
        except Exception:
            return ""
    actor_display.short_description = "Actor"

    def target_display(self, obj):
        """
        Similar to actor_display but for the target object.
        """
        try:
            ct = getattr(obj, "target_content_type", None)
            tid = obj.target_object_id
            if ct and tid:
                app_label = ct.app_label
                model_name = ct.model
                try:
                    url = reverse(f"admin:{app_label}_{model_name}_change", args=[tid])
                    label = f"{ct}: {tid}"
                    return format_html('<a href="{}">{}</a>', url, label)
                except Exception:
                    return f"{ct}: {tid}"
            return str(obj.target_object) if obj.target_object else ""
        except Exception:
            return ""
    target_display.short_description = "Target"

    def summary_snippet(self, obj):
        s = (obj.summary or "") or ""
        if len(s) > 80:
            return s[:77] + "…"
        return s
    summary_snippet.short_description = "Summary"

    def metadata_pretty(self, obj):
        """
        Pretty-printed JSON for the change view. Put this in readonly_fields.
        """
        data = obj.metadata or {}
        try:
            pretty = json.dumps(data, indent=2, ensure_ascii=False)
        except Exception:
            # fallback
            pretty = str(data)
        # Wrap in <pre> for monospace formatting; use mark_safe to allow HTML
        return mark_safe(f'<pre style="white-space: pre-wrap; max-height: 400px; overflow:auto; background:#f7f7f7; padding:8px;">{pretty}</pre>')
    metadata_pretty.short_description = "Metadata"

    # --- Actions ---------------------------------------------------------
    def mark_reviewed(self, request, queryset):
        updated = queryset.update(reviewed=True)
        self.message_user(request, f"Marked {updated} entries as reviewed.")
    mark_reviewed.short_description = "Mark selected entries as reviewed"

    def mark_unreviewed(self, request, queryset):
        updated = queryset.update(reviewed=False)
        self.message_user(request, f"Marked {updated} entries as unreviewed.")
    mark_unreviewed.short_description = "Mark selected entries as unreviewed"

    def export_selected_as_json(self, request, queryset):
        """
        Export the selected AuditLogEntry rows as a JSON attachment.
        Uses the model's `to_dict()` if available, else falls back to manual serialization.
        """
        rows = []
        for entry in queryset:
            # Use to_dict() if implemented (your model has it), otherwise build minimal dict
            try:
                rows.append(entry.to_dict())
            except Exception:
                rows.append({
                    "id": entry.pk,
                    "timestamp": entry.timestamp.isoformat() if entry.timestamp else None,
                    "action": entry.action,
                    "severity": entry.severity,
                    "actor_content_type": str(entry.actor_content_type) if entry.actor_content_type else None,
                    "actor_object_id": entry.actor_object_id,
                    "summary": entry.summary,
                    "details": entry.details,
                    "server_instance": entry.server_instance,
                    "metadata": entry.metadata,
                    "source": entry.source,
                    "reviewed": entry.reviewed,
                })

        payload = json.dumps(rows, indent=2, ensure_ascii=False)
        filename = f"auditlog_export_{timezone.now().strftime('%Y%m%d_%H%M%S')}.json"
        resp = HttpResponse(payload, content_type="application/json; charset=utf-8")
        resp["Content-Disposition"] = f'attachment; filename="{filename}"'
        return resp
    export_selected_as_json.short_description = "Export selected as JSON"

    class Media:
        css = {
            "all": ("admin/css/auditlog_admin.css",)
        }
        js = ("admin/js/auditlog_admin.js",)


admin.site.register(GameServer, GameServerAdmin)
admin.site.register(Announcements, AnnouncementAdmin)
admin.site.register(PatchNotes, PatchNotesAdmin)
admin.site.register(ServerSubscription, ServerSubscriptionAdmin)
admin.site.register(GameServerModerator, GameServerModeratorAdmin)
