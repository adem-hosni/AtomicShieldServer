from shared.models import ServerTypes

from django.db import models


class AntiCheatConfigTemplates(models.Model):
    class AntiCheatConfigDataTypes(models.IntegerChoices):
        BOOLEAN = 1, "Boolean"
        STRING = 2, "String"
        INTEGER = 3, "Integer"

    name = models.CharField(max_length=64)
    description = models.TextField(null=True, default=None, blank=True)
    server_type = models.IntegerField(
        choices=ServerTypes, null=False, default=ServerTypes.MTASA
    )
    config_type = models.IntegerField(
        choices=AntiCheatConfigDataTypes,
        null=False,
        default=AntiCheatConfigDataTypes.BOOLEAN,
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
