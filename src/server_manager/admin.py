from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import (
    AntiCheatConfigTemplates,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategories,
    MaliciousSignatures,
    ClientHWIDS,
)


class ClientHWIDAdmin(ModelAdmin):
    list_display = ["username", "serial", "motherboard_serial", "bios_version"]

    @admin.display(description="Username")
    def username(self, obj: ClientHWIDS):
        return obj.username

    @admin.display(description="Serial")
    def serial(self, obj: ClientHWIDS):
        return obj.mta_serial

    @admin.display(description="Motherboard Serial")
    def motherboard_serial(self, obj: ClientHWIDS):
        return obj.motherboard_serial

    @admin.display(description="BOIS Version")
    def motherboard_serial(self, obj: ClientHWIDS):
        return obj.bios_version


class AntiCheatConfigurationsAdmin(ModelAdmin):
    list_display = ["title", "description"]

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


admin.site.register(
    AntiCheatConfigurationCategories, AntiCheatConfigurationsCategoriesAdmin
)
admin.site.register(AntiCheatConfigTemplates, AntiCheatConfigurationsAdmin)
admin.site.register(AntiCheatConfigurations, ModelAdmin)
admin.site.register(MaliciousSignatures)
admin.site.register(ClientHWIDS, ClientHWIDAdmin)
