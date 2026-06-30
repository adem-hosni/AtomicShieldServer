"""
Rewritten Django admin for AtomicShield — simplified and robust.
This version intentionally avoids setting dynamic `attrs` on action functions
and removes custom `actions_list` values that caused unfold to try to access
`.attrs` on plain functions. It keeps the original features but uses
standard Django admin action patterns and safer helper code.

Notes:
- Keep unfold.ModelAdmin-based admins where appropriate.
- Admin actions use standard signatures `(self, request, queryset)`.
- File download helpers return Django HttpResponse/FileResponse safely.
- Defensive error handling and logging retained.
"""

from __future__ import annotations

import hashlib
import io
import logging
import os
import zipfile
from typing import Iterable, List, Optional, Tuple

from asgiref.sync import async_to_sync
from django import forms
from django.contrib import admin, messages
from django.contrib.admin import SimpleListFilter
from django.http import FileResponse, HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect
from django.urls import path, reverse
from django.utils import timezone
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

# unfold admin features
from unfold.admin import ModelAdmin
from unfold.decorators import display
from simple_history.admin import SimpleHistoryAdmin

from .models import (
    AntiCheatConfigSection,
    AntiCheatConfigTemplate,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategory,
    AntiCheatVersion,
    AtomicEngineReleaseAsset,
    Ban,
    CrashReport,
    DetectionReport,
    FalsePositiveReport,
    HWID,
    MaliciousSignatures,
    ThreatFile,
    WhitelistedProcess,
    Warning,
)
from services.websocket import fivem_conn_manager

logger = logging.getLogger(__name__)


# ----------------- Helpers ---------------------------------------------------

def _get_engine_for_hwid(hwid: HWID, only_in_memory: bool = False):
    """Safe helper to fetch the in-memory engine wrapper for a given HWID."""
    try:
        return async_to_sync(fivem_conn_manager.get_engine_by_hwid)(hwid, only_in_memory)
    except Exception:
        logger.exception("Failed to fetch engine for HWID %s", getattr(hwid, "id", hwid))
        return None


def _gather_online_hwid_ids() -> List[str]:
    """Return list of HWID string ids currently known by the engine registry."""
    try:
        engines = async_to_sync(fivem_conn_manager.redis_manager.get_all_engines)()
        return [str(e.get("hwid")) for e in engines if e and e.get("hwid")]
    except Exception:
        logger.exception("Failed to enumerate online engines")
        return []


def _add_action_attrs(func, description=None):
    """Ensure admin actions have description and attrs attributes for unfold compatibility."""
    if not hasattr(func, "description"):
        func.description = description or func.__name__.replace("_", " ").title()
    if not hasattr(func, "attrs"):
        func.attrs = {}


# -------------------- HWID admin (client) --------------------
@admin.register(HWID)
class ClientHWIDAdmin(SimpleHistoryAdmin, ModelAdmin):
    """HWID admin with unfold integration (keeps behaviour conservative).

    Key changes from the user's previous file:
    - Avoid dynamic `.attrs` usage on action functions.
    - Use standard `actions` list for Django admin.
    - Keep helpful readonly displays and safe helpers.
    """

    list_display = (
        "id",
        "username",
        "computer_name",
        "display_online_badge",
        "display_discord_id",
        "display_connected_server",
        "last_seen",
        "display_build_timestamp",
    )

    list_display_links = ("id", "username")
    search_fields = (
        "bios_version",
        "computer_name",
        "cpuid",
        "discord_id",
        "disks",
        "fivem_license",
        "fivem_token",
        "id",
        "motherboard_serial",
        "pnp_device",
        "steam",
        "username",
    )

    list_filter_submit = True
    list_filter_sheet = False
    actions = ["download_debug_logs", "shutdown_engines"]
    list_per_page = 50

    readonly_fields = (
        "display_build_timestamp",
        "display_online",
        "display_discord_id",
        "display_connected_server",
        "ip",
    )

    autocomplete_fields = [
        "discord_id",      # If FK/relation, otherwise remove
        "username",        # If FK/relation, otherwise remove
        "computer_name",   # If FK/relation, otherwise remove
    ]

    fieldsets = (
        (None, {"fields": ("username", "discord_id", "computer_name"), "classes": ("section", "tab-general")}),

        (
            "Connection & Build",
            {
                "fields": ("display_build_timestamp", "display_online", "ip"),
                "classes": ("collapse", "section", "tab-connection"),
                "description": "Real-time connection information",
            },
        ),
        ("Hardware Details", {"fields": ("bios_version", "cpuid", "disks", "motherboard_serial"), "classes": ("collapse", "section", "tab-hardware")} ),
        (
            "Advanced Information",
            {"fields": ("pnp_device", "steam", "fivem_license", "fivem_token"), "classes": ("collapse", "section", "tab-advanced")},
        ),
    )

    class OnlineFilter(SimpleListFilter):
        title = _("Online Status")
        parameter_name = "online"

        def lookups(self, request, model_admin):
            return (("online", _("🟢 Online")), ("offline", _("🔴 Offline")))

        def queryset(self, request, queryset):
            val = self.value()
            if val is None:
                return queryset
            online = set(_gather_online_hwid_ids())
            if val == "online":
                ids = [int(x) for x in online if x.isdigit()]
                return queryset.filter(id__in=ids)
            ids = [int(x) for x in online if x.isdigit()]
            return queryset.exclude(id__in=ids)

    class ConnectedServerFilter(SimpleListFilter):
        title = _("Connected Server")
        parameter_name = "connected_server"

        def lookups(self, request, model_admin):
            try:
                servers = async_to_sync(fivem_conn_manager.get_servers)()
                return [(s.game_server.id, s.game_server.name) for s in servers]
            except Exception:
                logger.error("ConnectedServerFilter.lookups failed")
                return []

        def queryset(self, request, queryset):
            sid = self.value()
            if not sid:
                logger.debug("ConnectedServerFilter: no sid value provided")
                return queryset
            try:
                sid_int = int(sid)
            except ValueError:
                return queryset.none()

            matching = []
            for obj in queryset:
                engine = _get_engine_for_hwid(obj, only_in_memory=True)
                server = getattr(engine, "connected_server", None) if engine else None
                if server and getattr(server, "game_server", None) and server.game_server.id == sid_int:
                    matching.append(obj.id)
            return queryset.filter(id__in=matching)

    list_filter = [OnlineFilter, ConnectedServerFilter, "last_seen"]

    # ---- Actions -----
    @admin.action(description="📥 Download debug logs")
    def download_debug_logs(self, request: HttpRequest, queryset=None):
        if queryset is None:
            self.message_user(request, _("No items selected."), level=messages.WARNING)
            return

        engines: List[Tuple[HWID, object]] = []
        for obj in queryset:
            engine = _get_engine_for_hwid(obj)
            if engine:
                engines.append((obj, engine))

        if not engines:
            self.message_user(request, _("No engines found."), level=messages.ERROR)
            return None

        results = []
        for hwid, engine in engines:
            try:
                logs = async_to_sync(engine.request_debug_logs)()
            except Exception:
                logger.exception("Error requesting logs for %s", hwid)
                logs = None
            results.append((hwid, logs))

        valid = [(o, r) for o, r in results if isinstance(r, str) and r.strip()]
        if not valid:
            self.message_user(request, _("No valid debug logs to download."), level=messages.ERROR)
            return None

        if len(valid) == 1:
            obj, logs = valid[0]
            resp = HttpResponse(logs, content_type="text/plain")
            resp["Content-Disposition"] = f'attachment; filename="{obj.username}-{obj.id}_debug_logs.log"'
            self.message_user(request, _("Debug logs downloaded for %(username)s") % {"username": obj.username}, level=messages.SUCCESS)
            return resp

        # multiple -> zip in memory
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
            for obj, logs in valid:
                name = f"{obj.username}-{obj.id}_debug_logs.log"
                zf.writestr(name, logs)
        buf.seek(0)
        response = HttpResponse(buf.read(), content_type="application/zip")
        response["Content-Disposition"] = f'attachment; filename="{len(valid)}-debug-logs.zip"'
        self.message_user(request, _("%(count)d debug logs downloaded as a zip archive.") % {"count": len(valid)}, level=messages.SUCCESS)
        return response

    @admin.action(description="🔄 Shutdown engines")
    def shutdown_engines(self, request: HttpRequest, queryset=None):
        if queryset is None:
            self.message_user(request, _("No items selected."), level=messages.WARNING)
            return

        success_count = 0
        error_count = 0
        for obj in queryset:
            engine = _get_engine_for_hwid(obj)
            if engine:
                try:
                    async_to_sync(engine.shutdown)()
                    success_count += 1
                except Exception:
                    logger.exception("shutdown error for %s", obj)
                    error_count += 1
            else:
                error_count += 1

        if success_count > 0:
            self.message_user(request, _("Shutdown command sent to %(count)d engines.") % {"count": success_count}, level=messages.SUCCESS)
        if error_count > 0:
            self.message_user(request, _("Failed to send shutdown to %(count)d engines.") % {"count": error_count}, level=messages.WARNING)
    _add_action_attrs(shutdown_engines, "🔄 Shutdown engines")

    # ----- Display methods -----
    @display(description="Online", boolean=True)
    def display_online_badge(self, obj):
        online = bool(_get_engine_for_hwid(obj, only_in_memory=True))
        if online:
            return format_html('<span class="badge badge-success">🟢 Online</span>')
        return format_html('<span class="badge badge-error">🔴 Offline</span>')

    @display(description="Build")
    def display_build_timestamp(self, obj: HWID):
        engine = _get_engine_for_hwid(obj, only_in_memory=True)
        timestamp = getattr(engine, "build_timestamp", None)
        if timestamp:
            return format_html('<code>{}</code>', timestamp)
        return "N/A"

    @display(description="Discord ID")
    def display_discord_id(self, obj: HWID):
        if obj.discord_id:
            return format_html('<span class="font-mono">{}</span>', obj.discord_id)
        return format_html('<span class="text-gray-400">Not Linked</span>')

    @display(description="IP Address")
    def ip(self, obj: HWID):
        engine = _get_engine_for_hwid(obj, only_in_memory=True)
        return engine.address[0] if engine and getattr(engine, "address", None) else _("Not Found")

    @display(description="Connected Server")
    def display_connected_server(self, obj: HWID):
        engine = _get_engine_for_hwid(obj, only_in_memory=True)
        if not engine:
            return _("Not Connected")
        server = getattr(engine, "connected_server", None)
        if server and server.game_server:
            return server.game_server.name
        return _("No Server Connected")

    @display(description="Online", boolean=True)
    def display_online(self, obj: HWID):
        return bool(_get_engine_for_hwid(obj, only_in_memory=True))

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)
        engine_matches = []
        try:
            for obj in self.model.objects.all():
                engine = _get_engine_for_hwid(obj, only_in_memory=True)
                addr = getattr(engine, "address", None)
                if engine and addr and search_term in addr[0]:
                    engine_matches.append(obj.id)
        except Exception:
            logger.exception("Error while searching engine addresses")

        if engine_matches:
            queryset = queryset | self.model.objects.filter(id__in=engine_matches)
        return queryset, use_distinct

    def has_delete_permission(self, request, obj=None):
        return False


# -------------------- Config template admin --------------------
@admin.register(AntiCheatConfigTemplate)
class AntiCheatConfigTemplateAdmin(ModelAdmin):
    list_display = ("id", "name", "pseudo_name", "pretty_config_type", "section", "server_type_badge", "default_value_preview")
    list_display_links = ("id", "name")
    list_filter = ("config_type", "server_type", "section__category")
    search_fields = ("name", "pseudo_name", "default_value", "extra")
    ordering = ("section__category__name", "section__title", "name")
    list_per_page = 30
    list_filter_submit = True
    list_fullwidth = True

    autocomplete_fields = [
        "section",
    ]

    fieldsets = (
        (_("General Settings"), {"fields": ("name", "subtitle", "pseudo_name", "icon", "tip"), "classes": ("section", "tab-general")}),

        (_("Assignment"), {"fields": ("section", "server_type", "config_type"), "classes": ("section", "tab-assignment")}),

        (_("Values & Configuration"), {"fields": ("default_value", "extra"), "classes": ("section", "tab-values")}),

    )

    @display(description="Type")
    def pretty_config_type(self, obj: AntiCheatConfigTemplate) -> str:
        try:
            config_type = obj.get_config_type_display()
        except Exception:
            config_type = str(obj.config_type)
        color_map = {
            "boolean": "badge-success",
            "number": "badge-info",
            "string": "badge-warning",
            "select": "badge-primary",
            "file_upload": "badge-secondary",
            "export_json": "badge-accent",
            "embed_json": "badge-neutral",
        }
        color_class = color_map.get(obj.config_type, "badge-gray")
        return format_html('<span class="badge {}">{}</span>', color_class, config_type)

    @display(description="Server")
    def server_type_badge(self, obj: AntiCheatConfigTemplate) -> str:
        try:
            server_type = obj.get_server_type_display()
        except Exception:
            server_type = str(obj.server_type)
        if "fivem" in server_type.lower():
            return format_html('<span class="badge badge-success">{}</span>', server_type)
        return format_html('<span class="badge badge-warning">{}</span>', server_type)

    @display(description=_("Default Value"))
    def default_value_preview(self, obj: AntiCheatConfigTemplate) -> str:
        try:
            val = obj.get_default_value()
            if isinstance(val, bool):
                return "✅ True" if val else "❌ False"
            if isinstance(val, (int, float)):
                return format_html('<code>{}</code>', val)
            if isinstance(val, str) and len(val) > 60:
                return format_html('<code>{}…</code>', val[:57])
            return format_html('<code>{}</code>', val) if val is not None else "-"
        except Exception as exc:
            logger.exception("Error rendering default value for template %s", getattr(obj, "id", "?"))
            return format_html('<span class="text-red-500">err: {}</span>', exc)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        try:
            if "extra" in form.base_fields:
                form.base_fields["extra"].widget = forms.Textarea(attrs={"rows": 6, "class": "vLargeTextField"})
            if "default_value" in form.base_fields:
                form.base_fields["default_value"].widget = forms.Textarea(attrs={"rows": 2, "class": "vTextField"})
        except Exception:
            logger.exception("Failed to customize form widgets for AntiCheatConfigTemplate")
        return form


# -------------------- Server Configuration Admin --------------------
@admin.register(AntiCheatConfigurations)
class AntiCheatConfigurationsAdmin(ModelAdmin):
    list_display = [
        "id",
        "display_server_name",
        "display_owner",
        "config_count_badge",
        "webhooks_count_badge",
        "embeds_count_badge",
    ]
    search_fields = ("config__overlap", "game_servers__name", "config")
    list_filter = ["game_servers__name"]
    list_per_page = 25
    list_filter_submit = True

    autocomplete_fields = [
        "game_servers",
    ]

    fieldsets = (
        (_("Configuration Data"), {"fields": ("config", "webhooks", "embeds"), "classes": ("section", "tab-config")}),

        (_("Server Assets"), {"fields": ("server_image",), "classes": ("section", "tab-assets")}),

    )

    @display(description="Server Name")
    def display_server_name(self, obj: AntiCheatConfigurations):
        gs = obj.game_servers.first()
        if gs:
            return format_html('<span class="font-medium text-blue-600">{}</span>', gs.name)
        return format_html('<span class="text-gray-400">No Server Found</span>')

    @display(description="Owner")
    def display_owner(self, obj: AntiCheatConfigurations):
        gs = obj.game_servers.first()
        return gs.owner if gs else "No Owner Found"

    @display(description="Configs")
    def config_count_badge(self, obj: AntiCheatConfigurations):
        count = len(obj.config) if hasattr(obj, "config") else 0
        color = "badge-success" if count > 0 else "badge-gray"
        return format_html('<span class="badge {}">{}</span>', color, f"{count} Configs")

    @display(description="Webhooks")
    def webhooks_count_badge(self, obj: AntiCheatConfigurations):
        count = len(obj.webhooks) if obj.webhooks else 0
        color = "badge-info" if count > 0 else "badge-gray"
        return format_html('<span class="badge {}">{}</span>', color, f"{count} Webhooks")

    @display(description="Embeds")
    def embeds_count_badge(self, obj: AntiCheatConfigurations):
        count = len(obj.embeds) if obj.embeds else 0
        color = "badge-warning" if count > 0 else "badge-gray"
        return format_html('<span class="badge {}">{}</span>', color, f"{count} Embeds")


# -------------------- Configuration Category Admin --------------------
@admin.register(AntiCheatConfigurationCategory)
class AntiCheatConfigurationCategoryAdmin(ModelAdmin):
    list_display = ["id", "category_name", "description_preview", "server_type_badge", "section_count_badge", "icon_display"]
    search_fields = ["name", "description"]
    list_per_page = 20
    list_filter_submit = True

    autocomplete_fields = [
        "server_type",
    ]

    fieldsets = (
        (_("Category Details"), {"fields": ("name", "description", "icon"), "classes": ("section", "tab-details")}),

        (_("Server Assignment"), {"fields": ("server_type",), "classes": ("section", "tab-server")}),

    )

    @display(description="Category")
    def category_name(self, obj: AntiCheatConfigurationCategory):
        return format_html('<span class="font-medium">{}</span>', obj.name)

    @display(description="Description")
    def description_preview(self, obj: AntiCheatConfigurationCategory):
        if obj.description:
            return obj.description if len(obj.description) <= 60 else f"{obj.description[:57]}…"
        return format_html('<span class="text-gray-400">—</span>')

    @display(description="Server Type")
    def server_type_badge(self, obj: AntiCheatConfigurationCategory):
        try:
            server_type = obj.get_server_type_display()
        except Exception:
            server_type = str(obj.server_type)
        if "fivem" in server_type.lower():
            return format_html('<span class="badge badge-success">{}</span>', server_type)
        return format_html('<span class="badge badge-warning">{}</span>', server_type)

    @display(description="Sections")
    def section_count_badge(self, obj: AntiCheatConfigurationCategory):
        count = obj.sections.count()
        color = "badge-success" if count > 0 else "badge-gray"
        return format_html('<span class="badge {}">{}</span>', color, f"{count} Sections")

    @display(description="Icon")
    def icon_display(self, obj: AntiCheatConfigurationCategory):
        if obj.icon:
            return format_html('<span class="text-lg">{}</span>', obj.icon)
        return format_html('<span class="text-gray-400">—</span>')


# -------------------- Config Section Admin --------------------
@admin.register(AntiCheatConfigSection)
class AntiCheatConfigSectionAdmin(ModelAdmin):
    list_display = ["id", "title", "subtitle_preview", "category_name", "configuration_count_badge", "icon_display"]
    search_fields = ["title", "subtitle"]
    list_filter = ["category"]
    list_per_page = 25
    list_filter_submit = True
    list_filter_sheet = False

    autocomplete_fields = [
        "category",
    ]

    fieldsets = (
        (_("Section Details"), {"fields": ("title", "subtitle", "icon", "tooltip"), "classes": ("section", "tab-details")}),

        (_("Category Assignment"), {"fields": ("category",), "classes": ("section", "tab-category")}),

    )

    @display(description="Category")
    def category_name(self, obj: AntiCheatConfigSection):
        if obj.category:
            return format_html('<span class="font-medium text-blue-600">{}</span>', obj.category.name)
        return format_html('<span class="text-gray-400">—</span>')

    @display(description="Subtitle")
    def subtitle_preview(self, obj: AntiCheatConfigSection):
        if obj.subtitle:
            return obj.subtitle if len(obj.subtitle) <= 60 else f"{obj.subtitle[:57]}…"
        return format_html('<span class="text-gray-400">—</span>')

    @display(description="Configurations")
    def configuration_count_badge(self, obj: AntiCheatConfigSection):
        count = obj.configurations.count()
        color = "badge-success" if count > 0 else "badge-gray"
        return format_html('<span class="badge {}">{}</span>', color, f"{count} Configurations")

    @display(description="Icon")
    def icon_display(self, obj: AntiCheatConfigSection):
        if obj.icon:
            return format_html('<span class="text-lg">{}</span>', obj.icon)
        return format_html('<span class="text-gray-400">—</span>')


# -------------------- Malicious Signatures Admin --------------------
@admin.register(MaliciousSignatures)
class MaliciousSignaturesAdmin(ModelAdmin):
    list_display = ["id", "name", "signatures_count_badge", "type_badge", "priority_badge", "ban_message_preview"]
    search_fields = ["name", "ban_message"]
    list_filter = ["type", "priority"]
    list_per_page = 25
    list_filter_submit = True
    list_filter_sheet = False

    autocomplete_fields = [
        "ban_message",  # If FK/relation, otherwise remove
    ]

    fieldsets = (
        (_("Signature Details"), {"fields": ("name", "type", "priority", "ban_message", "ban_duration"), "classes": ("section", "tab-details")}),

        (_("Signature Data"), {"fields": ("signatures",), "classes": ("section", "tab-data")}),

    )

    @display(description="Signatures")
    def signatures_count_badge(self, obj: MaliciousSignatures) -> str:
        count = len(obj.signatures)
        color = "badge-error" if count > 10 else "badge-warning" if count > 5 else "badge-success"
        return format_html('<span class="badge {}">{}</span>', color, f"{count} Signatures")

    @display(description="Type")
    def type_badge(self, obj: MaliciousSignatures) -> str:
        type_map = {"file": "badge-success", "process": "badge-warning", "network": "badge-error", "memory": "badge-info"}
        server_type = obj.get_type_display() if hasattr(obj, "get_type_display") else str(obj.type)
        color = type_map.get(obj.type, "badge-gray")
        return format_html('<span class="badge {}">{}</span>', color, server_type)

    @display(description="Priority")
    def priority_badge(self, obj: MaliciousSignatures) -> str:
        if obj.priority is None:
            return format_html('<span class="badge badge-gray">N/A</span>')
        priority_text = str(obj.priority).lower()
        color_map = {"high": "badge-error", "medium": "badge-warning", "low": "badge-success"}
        color = color_map.get(priority_text, "badge-gray")
        return format_html('<span class="badge {}">{}</span>', color, priority_text.upper())

    @display(description="Ban Message")
    def ban_message_preview(self, obj: MaliciousSignatures) -> str:
        if obj.ban_message:
            return obj.ban_message if len(obj.ban_message) <= 40 else f"{obj.ban_message[:37]}…"
        return format_html('<span class="text-gray-400">—</span>')


# -------------------- Ban Admin --------------------
@admin.register(Ban)
class BanAdmin(ModelAdmin):
    list_display = [
        "id",
        "username",
        "display_server",
        "banned_at",
        "duration_badge",
        "state_badge",
        "reason_preview",
    ]
    search_fields = ["hwid__username", "game_server__name", "reason", "duration"]
    list_filter = ["active", "banned_at"]
    autocomplete_fields = ["hwid", "game_server", "report"]
    actions = ["unban_selected"]
    list_per_page = 50
    list_filter_submit = True
    list_filter_sheet = False

    fieldsets = (
        (_("Ban Information"), {"fields": ("hwid", "game_server", "reason", "duration", "active"), "classes": ("section", "tab-info")}),

        (_("Detection Report"), {"fields": ("report",), "classes": ("section", "tab-report")}),

        (_("Timestamps"), {"fields": ("banned_at",), "classes": ("collapse", "section", "tab-timestamps")} ),
    )

    readonly_fields = ("banned_at",)

    @admin.action(description="🔓 Unban selected")
    def unban_selected(self, request, queryset=None):
        if queryset is None:
            self.message_user(request, _("No items selected."), level=messages.WARNING)
            return
        updated = queryset.update(active=False)
        self.message_user(request, _("Unbanned %(count)d entries") % {"count": updated}, level=messages.SUCCESS)
    _add_action_attrs(unban_selected, "🔓 Unban selected")

    def has_delete_permission(self, request, obj=None):
        return False

    @display(description="Username")
    def username(self, obj: Ban):
        if obj.hwid:
            return format_html('<span class="font-medium">{}</span>', obj.hwid.username)
        return format_html('<span class="text-gray-400">Unknown</span>')

    @display(description="Status")
    def state_badge(self, obj: Ban):
        active = obj.active and not getattr(obj, "is_expired", False)
        if active:
            return format_html('<span class="badge badge-error">🔴 ACTIVE</span>')
        return format_html('<span class="badge badge-success">🟢 EXPIRED</span>')

    @display(description="Server")
    def display_server(self, obj: Ban):
        return obj.game_server.name if obj.game_server else "No Server"

    @display(description="Duration")
    def duration_badge(self, obj: Ban):
        if obj.duration:
            hours = obj.duration.total_seconds() / 3600
            if hours >= 24:
                days = hours / 24
                return format_html('<span class="badge badge-warning">{}d</span>', days)
            return format_html('<span class="badge badge-info">{:.1f}h</span>', hours)
        return format_html('<span class="badge badge-error">PERMANENT</span>')

    @display(description="Reason")
    def reason_preview(self, obj: Ban):
        if obj.reason:
            return obj.reason if len(obj.reason) <= 50 else f"{obj.reason[:47]}…"
        return format_html('<span class="text-gray-400">—</span>')


# -------------------- Warning Admin --------------------
@admin.register(Warning)
class WarningAdmin(ModelAdmin):
    list_display = ["id", "username", "warns_badge", "last_updated"]
    search_fields = ["hwid__username"]
    list_per_page = 30
    list_filter_submit = True

    autocomplete_fields = [
        "hwid",
    ]

    fieldsets = ((_('Warning Details'), {"fields": ("hwid", "warns"), "classes": ("section", "tab-details")}),)

    @display(description="Username")
    def username(self, obj: Warning):
        if obj.hwid:
            return format_html('<span class="font-medium">{}</span>', obj.hwid.username)
        return format_html('<span class="text-gray-400">Unknown</span>')

    @display(description="Warnings")
    def warns_badge(self, obj: Warning):
        color_map = {0: "badge-success", 1: "badge-info", 2: "badge-warning", 3: "badge-error"}
        color = color_map.get(obj.warns, "badge-error")
        return format_html('<span class="badge {}">{}/3</span>', color, obj.warns)

    @display(description="Last Updated")
    def last_updated(self, obj: Warning):
        return obj.hwid.last_seen if obj.hwid else "—"


# -------------------- Detection Report Admin --------------------
@admin.register(DetectionReport)
class DetectionReportAdmin(ModelAdmin):
    list_display = [
        "id",
        "username",
        "display_server",
        "detected_at",
        "detection_type_badge",
        "screenshot_preview",
        "has_ban_badge",
    ]
    search_fields = ("detected_at", "detection_type", "id", "report", "screenshot")
    list_filter = ["detection_type", "detected_at"]
    exclude = ["screenshot"]
    list_per_page = 50
    list_fullwidth = True
    list_filter_submit = True
    list_filter_sheet = False

    autocomplete_fields = [
        "hwid",
        "bans",
    ]

    fieldsets = (
        (_("Detection Information"), {"fields": ("hwid", "detection_type", "detected_at", "report"), "classes": ("section", "tab-info")}),

        (_("Evidence"), {"fields": ("screenshot_preview_large",), "classes": ("section", "tab-evidence")}),

    )

    readonly_fields = ("screenshot_preview_large", "detected_at")

    @display(description="Screenshot")
    def screenshot_preview(self, obj: DetectionReport):
        if obj.screenshot:
            return format_html('<img src="{}" width="40" height="40" style="object-fit: cover; border-radius: 4px;" alt="Screenshot" />', obj.screenshot.url)
        return format_html('<span class="text-gray-400">—</span>')

    @display(description="Type")
    def detection_type_badge(self, obj: DetectionReport):
        return obj.get_detection_type_display() if hasattr(obj, "get_detection_type_display") else str(obj.detection_type)        

    @display(description="Banned")
    def has_ban_badge(self, obj: DetectionReport):
        has_ban = obj.bans.exists()
        return format_html('<span class="badge badge-success">✅</span>') if has_ban else format_html('<span class="badge badge-gray">❌</span>')

    def has_add_permission(self, request):
        return False

    @display(description="Screenshot Preview")
    def screenshot_preview_large(self, obj: DetectionReport):
        if obj.screenshot:
            return format_html('<a target="_blank" href="{0}" class="block"><img src="{0}" width="400" alt="Screenshot" class="rounded border shadow-sm" /></a>', obj.screenshot.url)
        return format_html('<span class="text-gray-400">No Screenshot Available</span>')

    @display(description="Username")
    def username(self, obj: DetectionReport):
        if obj.hwid:
            return format_html('<span class="font-medium">{}</span>', obj.hwid.username)
        return format_html('<span class="text-gray-400">Unknown</span>')

    @display(description="Server")
    def display_server(self, obj: DetectionReport):
        try:
            ban = obj.bans.first()
            if ban and ban.game_server:
                return ban.game_server.name
        except Exception:
            pass
        return "No Server"


# -------------------- AntiCheat Version Admin --------------------
@admin.register(AntiCheatVersion)
class AntiCheatVersionAdmin(ModelAdmin):
    list_display = ["display_version", "major", "minor", "patch", "type_badge", "entity_badge", "current_badge"]
    list_filter = ("type", "is_current_version", "entity")
    list_per_page = 20
    list_filter_submit = True
    actions = ["set_as_current"]

    autocomplete_fields = [
        "entity",
    ]

    fieldsets = (
        (_("Version Information"), {"fields": ("major", "minor", "patch", "type", "entity"), "classes": ("section", "tab-version")}),

        (_("Release Status"), {"fields": ("is_current_version",), "classes": ("section", "tab-status")}),

    )

    @admin.action(description="⭐ Set as current version")
    def set_as_current(self, request, queryset=None):
        if queryset is None or queryset.count() == 0:
            self.message_user(request, _("No items selected."), level=messages.WARNING)
            return
        if queryset.count() != 1:
            self.message_user(request, _("Please select exactly one version."), level=messages.ERROR)
            return None
        version = queryset.first()
        if version.type != AntiCheatVersion.VersionType.STABLE:
            self.message_user(request, _("Only stable versions can be set as current."), level=messages.ERROR)
            return None
        AntiCheatVersion.objects.filter(is_current_version=True).update(is_current_version=False)
        version.is_current_version = True
        version.save()
        self.message_user(request, _("Set %(version)s as current version.") % {"version": str(version)}, level=messages.SUCCESS)

    _add_action_attrs(set_as_current, "⭐ Set as current version")

    @display(description="Version")
    def display_version(self, obj: AntiCheatVersion):
        return format_html('<span class="font-mono font-bold">{}</span>', str(obj))

    @display(description="Type")
    def type_badge(self, obj: AntiCheatVersion):
        color_map = {
            AntiCheatVersion.VersionType.STABLE: "badge-success",
            AntiCheatVersion.VersionType.BETA: "badge-warning",
            AntiCheatVersion.VersionType.DEPRECATED: "badge-error",
        }
        color = color_map.get(obj.type, "badge-gray")
        type_display = obj.get_type_display()
        return format_html('<span class="badge {}">{}</span>', color, type_display.upper())

    @display(description="Entity")
    def entity_badge(self, obj: AntiCheatVersion):
        color_map = {
            AntiCheatVersion.EntityType.FXSERVER: "badge-info",
            AntiCheatVersion.EntityType.AGENT: "badge-warning",
            AntiCheatVersion.EntityType.ENGINE: "badge-success",
        }
        color = color_map.get(obj.entity, "badge-gray")
        entity_display = obj.get_entity_display()
        return format_html('<span class="badge {}">{}</span>', color, entity_display)

    @display(description="Current")
    def current_badge(self, obj: AntiCheatVersion):
        return format_html('<span class="badge badge-success">⭐ CURRENT</span>') if obj.is_current_version else format_html('<span class="text-gray-400">—</span>')

    def save_model(self, request: HttpRequest, obj: AntiCheatVersion, form, change):
        if obj.is_current_version and obj.type != AntiCheatVersion.VersionType.STABLE:
            self.message_user(request, _("Can only set the current version STABLE (%(ver)s)") % {"ver": str(obj)}, level=messages.ERROR)
            return

        if obj.is_current_version:
            try:
                current_version = AntiCheatVersion.objects.get(is_current_version=True)
            except AntiCheatVersion.DoesNotExist:
                current_version = None
            if current_version and current_version.pk != getattr(obj, "pk", None):
                self.message_user(request, _("Cannot set %(new)s as current; %(cur)s is already current") % {"new": str(obj), "cur": str(current_version)}, level=messages.ERROR)
                return

        if AntiCheatVersion.objects.filter(major=obj.major, minor=obj.minor, patch=obj.patch).exclude(pk=getattr(obj, "pk", None)).exists():
            self.message_user(request, _("A same version already exists"), level=messages.ERROR)
            return

        return super().save_model(request, obj, form, change)


# -------------------- Whitelisted Process Admin --------------------
@admin.register(WhitelistedProcess)
class WhitelistedProcessAdmin(ModelAdmin):
    list_display = ["id", "name", "type_badge", "created_display"]
    search_fields = ["name"]
    list_per_page = 30
    list_filter_submit = True

    autocomplete_fields = [
        "type",
    ]

    fieldsets = (
        (_('Process Information'), {"fields": ("name", "type"), "classes": ("section", "tab-info")}),

    )

    @display(description="Type")
    def type_badge(self, obj: WhitelistedProcess):
        server_type = obj.get_type_display() if hasattr(obj, "get_type_display") else str(obj.type)
        if "fivem" in server_type.lower():
            return format_html('<span class="badge badge-success">{}</span>', server_type)
        return format_html('<span class="badge badge-warning">{}</span>', server_type)

    @display(description="Created")
    def created_display(self, obj: WhitelistedProcess):
        return getattr(obj, 'created_at', '—')


# -------------------- Threat File Admin --------------------
@admin.register(ThreatFile)
class ThreatFileAdmin(ModelAdmin):
    list_display = ["id", "name", "uploaded_by_username", "uploaded_at", "hash_short", "note_preview", "file_size_badge"]
    search_fields = ["id", "uploaded_by__username", "file", "found_path", "hash", "note"]
    list_filter = ["uploaded_at"]
    list_per_page = 40
    list_filter_submit = True

    autocomplete_fields = [
        "uploaded_by",
    ]

    fieldsets = (
        (_("File Information"), {"fields": ("file", "found_path", "hash", "note"), "classes": ("section", "tab-file")}),

        (_("Upload Details"), {"fields": ("uploaded_by", "uploaded_at"), "classes": ("section", "tab-upload")}),

    )

    readonly_fields = ("uploaded_at", "hash")

    @display(description="Hash")
    def hash_short(self, obj: ThreatFile):
        if obj.hash and len(obj.hash) > 16:
            return format_html('<code title="{}">{}…</code>', obj.hash, obj.hash[:16])
        return format_html('<code>{}</code>', obj.hash)

    @display(description="Note")
    def note_preview(self, obj: ThreatFile):
        if obj.note:
            return obj.note if len(obj.note) <= 40 else f"{obj.note[:37]}…"
        return format_html('<span class="text-gray-400">—</span>')

    @display(description="Uploaded By")
    def uploaded_by_username(self, obj: ThreatFile):
        if obj.uploaded_by:
            return format_html('<span class="font-medium">{}</span>', obj.uploaded_by.username)
        return format_html('<span class="text-gray-400">Unknown</span>')

    @display(description="Size")
    def file_size_badge(self, obj: ThreatFile):
        if obj.file:
            try:
                size = obj.file.size
                for unit in ["B", "KB", "MB", "GB"]:
                    if size < 1024.0:
                        return format_html('<span class="badge badge-info">{} {}</span>', size, unit)
                    size /= 1024.0
            except Exception:
                logger.exception("Error reading file size for %s", getattr(obj, 'pk', '?'))
        return format_html('<span class="badge badge-gray">—</span>')

    def has_delete_permission(self, request, obj=None):
        return False

    def get_readonly_fields(self, request, obj=None):
        base_readonly = list(self.readonly_fields)
        if obj:  # Existing object
            base_readonly.extend(["file", "uploaded_by"])
        return base_readonly


# -------------------- Crash Report Admin --------------------
@admin.register(CrashReport)
class CrashReportAdmin(ModelAdmin):
    list_display = ["id", "crash_by_username", "error_short", "exception_code_badge", "module_base_preview", "crashed_at"]
    list_filter = ["exception_code", "crashed_at"]
    list_per_page = 50
    list_filter_submit = True

    autocomplete_fields = [
        "crash_by",
    ]

    fieldsets = (
        (_("Crash Information"), {"fields": ("crash_by", "error", "exception_code", "exception_address", "exception_flags"), "classes": ("section", "tab-info")}),

        (_("Technical Details"), {"fields": ("module_base", "registers"), "classes": ("section", "tab-technical")}),

        (_("Timestamps"), {"fields": ("crashed_at",), "classes": ("collapse", "section", "tab-timestamps")} ),
    )

    readonly_fields = ("crashed_at",)

    @display(description="Error")
    def error_short(self, obj: CrashReport):
        if obj.error and len(obj.error) > 50:
            return f"{obj.error[:47]}…"
        return obj.error or format_html('<span class="text-gray-400">—</span>')

    @display(description="Code")
    def exception_code_badge(self, obj: CrashReport):
        if obj.exception_code:
            return format_html('<span class="badge badge-error">{}</span>', obj.exception_code)
        return format_html('<span class="text-gray-400">—</span>')

    @display(description="Module")
    def module_base_preview(self, obj: CrashReport):
        if obj.module_base:
            return obj.module_base if len(obj.module_base) <= 20 else f"{obj.module_base[:17]}…"
        return format_html('<span class="text-gray-400">—</span>')

    @display(description="Crashed By")
    def crash_by_username(self, obj: CrashReport):
        if obj.crash_by:
            return format_html('<span class="font-medium">{}</span>', obj.crash_by.username)
        return format_html('<span class="text-gray-400">Unknown</span>')

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        return False

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]


# -------------------- False Positive Report Admin --------------------
@admin.register(FalsePositiveReport)
class FalsePositiveReportAdmin(ModelAdmin):
    """False Positive Report Admin with enhanced unfold features."""
    
    list_display = ("id", "ban_info", "reported_by_username", "status_badge", "reviewed_by_username", "reviewed_at", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("ban__hwid__username", "reported_by__username", "reason")
    readonly_fields = ("created_at", "reviewed_at")
    list_per_page = 30
    
    # Unfold features
    list_filter_submit = True
    actions_list = ["approve_reports", "reject_reports"]

    autocomplete_fields = [
        "ban",
        "reported_by",
        "reviewed_by",
    ]

    fieldsets = (
        (_("Report Information"), {
            "fields": ("ban", "reported_by", "reason"),
            "classes": ("section", "tab-report"),
        }),
        (_("Review Status"), {
            "fields": ("status", "reviewed_by", "reviewed_at"),
            "classes": ("section", "tab-review"),
        }),
        (_("Timestamps"), {
            "fields": ("created_at",),
            "classes": ("collapse", "section", "tab-timestamps"),
        }),
    )

    @admin.action(description="✅ Approve reports")
    def approve_reports(self, request, queryset=None):
        if queryset is None:
            self.message_user(request, _("No items selected."), level=messages.WARNING)
            return
        updated_count = 0
        for report in queryset:
            if report.status != FalsePositiveReport.Status.APPROVED:
                report.mark_reviewed(FalsePositiveReport.Status.APPROVED, request.user)
                updated_count += 1
        
        self.message_user(
            request, 
            _("Approved %(count)d false positive reports") % {"count": updated_count}, 
            level=messages.SUCCESS
        )
    _add_action_attrs(approve_reports, "✅ Approve reports")

    @admin.action(description="❌ Reject reports")
    def reject_reports(self, request, queryset=None):
        if queryset is None:
            self.message_user(request, _("No items selected."), level=messages.WARNING)
            return
        updated_count = 0
        for report in queryset:
            if report.status != FalsePositiveReport.Status.REJECTED:
                report.mark_reviewed(FalsePositiveReport.Status.REJECTED, request.user)
                updated_count += 1
        
        self.message_user(
            request, 
            _("Rejected %(count)d false positive reports") % {"count": updated_count}, 
            level=messages.SUCCESS
        )
    _add_action_attrs(reject_reports, "❌ Reject reports")

    @display(description="Status")
    def status_badge(self, obj):
        status_map = {
            "pending": "badge-warning",
            "approved": "badge-success", 
            "rejected": "badge-error",
        }
        color = status_map.get(obj.status, "badge-gray")
        return format_html('<span class="badge {}">{}</span>', color, obj.status.upper())

    @display(description="Ban Info")
    def ban_info(self, obj):
        if obj.ban and obj.ban.hwid:
            return format_html(
                '{} - {}',
                obj.ban.hwid.username,
                obj.ban.reason or "No reason"
            )
        return format_html('<span class="text-gray-400">Unknown Ban</span>')

    @display(description="Reported By")
    def reported_by_username(self, obj):
        if obj.reported_by:
            return format_html('<span class="font-medium">{}</span>', obj.reported_by.get_username())
        return format_html('<span class="text-gray-400">—</span>')

    @display(description="Reviewed By")
    def reviewed_by_username(self, obj):
        if obj.reviewed_by:
            return format_html('<span class="font-medium">{}</span>', obj.reviewed_by.get_username())
        return format_html('<span class="text-gray-400">—</span>')


# -------------------- Atomic Engine Release Asset Admin --------------------
@admin.register(AtomicEngineReleaseAsset)
class AtomicEngineReleaseAssetAdmin(SimpleHistoryAdmin, ModelAdmin):
    """Atomic Engine Release Asset Admin with enhanced unfold features."""
    
    list_display = (
        "id",
        "name_or_file",
        "version_badge",
        "release_type_badge",
        "current_engine_badge",
        "uploaded_at",
        "file_size_readable",
        "download_actions",
    )
    
    list_display_links = ("id", "name_or_file")
    list_filter = ("release_type", "current_engine", "uploaded_at")
    search_fields = ("name", "version", "note", "file")
    ordering = ("-uploaded_at",)
    list_per_page = 25

    # Unfold features
    actions_list = ["set_as_current", "admin_download_selected", "download_latest_debug", "download_latest_release"]
    list_filter_submit = True
    list_filter_sheet = False

    autocomplete_fields = [
        "version",
    ]

    fieldsets = (
        (_("Release Information"), {
            "fields": ("name", "file", "version", "release_type", "current_engine"),
            "classes": ("section", "tab-release"),
        }),
        (_("Metadata"), {
            "fields": ("note", "file_download_link", "file_size_readable", "sha256"),
            "classes": ("section", "tab-meta"),
        }),
    )

    readonly_fields = ("file_download_link", "file_size_readable", "sha256", "uploaded_at")

    @display(description="Name / File")
    def name_or_file(self, obj: AtomicEngineReleaseAsset):
        if obj.name:
            return format_html('<span class="font-medium">{}</span>', obj.name)
        filename = os.path.basename(obj.file.name) if obj.file else "(no file)"
        return format_html('<span class="font-mono">{}</span>', filename)

    @display(description="Version")
    def version_badge(self, obj: AtomicEngineReleaseAsset):
        if obj.version:
            return format_html('<span class="badge badge-info">{}</span>', obj.version)
        return format_html('<span class="badge badge-gray">—</span>')

    @display(description="Type")
    def release_type_badge(self, obj: AtomicEngineReleaseAsset):
        display_text = obj.get_release_type_display()
        if obj.release_type == AtomicEngineReleaseAsset.ReleaseType.DEBUG:
            return format_html('<span class="badge badge-warning">{}</span>', display_text)
        return format_html('<span class="badge badge-success">{}</span>', display_text)

    @display(description="Current")
    def current_engine_badge(self, obj: AtomicEngineReleaseAsset):
        if obj.current_engine:
            return format_html('<span class="badge badge-success">⭐ CURRENT</span>')
        return format_html('<span class="text-gray-400">—</span>')

    @display(description="Actions")
    def download_actions(self, obj: AtomicEngineReleaseAsset):
        if not obj.file:
            return format_html('<span class="text-gray-400">—</span>')
        url = reverse("admin:anticheat_anticheatenginereleaseasset_download", args=(obj.pk,))
        return format_html(
            '<a class="button button-small" href="{}">📥 Download</a>',
            url
        )

    def _open_file_stream(self, obj: AtomicEngineReleaseAsset):
        if not obj.file:
            raise FileNotFoundError("No file attached to object")
        return obj.file.open("rb")

    @admin.action(description="⬇️ Download latest Debug")
    def download_latest_debug(self, request, queryset=None):
        return self._download_latest_engine(request, debug=True)
    _add_action_attrs(download_latest_debug, "⬇️ Download latest Debug")

    @admin.action(description="⬇️ Download latest Release")
    def download_latest_release(self, request, queryset=None):
        return self._download_latest_engine(request, debug=False)
    _add_action_attrs(download_latest_release, "⬇️ Download latest Release")

    def _download_latest_engine(self, request: HttpRequest, debug: bool):
        rec = AtomicEngineReleaseAsset.get_last_engine_record(debug=debug)
        if not rec:
            self.message_user(request, _("No %(type)s engine found.") % {"type": "Debug" if debug else "Release"}, level=messages.ERROR)
            return None
        try:
            fh = self._open_file_stream(rec)
            filename = os.path.basename(rec.file.name) if rec.file else f"latest_engine_{'debug' if debug else 'release'}.dll"
            return FileResponse(fh, as_attachment=True, filename=filename)
        except Exception as exc:
            logger.exception("Failed to send latest engine file")
            self.message_user(request, _("Failed to read file: %(err)s") % {"err": exc}, level=messages.ERROR)
            return None

    @display(description="Download")
    def file_download_link(self, obj: AtomicEngineReleaseAsset):
        if not obj.file:
            return format_html('<span class="text-gray-400">(no file)</span>')
        url = reverse("admin:anticheat_anticheatenginereleaseasset_download", args=(obj.pk,))
        return format_html('<a href="{}" class="button">📥 Download File</a>', url)

    @display(description="Size")
    def file_size_readable(self, obj: AtomicEngineReleaseAsset):
        if not obj.file:
            return format_html('<span class="text-gray-400">(no file)</span>')
        try:
            size = obj.file.size
        except Exception:
            return format_html('<span class="text-gray-400">(unknown size)</span>')
        
        for unit in ["B", "KB", "MB", "GB"]:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"

    @display(description="SHA-256")
    def sha256(self, obj: AtomicEngineReleaseAsset):
        if not obj.file:
            return format_html('<span class="text-gray-400">(no file)</span>')
        try:
            h = hashlib.sha256()
            with obj.file.open("rb") as fh:
                for chunk in iter(lambda: fh.read(8192), b""):
                    h.update(chunk)
            return format_html('<code class="text-xs font-mono">{}</code>', h.hexdigest())
        except Exception as exc:
            logger.exception("Failed to compute sha256 for %s", getattr(obj, "pk", "?"))
            return format_html('<span class="text-red-500">error: {}</span>', exc)

    @admin.action(description="⭐ Set as current engine")
    def set_as_current(self, request, queryset=None):
        if not request.user.is_staff:
            self.message_user(request, _("Permission denied"), level=messages.ERROR)
            return
        if queryset is None or queryset.count() == 0:
            self.message_user(request, _("No items selected."), level=messages.WARNING)
            return HttpResponse("No items selected.")
        if queryset.count() > 1:
            self.message_user(request, _("Please select only one engine to set as current."), level=messages.ERROR)
            return HttpResponse("Please select only one engine to set as current.")

        chosen = queryset.first()
        # Reset current engine
        AtomicEngineReleaseAsset.objects.exclude(pk=chosen.pk).update(current_engine=False)
        chosen.current_engine = True
        chosen.save(update_fields=["current_engine"])
        
        self.message_user(
            request, 
            _("Set #%(pk)d (%(name)s) as current engine.") % {
                "pk": chosen.pk, 
                "name": chosen.name or os.path.basename(chosen.file.name)
            }, 
            level=messages.SUCCESS
        )
    _add_action_attrs(set_as_current, "⭐ Set as current engine")

    @admin.action(description="📥 Download selected")
    def admin_download_selected(self, request, queryset=None):
        if queryset is None or not hasattr(queryset, "count"):
            self.message_user(request, _("Invalid selection."), level=messages.ERROR)
            return
        count = queryset.count()
        if count == 0:
            self.message_user(request, _("No items selected."), level=messages.WARNING)
            return
        if count == 1:
            obj = queryset.first()
            return redirect(reverse("admin:anticheat_anticheatenginereleaseasset_download", args=(obj.pk,)))
        
        # Multiple files - create zip
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
            for obj in queryset:
                if obj.file:
                    try:
                        with obj.file.open("rb") as fh:
                            filename = os.path.basename(obj.file.name)
                            zf.writestr(filename, fh.read())
                    except Exception as exc:
                        logger.exception("Failed to add file %s to zip", obj.file.name)
        
        buf.seek(0)
        response = HttpResponse(buf.read(), content_type="application/zip")
        response["Content-Disposition"] = f'attachment; filename="engine-assets-{count}-files.zip"'
        self.message_user(request, _("Downloaded %(count)d files as zip archive.") % {"count": count}, level=messages.SUCCESS)
        return response
    _add_action_attrs(admin_download_selected, "📥 Download selected")

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("<int:object_id>/download/", self.admin_site.admin_view(self.download_view), name="anticheat_anticheatenginereleaseasset_download"),
        ]
        return custom_urls + urls

    def download_view(self, request: HttpRequest, object_id: int, *args, **kwargs):
        obj = get_object_or_404(AtomicEngineReleaseAsset, pk=object_id)
        try:
            fh = self._open_file_stream(obj)
            filename = os.path.basename(obj.file.name)
            return FileResponse(fh, as_attachment=True, filename=filename)
        except Exception as exc:
            logger.exception("Failed to open file for %s", object_id)
            self.message_user(request, _("Failed to open file: %(err)s") % {"err": exc}, level=messages.ERROR)
            return redirect(reverse("admin:anticheat_anticheatenginereleaseasset_changelist"))

    def get_readonly_fields(self, request, obj=None):
        ro = list(self.readonly_fields)
        if obj is None and "sha256" in ro:
            ro.remove("sha256")
        return ro
