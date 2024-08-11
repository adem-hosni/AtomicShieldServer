from django.contrib import admin
from .models import (
    AntiCheatConfigTemplates,
    AntiCheatConfigurations,
    AntiCheatConfigurationCategories,
    MaliciousSignatures,
)


admin.site.register(AntiCheatConfigurationCategories)
admin.site.register(AntiCheatConfigTemplates)
admin.site.register(AntiCheatConfigurations)
admin.site.register(MaliciousSignatures)
