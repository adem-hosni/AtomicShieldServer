from shared.models import ServerType
from datetime import datetime
from shared.enums import DetectionType
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from typing import Union


class AntiCheatConfigDataTypes(models.IntegerChoices):
    BOOLEAN = 1, "Boolean"
    STRING = 2, "String"
    INTEGER = 3, "Integer"


class AntiCheatConfigurationCategories(models.Model):
    name = models.CharField(max_length=32)
    description = models.TextField()
    server_type = models.IntegerField(
        choices=ServerType, null=False, default=ServerType.FIVEM
    )

    class Meta:
        db_table = "anticheat_configuration_categories"
        verbose_name = "AntiCheat Config Category"
        verbose_name_plural = "AntiCheat Config Categories"

    def __str__(self) -> str:
        return self.name


class AntiCheatConfigTemplates(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField(null=True, default=None, blank=True)
    pseudo_name = models.CharField(max_length=32, unique=True)
    server_type = models.IntegerField(
        choices=ServerType, null=False, default=ServerType.FIVEM
    )
    config_type = models.IntegerField(
        choices=AntiCheatConfigDataTypes,
        null=False,
        default=AntiCheatConfigDataTypes.BOOLEAN,
    )
    default_value = models.CharField(blank=True, max_length=512)
    category = models.ForeignKey(
        AntiCheatConfigurationCategories,
        on_delete=models.CASCADE,
        null=True,
        related_name="configs",
    )

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
        choices=ServerType, default=ServerType.FIVEM, blank=False
    )
    priority = models.IntegerField(null=True, default=None)
    ban_message = models.CharField(null=True, blank=True, max_length=64)
    ban_duaration = models.DurationField(blank=True)

    class Meta:
        db_table = "malicious_signatures"
        verbose_name = "Malicious Signature"
        verbose_name_plural = "Malicious Signatures"

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class ClientHWID(models.Model):
    username = models.CharField(max_length=32)
    computer_name = models.CharField(max_length=64)
    disks = models.JSONField(blank=False, default=list)
    cpuid = models.CharField(max_length=64)
    motherboard_serial = models.CharField(max_length=64)
    bios_version = models.CharField(max_length=32)
    pnp_device = models.CharField(max_length=512)

    class Meta:
        db_table = "hwids"
        verbose_name = "Client HWID"
        verbose_name_plural = "Client HWIDS"

    async def get_changes(self) -> int:
        """Check if any fields have changed compared to the database.

        Returns:
        --------
            int: How many columns were changed
        """
        if not self.pk:
            return True

        original = await type(self).objects.aget(pk=self.pk)

        changes = 0
        fields_to_check = [field.name for field in original._meta.fields]
        for field in fields_to_check:
            if getattr(self, field) != getattr(original, field):
                changes += 1

        return changes

    def __str__(self) -> str:
        return f"{self.username} ({self.id})"


class DetectionReport(models.Model):
    hwid = models.ForeignKey(ClientHWID, on_delete=models.CASCADE)
    detection_type = models.IntegerField(
        choices=DetectionType,
        null=False,
    )
    detected_at = models.DateTimeField(auto_now_add=True)
    report = models.JSONField(blank=False, default=dict)
    screenshot = models.ImageField(upload_to="detections/proofs")

    class Meta:
        db_table = "detection_reports"
        verbose_name = "Detection Report"
        verbose_name_plural = "Detection Reports"

    def __str__(self) -> str:
        return f"{self.hwid.username}'s Report"


class Ban(models.Model):
    hwid = models.ForeignKey(ClientHWID, on_delete=models.CASCADE)
    banned_at = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField(null=True, editable=True)  # null
    game_server = models.ForeignKey(
        "dashboard.GameServer", on_delete=models.CASCADE, null=True, blank=True
    )
    active = models.BooleanField(default=True)
    reason = models.CharField(null=True, max_length=96)
    report = models.ForeignKey(DetectionReport, on_delete=models.CASCADE, null=True)

    @property
    def is_expired(self) -> bool:
        return self.banned_at.timestamp() + self.duration.total_seconds() < datetime.now().timestamp()

    class Meta:
        db_table = "bans"
        verbose_name = "Ban"
        verbose_name_plural = "Bans"

    def __str__(self) -> str:
        return f"{self.hwid.username} - {int(self.duration.total_seconds() / 3600)}h"


class Warning(models.Model):
    hwid = models.ForeignKey(ClientHWID, on_delete=models.CASCADE)
    warns = models.PositiveSmallIntegerField(
        default=0, validators=[MaxValueValidator(3), MinValueValidator(0)]
    )

    class Meta:
        db_table = "warnings"
        verbose_name = "Warning"
        verbose_name_plural = "Warnings"

    @staticmethod
    async def warn(hwid: ClientHWID):
        try:
            target_warn = await Warning.objects.aget(hwid=hwid)
        except Warning.DoesNotExist:
            new_warn = Warning(hwid=hwid, warns=1)
            await new_warn.asave()
        else:
            target_warn.warns += 1
            await target_warn.asave()

    @staticmethod
    async def get_warns(hwid: ClientHWID) -> int:
        try:
            target_warn = await Warning.objects.aget(hwid=hwid)
        except Warning.DoesNotExist:
            return 0
        else:
            return target_warn.warns

    def __str__(self) -> str:
        return f"{self.hwid.username} - {self.warns}"
