from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import (
    AntiCheatConfigTemplates,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategories,
    MaliciousSignatures,
    ClientHWID,
    Ban,
)


class ClientHWIDAdmin(ModelAdmin):
    list_display = [
        "username",
        "computer_name",
        "serial",
        "motherboard_serial",
        "bios_version",
    ]

    @admin.display(description="Serial")
    def serial(self, obj: ClientHWID):
        return obj.mta_serial


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
    list_display = ["username", "duration", "reason"]

    @admin.display(description="Username")
    def username(self, obj: Ban):
        return obj.hwid.username

    @admin.display(description="Duration")
    def duration(self, obj: Ban):
        hours = obj.duration.hour
        if hours == 0:
            return f"{obj.duration.minute}m"
        return f"{obj.duration.hour}h"

    @admin.display(description="Reason")
    def reason(self, obj: Ban):
        return obj.reason


admin.site.register(
    AntiCheatConfigurationCategories, AntiCheatConfigurationsCategoriesAdmin
)
admin.site.register(AntiCheatConfigTemplates, AntiCheatConfigurationsAdmin)
admin.site.register(AntiCheatConfigurations, ModelAdmin)
admin.site.register(MaliciousSignatures, MaliciousSignaturesAdmin)
admin.site.register(ClientHWID, ClientHWIDAdmin)
admin.site.register(Ban, BanAdminModel)
