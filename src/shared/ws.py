from enum import Enum


class RequestType(Enum):
    NETWORK_JOIN = 1


class WebSocketGroupNames(Enum):
    EAGLE_SERVERS = "EAGLE_SERVERS"
    EAGLE_CLIENTPLAYER = "EAGLE_CLIENTPLAYERS"
