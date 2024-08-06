from enum import Enum


class EagleServerPacketID(Enum):
    NETWORK_JOIN = 1
    SYNC_ANTICHEAT_CONFIGS = 2


class EagleScannerPacketID(Enum):
    NETWORK_JOIN = 1
    SYNC_SIGNATURES = 2

class WebSocketGroupNames(Enum):
    EAGLE_SERVERS = "EAGLE_SERVERS"
    EAGLE_CLIENTSCANNER = "EAGLE_CLIENTSCANNER"
