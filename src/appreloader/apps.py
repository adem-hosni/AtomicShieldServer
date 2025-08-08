import logging
from django.apps import AppConfig
from django.apps import apps


logger = logging.getLogger(__name__)

class AppreloaderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'appreloader'

    def is_app_installed(self, app_name):
        """
        Check if the app is installed in the Django project.
        """
        return app_name in [app.name for app in apps.get_app_configs()]

    def ready(self):
        from .models import Application

        for app in Application.objects.all():
            if not self.is_app_installed(app.name):
                app.delete()
                logger.info(f"Deleted application {app.name} from database.")

        for app in apps.get_app_configs():
            try:
                logger.info(f"Checking application {app.name}...")
                mod = app.module
                Application.objects.get(name=app.name)
            except Application.DoesNotExist:
                Application.objects.create(
                    name=app.name,
                    label=app.label,
                    path=app.path,
                    module=app.module,
                ).save()
                logger.info(f"Application {app.name} created in database.")
