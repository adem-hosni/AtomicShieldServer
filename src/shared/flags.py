from typing import Dict, Any
from .enums import DetectionType, detection_messages
from utils import format_string

class Flag:
    def __init__(self, flag_type: DetectionType, report: Dict[str, Any]) -> None:
        self._type = flag_type
        self._report = report
        self.banned = False

    @property
    def type(self) -> DetectionType:
        return self._type

    @property
    def message(self) -> str:
        return format_string(detection_messages[self._type], self._report)

    @property
    def report(self) -> Dict[str, Any]:
        return self._report
