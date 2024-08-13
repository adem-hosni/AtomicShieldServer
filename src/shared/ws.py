from enum import Enum


class EagleServerPacketID(Enum):
    NETWORK_JOIN = 1
    SYNC_ANTICHEAT_CONFIGS = 2
    REQUEST_STATUS = 3
    REQUEST_PLAYER_JOIN = 4


class EagleScannerPacketID(Enum):
    NETWORK_JOIN = 1
    SYNC_SIGNATURES = 2
    MALICIOUS_SIGNATURE_DETECTION = 3


class WebSocketGroupNames(Enum):
    EAGLE_SERVERS = "EAGLE_SERVERS"
    EAGLE_CLIENTSCANNER = "EAGLE_CLIENTSCANNER"
