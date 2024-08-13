from django.contrib import admin
from .models import (
    AntiCheatConfigTemplates,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategories,
    MaliciousSignatures,
    ClientHWIDS,
)


admin.site.register(AntiCheatConfigurationCategories)
admin.site.register(AntiCheatConfigTemplates)
admin.site.register(AntiCheatConfigurations)
admin.site.register(MaliciousSignatures)
admin.site.register(ClientHWIDS)
