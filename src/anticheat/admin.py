from django.contrib import admin
from unfold.admin import ModelAdmin
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


class ClientHWIDAdmin(ModelAdmin):
    list_display = [
        "display_disks",
        "username",
        "computer_name",
        "display_serial",
        "motherboard_serial",
        "bios_version",
    ]

    @admin.display(description="Serial")
    def display_serial(self, obj: ClientHWID):
        return obj.mta_serial

    @admin.display(description="Disks")
    def display_disks(self, obj: ClientHWID):
        return "-".join(obj.disks)


class AntiCheatConfigurationsAdmin(ModelAdmin):
    list_display = ["id", "title", "description"]

    @admin.display(description="Title")
    def title(self, obj: AntiCheatConfigTemplates):
        return obj.name

    @admin.display(description="Description")
    def description(self, obj: AntiCheatConfigTemplates):
        return obj.description


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
    list_display = ["username", "duration", "state", "reason"]

    @admin.display(description="Username")
    def username(self, obj: Ban):
        return obj.hwid.username

    @admin.display(description="Banned", boolean=True)
    def state(self, obj: Ban):
        return obj.is_expired if obj.is_expired else obj.active


class WarningAdminModel(ModelAdmin):
    list_display = ["username", "warns"]

    @admin.display(description="Username")
    def username(self, obj: Warning):
        return obj.hwid.username

class DetectionReportAdminModel(ModelAdmin):
    list_display = ["id", "username", "detected_at", "screenshot"]

    @admin.display(description="Username")
    def username(self, obj: DetectionReport):
        return obj.hwid.username


admin.site.register(
    AntiCheatConfigurationCategories, AntiCheatConfigurationsCategoriesAdmin
)
admin.site.register(AntiCheatConfigTemplates, AntiCheatConfigurationsAdmin)
admin.site.register(AntiCheatConfigurations, ModelAdmin)
admin.site.register(MaliciousSignatures, MaliciousSignaturesAdmin)
admin.site.register(ClientHWID, ClientHWIDAdmin)
admin.site.register(Ban, BanAdminModel)
admin.site.register(Warning, WarningAdminModel)
admin.site.register(DetectionReport, DetectionReportAdminModel)
