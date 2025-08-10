from shared.models import ServerType
from datetime import datetime
from shared.enums import DetectionType
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from simple_history.models import HistoricalRecords
from typing import Union, Self, List, Tuple


class AntiCheatConfigDataTypes(models.TextChoices):
    BOOLEAN = "boolean", "Boolean"
    STRING = "string", "String"
    NUMBER = "number", "Number"
    SELECT = "select", "Select"
    FILE_UPLOAD = "file_upload", "File Upload"
    FILE_EXPORT = "file_export", "File Export"
    EMBEDJSON = "embed_json", "Embed Json"


class AntiCheatConfigurationCategory(models.Model):
    name = models.CharField(max_length=32)
    description = models.TextField()
    icon = models.CharField(max_length=32)
    server_type = models.IntegerField(
        choices=ServerType,
        default=ServerType.FIVEM,
    )

    class Meta:
        # db_table = "anticheat_configuration_categories"
        verbose_name = "Configuration Category"
        verbose_name_plural = "Configuration Categories"

    def __str__(self):
        return self.name


class AntiCheatConfigSection(models.Model):
    category = models.ForeignKey(
        AntiCheatConfigurationCategory,
        on_delete=models.CASCADE,
        related_name="sections",
    )
    title = models.CharField(max_length=64)
    subtitle = models.TextField(null=True, blank=True)
    icon = models.CharField(max_length=64)

    class Meta:
        verbose_name = "Configuration Section"
        verbose_name_plural = "Configuration Sections"

    def __str__(self):
        return f"{self.category.name} - {self.title}"


class AntiCheatConfigTemplate(models.Model):
    section = models.ForeignKey(
        "anticheat.AntiCheatConfigSection",
        on_delete=models.CASCADE,
        related_name="configurations",
    )
    name = models.CharField(max_length=64)
    subtitle = models.TextField(null=True, blank=True)
    icon = models.CharField(max_length=64)
    tip = models.TextField(null=True, blank=True)
    pseudo_name = models.CharField(max_length=32, unique=True)

    server_type = models.IntegerField(
        choices=ServerType,
        default=ServerType.FIVEM,
    )

    config_type = models.TextField(
        choices=AntiCheatConfigDataTypes,
        default=AntiCheatConfigDataTypes.BOOLEAN,
    )

    default_value = models.CharField(max_length=512, blank=True)

    class Meta:
        verbose_name = "Configuration Template"
        verbose_name_plural = "Configuration Templates"

    def get_default_value(self) -> Union[bool, str, int]:
        """Convert default_value to the correct type."""
        if self.config_type == AntiCheatConfigDataTypes.BOOLEAN:
            return self.default_value.strip().lower() in ("true", "1")
        elif self.config_type == AntiCheatConfigDataTypes.NUMBER:
            try:
                return int(self.default_value)
            except ValueError:
                return 0
        return self.default_value

    def __str__(self):
        return f"{self.name} ({self.get_config_type_display()})"


class AntiCheatConfigurations(models.Model):
    config = models.JSONField(blank=False, default=dict)  # Json Dump

    class Meta:
        db_table = "anticheat_configurations"
        verbose_name = "Server Configuration"
        verbose_name_plural = "Server Configurations"

    def __str__(self) -> str:
        return f"Server Configuration ({self.id}) - {self.game_servers.first().name if self.game_servers.first() else "No Server"}"


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
        verbose_name = "Signature"
        verbose_name_plural = "Signatures"

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class HWID(models.Model):
    username = models.CharField(max_length=32)
    computer_name = models.CharField(max_length=64)
    disks = models.JSONField(blank=False, default=list)
    cpuid = models.CharField(max_length=64)
    motherboard_serial = models.CharField(max_length=64)
    bios_version = models.CharField(max_length=32)
    pnp_device = models.CharField(max_length=512)
    fivem_license = models.CharField(max_length=64, null=True)
    fivem_token = models.JSONField(blank=True, default=list)
    steam = models.CharField(max_length=64, null=True)
    discord_id = models.CharField(max_length=64, null=True)
    history = HistoricalRecords(custom_model_name="hwids_logs")

    class Meta:
        verbose_name = "HWID"
        verbose_name_plural = "HWIDs"

    async def get_changes(self) -> List[Tuple[str, str]]:
        """Check if any fields have changed compared to the database.

        Returns:
        --------
            int: How many columns were changed
        """
        if not self.pk:
            return True

        original = await type(self).objects.aget(pk=self.pk)

        changes = []
        fields_to_check = [field.name for field in original._meta.fields]
        for field in fields_to_check:
            if getattr(self, field) != getattr(original, field):
                changes.append((getattr(original, field), getattr(self, field)))

        return changes

    def __str__(self) -> str:
        return f"{self.username} ({self.id})"


class DetectionReport(models.Model):
    hwid = models.ForeignKey(HWID, on_delete=models.SET_NULL, null=True, blank=True)
    detection_type = models.IntegerField(
        choices=DetectionType,
        null=False,
    )
    detected_at = models.DateTimeField(auto_now_add=True)
    report = models.JSONField(blank=False, default=dict)
    screenshot = models.ImageField(upload_to="detections/proofs")

    class Meta:
        verbose_name = "Detection Report"
        verbose_name_plural = "Detection Reports"

    def __str__(self) -> str:
        return f"{self.hwid.username}'s Report"


class Ban(models.Model):
    hwid = models.ForeignKey(HWID, on_delete=models.CASCADE, null=True, blank=True)
    banned_at = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField(null=True, editable=True)  # null
    game_server = models.ForeignKey(
        "dashboard.GameServer", on_delete=models.CASCADE, null=True, blank=True
    )
    active = models.BooleanField(default=True)
    reason = models.CharField(null=True, max_length=256)
    report = models.ForeignKey(
        DetectionReport, on_delete=models.CASCADE, null=True, related_name="bans"
    )

    @property
    def is_expired(self) -> bool:
        return (
            self.banned_at.timestamp() + self.duration.total_seconds()
            < datetime.now().timestamp()
        )

    class Meta:
        verbose_name = "Ban"
        verbose_name_plural = "Bans"

    def __str__(self) -> str:
        return f"{self.hwid.username} - {int(self.duration.total_seconds() / 3600)}h"


class Warning(models.Model):
    hwid = models.ForeignKey(HWID, on_delete=models.CASCADE)
    warns = models.PositiveSmallIntegerField(
        default=0, validators=[MaxValueValidator(3), MinValueValidator(0)]
    )

    class Meta:
        verbose_name = "Warning"
        verbose_name_plural = "Warnings"

    @staticmethod
    async def warn(hwid: HWID):
        try:
            target_warn = await Warning.objects.aget(hwid=hwid)
        except Warning.DoesNotExist:
            new_warn = Warning(hwid=hwid, warns=1)
            await new_warn.asave()
        else:
            target_warn.warns += 1
            await target_warn.asave()

    @staticmethod
    async def get_warns(hwid: HWID) -> int:
        try:
            target_warn = await Warning.objects.aget(hwid=hwid)
        except Warning.DoesNotExist:
            return 0
        else:
            return target_warn.warns

    def __str__(self) -> str:
        return f"{self.hwid.username} - {self.warns}"


class AntiCheatVersion(models.Model):
    class VersionType(models.IntegerChoices):
        DEPRECATED = 3, "Deprecated"
        BETA = 2, "Beta"
        STABLE = 0, "Stable"

    class EntityType(models.IntegerChoices):
        FXSERVER = 1, "FxServer"
        AGENT = 2, "Agent"
        ENGINE = 3, "Engine"

    major = models.IntegerField(null=False)
    minor = models.IntegerField(null=False, default=0)
    patch = models.IntegerField(null=False, default=0)
    type = models.IntegerField(null=False, choices=VersionType)
    entity = models.IntegerField(null=False, choices=EntityType)

    is_current_version = models.BooleanField(default=False)

    @classmethod
    def get_current_version(self, entity) -> Self:
        version = AntiCheatVersion(
            major=1, minor=0, patch=0, type=AntiCheatVersion.VersionType.STABLE
        )
        try:
            version = AntiCheatVersion.objects.get(is_current_version=True)
        except AntiCheatVersion.DoesNotExist:
            version = (
                AntiCheatVersion.objects.annotate(
                    total=models.F("major") + models.F("minor") + models.F("patch"),
                    custom_order=models.Case(
                        models.When(type=AntiCheatVersion.VersionType.STABLE, then=0),
                        models.When(type=AntiCheatVersion.VersionType.BETA, then=1),
                        models.When(
                            type=AntiCheatVersion.VersionType.DEPRECATED, then=2
                        ),
                        default=3,
                        output_field=models.IntegerField(),
                    ),
                )
                .order_by("custom_order", "-total")
                .first()
            )
        return version

    def __str__(self):
        return (
            f"{self.major}.{self.minor}.{self.patch}"
            + (f"-b" if self.type == AntiCheatVersion.VersionType.BETA else "")
            + (
                " deprecated"
                if self.type == AntiCheatVersion.VersionType.DEPRECATED
                else ""
            )
        )

    class Meta:
        verbose_name = "Version"
        verbose_name_plural = "Versions"


class WhitelistedProcess(models.Model):
    name = models.CharField(max_length=64, unique=True)
    type = models.IntegerField(
        choices=ServerType, default=ServerType.FIVEM, blank=False
    )

    class Meta:
        verbose_name = "Whitelisted Process"
        verbose_name_plural = "Whitelisted Processes"

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class ThreatFile(models.Model):
    file = models.FileField(upload_to="threat_files/")
    found_path = models.CharField(max_length=256)
    hash = models.CharField(max_length=256)
    note = models.CharField(max_length=256, blank=True, null=True)
    uploaded_by = models.ForeignKey(HWID, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    @property
    def name(self) -> str:
        return self.file.name.replace("/", "\\").split("\\")[-1]

    class Meta:
        verbose_name = "Threat File"
        verbose_name_plural = "Threat Files"

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class CrashReport(models.Model):
    crash_by = models.ForeignKey(HWID, on_delete=models.CASCADE, null=True)
    error = models.CharField(max_length=64, null=True)
    module_base = models.CharField(max_length=64, null=True)
    exception_code = models.CharField(max_length=32)
    exception_address = models.CharField(max_length=32)
    exception_flags = models.CharField(max_length=32)
    registers = models.JSONField(default=dict)
    crashed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Crash Report"

    def __str__(self):
        return f"Crash Report {self.exception_code} ({self.id}) - {self.crash_by.username if self.crash_by else 'Unknown'}"
