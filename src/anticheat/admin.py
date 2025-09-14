import asyncio
import logging
import zipfile
import io
from django.http import HttpResponse
from asgiref.sync import async_to_sync
from django.contrib import admin
from django.http import HttpRequest
from unfold.admin import ModelAdmin
from django.contrib.admin import SimpleListFilter
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe
from simple_history.admin import SimpleHistoryAdmin
from .models import (
    AntiCheatConfigTemplate,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategory,
    AntiCheatConfigSection,
    MaliciousSignatures,
    HWID,
    Ban,
    Warning,
    DetectionReport,
    AntiCheatVersion,
    WhitelistedProcess,
    ThreatFile,
    CrashReport,
    FalsePositiveReport
)
from services.websocket import fivem_conn_manager


logger = logging.getLogger(__name__)


class ClientHWIDAdmin(SimpleHistoryAdmin, ModelAdmin):
    class OnlineFilter(SimpleListFilter):
        title = _("Online")
        parameter_name = "online"

        def lookups(self, request, model_admin):
            return (
                ("online", _("Online")),
                ("offline", _("Offline")),
            )

        def queryset(self, request, queryset):
            filter_value = self.value()
            online_engines = [engine.get("hwid") for engine in async_to_sync(fivem_conn_manager.redis_manager.get_all_engines)()]

            if filter_value == "online":
                queryset = queryset.filter(
                    id__in=[
                        record.id
                        for record in queryset
                        if str(record.id) in online_engines
                    ]
                )
            elif filter_value == "offline":
                queryset = queryset.filter(
                    id__in=[
                        record.id
                        for record in queryset
                        if not str(record.id) in online_engines
                    ]
                )
            return queryset

    class ConnectedServerFilter(SimpleListFilter):
        title = _("Connected Server")
        parameter_name = "connected_server"

        def lookups(self, request, model_admin):
            return [
                (server.game_server.id, server.game_server.name)
                for server in async_to_sync(fivem_conn_manager.get_servers)()
            ]

        def queryset(self, request, queryset):
            server_id = self.value()
            if server_id:
                try:
                    server_id = int(server_id)
                    return queryset.filter(
                        id__in=[
                            obj.id
                            for obj in queryset
                            if (
                                (engine := async_to_sync(fivem_conn_manager.get_scanner_by_hwid)(obj, True))
                                and engine.connected_server
                                and engine.connected_server.game_server.id == server_id
                            )
                        ]
                    )
                except Exception as e:
                    logger.error(f"ConnectedServerFilter error: {e}")
            return queryset

    list_display = [
        "id",
        "username",
        "ip",
        "computer_name",
        "motherboard_serial",
        "display_discord_id",
        "display_connected_server",
        "display_build_timestamp",
        "display_online",
    ]

    list_display_links = list_display
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

    list_filter = [OnlineFilter, ConnectedServerFilter]
    actions = ["download_debug_logs", "shutdown"]

    def download_debug_logs(self, request, queryset):
        engines = []
        for obj in queryset:
            engine = async_to_sync(fivem_conn_manager.get_scanner_by_hwid)(obj)
            if engine:
                engines.append((obj, engine))

        if not engines:
            self.message_user(request, "No engines found.", "error")
            return

        async def gather_logs():
            tasks = [engine.request_debug_logs() for _, engine in engines]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            return results

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            results = loop.run_until_complete(gather_logs())
        finally:
            loop.close()

        # Filter valid logs (ignore exceptions and empty logs)
        valid_logs = []
        for (obj, _), result in zip(engines, results):
            if not isinstance(result, str):
                logger.error(
                    f"Error fetching logs for {obj.username}: (got {result.__class__.__name__})"
                )
                continue

            if not result.strip():
                self.message_user(
                    request, f"No debug logs found for {obj.username}", "error"
                )
                continue
            valid_logs.append((obj, result))

        if not valid_logs:
            self.message_user(request, "No valid debug logs to download.", "error")
            return

        if len(valid_logs) == 1:
            obj, logs = valid_logs[0]
            response = HttpResponse(logs, content_type="text/plain")
            response["Content-Disposition"] = (
                f'attachment; filename="{obj.username}-{obj.id}_debug_logs.logs"'
            )
            self.message_user(
                request, f"Debug logs downloaded for {obj.username}", "success"
            )
            return response

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(
            zip_buffer, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9
        ) as zip_file:
            for obj, logs in valid_logs:
                filename = f"{obj.username}-{obj.id}_debug_logs.logs"
                zip_file.writestr(filename, logs)

        zip_buffer.seek(0)
        response = HttpResponse(zip_buffer.read(), content_type="application/zip")
        response["Content-Disposition"] = (
            f'attachment; filename="{len(valid_logs)}-debug-logs.zip"'
        )
        self.message_user(
            request,
            f"{len(valid_logs)} debug logs downloaded as zip archive.",
            "success",
        )
        return response

    def shutdown(self, request, queryset):
        if request.method == "POST":
            for obj in queryset:
                engine = async_to_sync(fivem_conn_manager.get_scanner_by_hwid)(obj)
                if engine:
                    try:
                        asyncio.run(engine.shutdown())
                        self.message_user(request, "Shutdown command sent", "success")
                    except Exception as e:
                        logger.error(f"Error sending shutdown command: {e}")
                        self.message_user(
                            request, "Error sending shutdown command", "error"
                        )
                else:
                    self.message_user(
                        request, f"{engine.username} is not online!", "error"
                    )

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(
            request, queryset, search_term
        )

        # Match by IP address (hwid.address[0])
        matching_ids = []
        for obj in self.model.objects.all():
            engine = async_to_sync(fivem_conn_manager.get_scanner_by_hwid)(obj, only_in_memory=True)
            if engine and engine.address:
                ip = engine.address[0]
                if search_term in ip:
                    matching_ids.append(obj.id)

        if matching_ids:
            queryset |= self.model.objects.filter(id__in=matching_ids)

        return queryset, use_distinct

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.display(description="Build")
    def display_build_timestamp(self, obj: HWID):
        return (
            async_to_sync(fivem_conn_manager.get_scanner_by_hwid)(obj, True).build_timestamp
            if async_to_sync(fivem_conn_manager.get_scanner_by_hwid)(obj, True)
            else "N/A"
        )

    @admin.display(description="Discord ID")
    def display_discord_id(self, obj: HWID):
        return obj.discord_id or "Not Linked"

    @admin.display(description="IP Address")
    def ip(self, obj: HWID):
        return async_to_sync(fivem_conn_manager.get_scanner_by_hwid)(obj, True).address[0] if async_to_sync(fivem_conn_manager.get_scanner_by_hwid)(obj) else "Not Found"

    @admin.display(description="Connected Server")
    def display_connected_server(self, obj: HWID):
        engine = async_to_sync(fivem_conn_manager.get_scanner_by_hwid)(obj, True)
        if engine:
            server = engine.connected_server
            return server.game_server.name if server else "No Server Connected"
        return "Not Connected"

    @admin.display(description="Online", boolean=True)
    def display_online(self, obj: HWID):
        return bool(async_to_sync(fivem_conn_manager.get_scanner_by_hwid)(obj, True))

    class Meta:
        model = HWID


_config_field = AntiCheatConfigTemplate._meta.get_field("config_type")
_server_field = AntiCheatConfigTemplate._meta.get_field("server_type")

CONFIG_CHOICES = [c[0] for c in _config_field.choices]  # e.g. ['boolean', 'number', 'string', ...]
SERVER_CHOICES = [c[0] for c in _server_field.choices]  # e.g. ['fivem', 'ragemp', ...]

# try to detect typical server keys; fall back to first/any if not found
def _find_server_key(possible_substrings):
    for s in SERVER_CHOICES:
        low = str(s).lower()
        for sub in possible_substrings:
            if sub in low:
                return s
    return None

FIVEM_KEY = _find_server_key(("fivem", "five"))

def _subset(*wanted):
    found = [v for v in CONFIG_CHOICES if v.lower() in set(w.lower() for w in wanted)]
    return found or CONFIG_CHOICES  # if nothing matched, fall back to all options

FIVEM_CONFIGS = _subset("boolean", "number")

@admin.register(AntiCheatConfigTemplate)
class AntiCheatConfigurationsAdmin(ModelAdmin):
    list_display = (
        "id",
        "name",
        "pseudo_name",
        "pretty_config_type",
        "section",
        "server_type",
        "default_value_preview",
    )
    list_filter = ("config_type", "server_type", "section__category")
    list_display_links = list_display
    search_fields = ("name", "pseudo_name", "default_value", "extra")
    ordering = ("section__category__name", "section__title", "name")
    list_per_page = 30

    # creative, folded fieldsets
    fieldsets = (
        (
            "General — Basic info",
            {"fields": ("name", "subtitle", "pseudo_name", "icon", "tip")},
        ),
        (
            "Assignment — Where this applies",
            {"fields": ("section", "server_type", "config_type")},
        ),
        (
            "Defaults & Extras — default values and per-type extras",
            {"fields": ("default_value", "extra")},
        ),
        # (
        #     "Advanced — read-only helpers",
        #     {"fields": ("created_at", "updated_at")},
        # ),
    )

    # make nice dynamic show/hide behaviour using unfold's conditional_fields feature
    # conditional_fields expects a mapping of: target_field -> {watch_field: {watch_val: "allowed_options_csv"}}
    # we compute keys dynamically so you don't have to hardcode 'boolean' or 'fivem'
    conditional_fields = {}

    # Only add server-based filtering if we detected relevant server keys
    if FIVEM_KEY:
        conditional_fields.setdefault("config_type", {})[
            "server_type"
        ] = {FIVEM_KEY: ",".join(FIVEM_CONFIGS)}
    # If none of the specific server keys were detected, as a fallback make config_type visible always:
    if not conditional_fields:
        conditional_fields = None  # unfold will just ignore it

    # optionally show created/updated if your model has them; otherwise ignore quietly
    readonly_fields = ()


    # custom pretty displays
    def pretty_config_type(self, obj):
        return obj.get_config_type_display() if hasattr(obj, "get_config_type_display") else str(obj.config_type)
    pretty_config_type.short_description = "Type"

    @admin.display(description="Default (parsed)")
    def default_value_preview(self, obj):
        try:
            val = obj.get_default_value()
            if isinstance(val, bool):
                return "✅ True" if val else "❌ False"
            if isinstance(val, (int, float)):
                return str(val)
            if isinstance(val, str) and len(val) > 60:
                return f"{val[:57]}…"
            return str(val) if val is not None else "-"
        except Exception as e:
            return f"err: {e}"

    # short pretty dump of extra JSON (avoid massive text)
    @admin.display(description="Extra (preview)")
    def extra_preview(self, obj):
        try:
            if not obj.extra:
                return "-"
            s = str(obj.extra)
            return s if len(s) <= 80 else s[:77] + "…"
        except Exception:
            return "-"

    # attach the preview column (optional; comment/uncomment if you want it in list_display)
    # list_display = list(list_display) + ["extra_preview"]

    # If you want better textarea size for JSON default, override widgets via formfield_overrides or get_form
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # increase rows for JSONField / default_value to make editing less annoying
        try:
            from django import forms
            if "extra" in form.base_fields:
                form.base_fields["extra"].widget = forms.Textarea(attrs={"rows": 6, "style": "font-family: monospace;"})
            if "default_value" in form.base_fields:
                form.base_fields["default_value"].widget = forms.Textarea(attrs={"rows": 2})
        except Exception:
            pass
        return form

    class Media:
        # js = ()
        # css = {"all": ()}
        ...


class ServerAntiCheatConfiguration(ModelAdmin):
    list_display = ["id", "display_server_name", "display_owner"]
    search_fields = ("config__overlap", "game_servers__name", "config")
    list_display_links = list_display
    list_filter = []

    @admin.display(description="Server Name")
    def display_server_name(self, obj: AntiCheatConfigurations):
        game_server = obj.game_servers.first()
        return game_server.name if game_server else "No Server Found"

    @admin.display(description="Owner")
    def display_owner(self, obj: AntiCheatConfigurations):
        game_server = obj.game_servers.first()
        return game_server.owner if game_server else "No Owner Found"


class AntiCheatConfigurationsCategoriesAdmin(ModelAdmin):
    list_display = ["id", "category", "description"]
    list_display_links = list_display
    search_fields = list_display

    @admin.display(description="Category")
    def category(self, obj: AntiCheatConfigurationCategory):
        return obj.name

    @admin.display(description="Description")
    def description(self, obj: AntiCheatConfigurationCategory):
        return obj.description


class AntiCheatConfigSectionAdmin(ModelAdmin):
    list_display = ["id", "title", "subtitle", "category__name"]
    search_fields = ["id", "title", "subtitle"]
    list_display_links = list_display
    list_filter = ["category"]


class MaliciousSignaturesAdmin(ModelAdmin):
    list_display = ["name", "signatures_count", "type", "ban_message"]
    list_display_links = list_display
    search_fields = list_display

    @admin.display(description="Name")
    def name(self, obj: MaliciousSignatures):
        return obj.name

    @admin.display(description="Signatures")
    def signatures_count(self, obj: MaliciousSignatures):
        return f"{len(obj.signatures)} Signatures"

    @admin.display(description="Type")
    def type(self, obj: MaliciousSignatures):
        return obj.type

    @admin.display(description="Priority")
    def priority(self, obj: MaliciousSignatures):
        return obj.priority


class BanAdminModel(ModelAdmin):
    list_display = [
        "id",
        "username",
        "display_server",
        "banned_at",
        "duration",
        "state",
        "reason",
    ]
    search_fields = [
        "hwid__username",
        "game_server__name",
        "reason",
        "duration",
    ]
    list_display_links = list_display
    list_filter = ["active", "game_server", "banned_at"]
    actions = ["unban"]

    @admin.action(description="Unban")
    def unban(self, request, queryset):
        for obj in queryset:
            obj.active = False
            obj.save()
        self.message_user(request, "Unbanned successfully", "success")

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.display(description="Username")
    def username(self, obj: Ban):
        return obj.hwid.username

    @admin.display(description="Banned", boolean=True)
    def state(self, obj: Ban):
        return obj.is_expired if obj.is_expired else obj.active

    @admin.display(description="Server")
    def display_server(self, obj: Ban):
        return obj.game_server.name if obj.game_server else "No Server"


class WarningAdminModel(ModelAdmin):
    list_display = ["username", "warns"]
    list_display_links = list_display
    search_fields = list_display

    @admin.display(description="Username")
    def username(self, obj: Warning):
        return obj.hwid.username


class DetectionReportAdminModel(ModelAdmin):
    list_display = ["id", "username", "display_server", "detected_at", "detection_type"]
    list_display_links = list_display
    search_fields = ("detected_at", "detection_type", "id", "report", "screenshot")
    list_filter = ["detection_type"]
    exclude = ["screenshot"]
    list_per_page = 80

    def screenshot_preview(self, obj: DetectionReport):
        if obj.screenshot:  # Assuming 'screenshot' is the ImageField
            return mark_safe(
                f'<a target="_blank" href="{obj.screenshot.url}"><img src="{obj.screenshot.url}" width="1000" alt="Screenshot" class="block rounded" /></a>'
            )
        return "No Screenshot"

    def has_add_permission(self, request):
        return False

    def get_readonly_fields(self, request, obj=None):
        return [
            field.name
            for field in self.model._meta.fields
            if field.name != "screenshot"
        ] + ["screenshot_preview"]

    @admin.display(description="Username")
    def username(self, obj: DetectionReport):
        return obj.hwid.username

    @admin.display(description="Server")
    def display_server(self, obj: DetectionReport):
        return (
            obj.bans.first().game_server.name
            if obj.bans.first() and obj.bans.first().game_server
            else "No Server"
        )


class AntiCheatVersionTypeAdminModel(ModelAdmin):
    list_display = ["display_version", "major", "minor", "patch", "type"]
    list_display_links = list_display
    search_fields = list_display

    list_filter = ("type",)

    @admin.display(description="Version")
    def display_version(self, obj: AntiCheatVersion):
        return str(obj)

    def save_model(self, request: HttpRequest, obj: AntiCheatVersion, form, change):
        if obj.is_current_version and obj.type != AntiCheatVersion.VersionType.STABLE:
            self.message_user(
                request,
                f"Can only set the current version STABLE ({str(obj)})",
                "error",
            )
            return

        if obj.is_current_version:
            try:
                current_version = AntiCheatVersion.objects.get(is_current_version=True)
            except AntiCheatVersion.DoesNotExist:
                ...
            else:
                self.message_user(
                    request,
                    f"Cannot set the current version {str(obj)}, the version {str(current_version)} is the current",
                    "error",
                )
                return

        try:
            same_version = AntiCheatVersion.objects.get(
                major=obj.major,
                minor=obj.minor,
                patch=obj.patch,
            )
        except AntiCheatVersion.DoesNotExist:
            ...
        else:
            if same_version:
                self.message_user(
                    request, f"A Same version found {str(same_version)}", "error"
                )
                return

        return super().save_model(request, obj, form, change)


class WhitelistedProcessAdminModel(ModelAdmin):
    list_display = ["id", "name"]
    list_display_links = list_display
    search_fields = list_display

    @admin.display(description="Name")
    def name(self, obj: WhitelistedProcess):
        return obj.name


class ThreatFileAdmin(ModelAdmin):
    list_display = [
        "id",
        "name",
        "uploaded_by",
        "uploaded_at",
        "hash",
        "note",
    ]
    list_display_links = list_display
    search_fields = ["id", "uploaded_by__id", "file", "found_path", "hash", "note"]
    list_filter = ["uploaded_at"]

    @admin.display(description="Name")
    def name(self, obj: ThreatFile):
        return obj.name

    def has_delete_permission(self, request, obj=...):
        return False

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields if field.name != "note"]


class CrashReportAdmin(ModelAdmin):
    list_display = [
        "id",
        "crash_by",
        "error",
        "module_base",
        "exception_code",
        "exception_address",
        "exception_flags",
        "crashed_at",
    ]
    list_display_links = list_display
    search_fields = list_display
    list_filter = ["exception_code"]

    def has_delete_permission(self, request, obj=...):
        return False

    def has_add_permission(self, request, obj=...):
        return False

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]


@admin.register(FalsePositiveReport)
class FalsePositiveReportAdmin(ModelAdmin):
    list_display = (
        "ban",
        "reported_by",
        "status",
        "reviewed_by",
        "reviewed_at",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "ban__player__username",
        "reported_by__username",
        "reason",
    )
    readonly_fields = ("created_at", "reviewed_at")

    fieldsets = (
        ("Report Info", {
            "fields": ("ban", "reported_by", "reason")
        }),
        ("Review", {
            "fields": ("status", "reviewed_by", "reviewed_at"),
        }),
        ("Timestamps", {
            "fields": ("created_at",),
        }),
    )

    actions = ["approve_reports", "reject_reports"]

    def approve_reports(self, request, queryset):
        queryset.update(
            status=FalsePositiveReport.Status.APPROVED,
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
    approve_reports.short_description = "Mark selected reports as Approved"

    def reject_reports(self, request, queryset):
        queryset.update(
            status=FalsePositiveReport.Status.REJECTED,
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
    reject_reports.short_description = "Mark selected reports as Rejected"



admin.site.register(
    AntiCheatConfigurationCategory, AntiCheatConfigurationsCategoriesAdmin
)
admin.site.register(AntiCheatConfigurations, ServerAntiCheatConfiguration)
admin.site.register(AntiCheatConfigSection, AntiCheatConfigSectionAdmin)
admin.site.register(MaliciousSignatures, MaliciousSignaturesAdmin)
admin.site.register(HWID, ClientHWIDAdmin)
admin.site.register(Ban, BanAdminModel)
admin.site.register(Warning, WarningAdminModel)
admin.site.register(DetectionReport, DetectionReportAdminModel)
admin.site.register(AntiCheatVersion, AntiCheatVersionTypeAdminModel)
admin.site.register(WhitelistedProcess, WhitelistedProcessAdminModel)
admin.site.register(ThreatFile, ThreatFileAdmin)
admin.site.register(CrashReport, CrashReportAdmin)
