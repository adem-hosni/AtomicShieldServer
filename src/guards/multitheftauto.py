from ._base import _GuardManagerBase

class MultiTheftAutoGuardManager(_GuardManagerBase):
    """
    MultiTheftAutoGuardManager is responsible for managing AtomicShield servers and engines.
    It provides functionalities to add, remove, and check the status of servers and engines.
    """

mta_guard = MultiTheftAutoGuardManager()
