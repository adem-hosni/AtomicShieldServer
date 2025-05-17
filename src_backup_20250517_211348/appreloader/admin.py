import importlib
import sys
from unfold.admin import ModelAdmin
from django.contrib import admin
from .models import Application
from django.apps import apps
import logging


logger = logging.getLogger(__name__)

class ApplicationAdminModel(ModelAdmin):
    list_display = ["name", "label", "path", "module"]
    list_display_links = list_display
    search_fields = list_display
    actions = ["action_reload"]

    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj = ...):
        return False
    def has_delete_permission(self, request, obj = ...):
        return False
    
    @admin.action(description="Reload")
    def action_reload(self, request, queryset):
        """
        Reload the selected applications.
        """
        fails = 0
        success = 0
        if not queryset:
            self.message_user(request, "No applications selected.")
            return
        
        
        for app in queryset:
            for name in list(sys.modules):
                if name.startswith(app.name):
                    for installed_app in apps.get_app_configs():
                        if installed_app.name.startswith(name):
                            for model in installed_app.get_models():
                                try:
                                    admin.site.unregister(model)
                                except Exception as err:
                                    logger.error(f"Error unregistering {model}: {err}")


                    try:
                        logger.info(f"Reloading {name}...")
                        importlib.reload(sys.modules[name])
                        success += 1
                    except Exception as err:
                        fails += 1
                        logger.error(f"Error reloading {name}: {err}")
        if fails:
            self.message_user(request, f"Failed to reload {fails} modules.", "error")
        else:
            self.message_user(request, f"Reloaded {success} modules.", "success")


admin.site.register(Application, ApplicationAdminModel)
