from shared.models import ServerTypes

from django.db import models


class AntiCheatConfigTemplates(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField(null=True, default=None, blank=True)
    type = models.IntegerField(
        choices=ServerTypes, null=False, default=ServerTypes.MTASA
    )

    class Meta:
        db_table = "anticheat_config_templates"
        verbose_name = "AntiCheat Config Template"
        verbose_name_plural = "AntiCheat Config Templates"

    def __str__(self) -> str:
        return self.name


class AntiCheatConfigurations(models.Model):
    config = models.TextField()  # Json Dump

    class Meta:
        db_table = "anticheat_configurations"
        verbose_name = "AntiCheat Configuration"
        verbose_name_plural = "AntiCheat Configurations"
