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
    default_value = models.CharField(blank=True, max_length=50)

    class Meta:
        db_table = "anticheat_config_templates"
        verbose_name = "AntiCheat Config Template"
        verbose_name_plural = "AntiCheat Config Templates"

    def get_default_value(self) -> Union[bool, str, int]:
        """Convert `default_value` to the correct type based on `config_type`."""
        if self.config_type == 1:
            return self.default_value.strip().lower() in ("true", "1")
        elif self.config_type == 2:
            return self.default_value
        elif self.config_type == 3:
            return int(self.default_value)
        # Handle other types
        return self.default_value

    def __str__(self) -> str:
        return self.name


class AntiCheatConfigurationCategories(models.Model):
    name = models.CharField(max_length=32)
    description = models.TextField()
    
    def __str__(self) -> str:
        return self.name


class AntiCheatConfigurations(models.Model):
    config = models.JSONField(blank=False, default=dict)  # Json Dump

    class Meta:
        db_table = "anticheat_configurations"
        verbose_name = "AntiCheat Configuration"
        verbose_name_plural = "AntiCheat Configurations"

    def __str__(self) -> str:
        return f"AntiCheat Configuration ({self.id})"


class MaliciousSignatures(models.Model):
    name = models.CharField(max_length=64, unique=True)
    signatures = models.JSONField(blank=False, default=list)
    type = models.IntegerField(
        choices=ServerTypes, default=ServerTypes.MTASA, blank=False
    )
    priority = models.IntegerField(null=True, default=None)
    ban_message = models.CharField(null=True, blank=True, max_length=64)

    class Meta:
        db_table = "malicious_signatures"
        verbose_name = "Malicious Signature"
        verbose_name_plural = "Malicious Signatures"

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"
