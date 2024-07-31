from shared.models import ServerTypes
from django.db import models
from typing import Union

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
    default_value = models.TextField(blank=True)

    class Meta:
        db_table = "anticheat_config_templates"
        verbose_name = "AntiCheat Config Template"
        verbose_name_plural = "AntiCheat Config Templates"
        
    def get_default_value(self) -> Union[bool, str, int]:
        """Convert `default_value` to the correct type based on `config_type`."""
        if self.config_type == 1:
            return self.default_value.strip().lower() in ('true', '1')
        elif self.config_type == 2:
            return self.default_value
        elif self.config_type == 3:
            return int(self.default_value)
        # Handle other types
        return self.default_value


    def __str__(self) -> str:
        return self.name


class AntiCheatConfigurations(models.Model):
    config = models.JSONField(blank=False, default=dict)  # Json Dump

    class Meta:
        db_table = "anticheat_configurations"
        verbose_name = "AntiCheat Configuration"
        verbose_name_plural = "AntiCheat Configurations"
