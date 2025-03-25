from django.contrib import admin
from unfold.admin import ModelAdmin
from django.contrib.admin import SimpleListFilter
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe
from .models import (
    AntiCheatConfigTemplates,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategories,
    MaliciousSignatures,
    ClientHWID,
    Ban,
    Warning,
    DetectionReport,
)
from guards import fivem_guard


class ClientHWIDAdmin(ModelAdmin):
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
            if filter_value == "online":
                queryset = queryset.filter(
                    id__in=[
                        record.id
                        for record in queryset
                        if fivem_guard.get_scanner_by_hwid(record)
                    ]
                )
            elif filter_value == "offline":
                queryset = queryset.filter(
                    id__in=[
                        record.id
                        for record in queryset
                        if not fivem_guard.get_scanner_by_hwid(record)
                    ]
                )
            return queryset

    list_display = [
        "username",
        "display_disks",
        "computer_name",
        "motherboard_serial",
        "bios_version",
        "display_online",
    ]

    list_display_links = list_display
    search_fields = list_display

    list_filter = [OnlineFilter]

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.display(description="Disks")
    def display_disks(self, obj: ClientHWID):
        return "-".join(obj.disks)

    @admin.display(description="Online", boolean=True)
    def display_online(self, obj: ClientHWID):
        return bool(fivem_guard.get_scanner_by_hwid(obj))


class AntiCheatConfigurationsAdmin(ModelAdmin):
    list_display = ["id", "title", "description", "category"]
    search_fields = list_display
    list_display_links = list_display
    list_filter = ["category", "config_type"]

    @admin.display(description="Title")
    def title(self, obj: AntiCheatConfigTemplates):
        return obj.name

    @admin.display(description="Description")
    def description(self, obj: AntiCheatConfigTemplates):
        return obj.description


class ServerAntiCheatConfiguration(ModelAdmin):
    list_display = ["id", "display_server_name"]
    search_fields = list_display
    list_display_links = list_display
    list_filter = []

    @admin.display(description="Server Name")
    def display_server_name(self, obj: AntiCheatConfigurations):
        game_server = obj.game_servers.first()
        return game_server.name if game_server else "No Server Found"


class AntiCheatConfigurationsCategoriesAdmin(ModelAdmin):
    list_display = ["category", "description"]

    @admin.display(description="Category")
    def category(self, obj: AntiCheatConfigurationCategories):
        return obj.name

    @admin.display(description="Description")
    def description(self, obj: AntiCheatConfigurationCategories):
        return obj.description


class MaliciousSignaturesAdmin(ModelAdmin):
    list_display = ["name", "signatures_count", "type", "priority"]

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
    list_display = ["username", "display_server", "banned_at", "duration", "state", "reason"]
    search_fields = list_display
    list_display_links = list_display
    list_filter = ["active"]

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

    @admin.display(description="Username")
    def username(self, obj: Warning):
        return obj.hwid.username


class DetectionReportAdminModel(ModelAdmin):
    list_display = ["id", "username", "display_server", "detected_at", "detection_type"]
    list_display_links = list_display
    search_fields = list_display
    list_filter = ["detection_type"]
    exclude = ["screenshot"]
    list_per_page = 80

    def screenshot_preview(self, obj: DetectionReport):
        if obj.screenshot:  # Assuming 'screenshot' is the ImageField
            return mark_safe(f'<a target="_blank" href="{obj.screenshot.url}"><img src="{obj.screenshot.url}" width="150" alt="Screenshot" class="block rounded" /></a>')
        return "No Screenshot"


    def has_add_permission(self, request):
        return False

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields if field.name != "screenshot"] + ["screenshot_preview"]

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


admin.site.register(
    AntiCheatConfigurationCategories, AntiCheatConfigurationsCategoriesAdmin
)
admin.site.register(AntiCheatConfigTemplates, AntiCheatConfigurationsAdmin)
admin.site.register(AntiCheatConfigurations, ServerAntiCheatConfiguration)
admin.site.register(MaliciousSignatures, MaliciousSignaturesAdmin)
admin.site.register(ClientHWID, ClientHWIDAdmin)
admin.site.register(Ban, BanAdminModel)
admin.site.register(Warning, WarningAdminModel)
admin.site.register(DetectionReport, DetectionReportAdminModel)
