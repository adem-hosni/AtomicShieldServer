from typing import Any
from .enums import DetectionType


class Flag:
    def __init__(self, flag_type: DetectionType, message: str) -> None:
        self._type = flag_type
        self._message = message

    @property
    def type(self) -> DetectionType:
        return self._type

    @property
    def value(self) -> Any:
        return self._value
