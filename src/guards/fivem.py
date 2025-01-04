from ._base import _GuardManagerBase


class FivemGuardManager(_GuardManagerBase):
    """
    FivemGuardManager is responsible for managing AtomicShield servers and engines.
    It provides functionalities to add, remove, and check the status of servers and engines.
    """


fivem_guard = FivemGuardManager()
