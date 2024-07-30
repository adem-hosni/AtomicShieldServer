from django.contrib import admin
from .models import AntiCheatConfigTemplates, AntiCheatConfigurations


admin.site.register(AntiCheatConfigTemplates)
admin.site.register(AntiCheatConfigurations)
