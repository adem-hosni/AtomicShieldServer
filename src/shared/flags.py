from enum import Enum
from typing import Any, Optional


class FlagType(Enum):
    CUSTOM = 1
    MISSING_MTASA_AC_COMPONENT = 2

class Flag:
    def __init__(self, flag_type: FlagType, message: str) -> None:
        self._type = flag_type
        self._message = message
        
    @property
    def type(self) -> FlagType:
        return self._type
    
    @property
    def value(self) -> Any:
        return self._value
