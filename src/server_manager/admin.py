from django.contrib import admin
from .models import (
    AntiCheatConfigTemplates,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategories,
    MaliciousSignatures,
    ClientHWIDS,
)


class ClientHWIDAdmin(admin.ModelAdmin):
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


admin.site.register(AntiCheatConfigurationCategories)
admin.site.register(AntiCheatConfigTemplates)
admin.site.register(AntiCheatConfigurations)
admin.site.register(MaliciousSignatures)
admin.site.register(ClientHWIDS, ClientHWIDAdmin)
