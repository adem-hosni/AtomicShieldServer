from django.contrib import admin
from .models import AntiCheatConfigTemplates, AntiCheatConfigurations, MaliciousSignatures


admin.site.register(AntiCheatConfigTemplates)
admin.site.register(AntiCheatConfigurations)
admin.site.register(MaliciousSignatures)
