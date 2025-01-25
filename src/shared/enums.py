from enum import Enum
from django.db import models


class SafeServerPacketID(Enum):
    NETWORK_JOIN = 1
    SYNC_ANTICHEAT_CONFIGS = 2
    REQUEST_STATUS = 3
    REQUEST_PLAYER_JOIN = 4
    PLAYER_KICK = 5
    OBFUSCATE_CLIENT_SCRIPT = 6
    SYNC_ANTICHEAT_COMPONENTS = 7
    PLAYER_QUIT = 8


class SafeEnginePacketID(Enum):
    NETWORK_JOIN = 1
    SYNC_SIGNATURES = 2
    MALICIOUS_SIGNATURE_DETECTION = 3
    GAME_ANTICHEAT_COMPONENT_STATUS = 4
    SCANNER_DISCONNECT = 5
    REQUEST_UPLOAD = 6
    CHEAT_DETECTION = 7


class WebSocketGroupNames(Enum):
    SAFE_SERVERS = "SAFE_SERVERS"
    SAFE_ENGINES = "SAFE_ENGINES"


class SafeUploadType(models.IntegerChoices):
    FIVEM_PLUGIN = 1, "Fivem Plugin"
    CHEAT_DLL = 2, "Cheat"


class DetectionType(models.IntegerChoices):
    CUSTOM = 0, "Custom"
    UNAUTHORIZED_THREAD = 1, "Unauthorized Thread"
    UNRECOGNIZED_IAT = 2, "Unrecognized IAT"
    DLL_FOUND = 3, "Direct X DLL Found"
    SECURE_BOOT_DISABLED = 4, "Secure Boot Disabled"
    DEBUG_MODE_ENABLED = 5, "Debug Mode Enabled"
    TEST_SIGNING_ENABLED = 6, "Test Signing Enabled"
    INJECTED_DLL = 7, "Inject Dll"
    CHEAT_SIGNATURE_FOUND = 8, "Cheat Signature Found"
    MALICIOUS_PROCESS_HANDLE_OPEN = 9, "Malicious Process opened FiveM handle"
    MALICIOUS_DRIVER = 10, "Malicious Driver Found"
    THREAD_SHELLCODE = 11, "Thread Shell Code"


unstrict_detection_types = [
    DetectionType.MALICIOUS_DRIVER,
    DetectionType.TEST_SIGNING_ENABLED,
    DetectionType.DEBUG_MODE_ENABLED,
    DetectionType.SECURE_BOOT_DISABLED,
]
