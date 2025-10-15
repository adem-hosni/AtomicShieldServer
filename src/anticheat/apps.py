from asgiref.sync import async_to_sync
from django.apps import AppConfig


class ServerManagerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "anticheat"
    verbose_name = "Engine"

    def ready(self):
        from services.websocket import fivem_conn_manager

        # async_to_sync(fivem_conn_manager.redis_manager.clear_all)()

        return super().ready()
