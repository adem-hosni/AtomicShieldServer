from ._base import _ConnectionManager


class FivemConnectionManager(_ConnectionManager):
    """
    FivemGuardManager is responsible for managing AtomicShield servers and engines.
    It provides functionalities to add, remove, and check the status of servers and engines.
    """


fivem_conn_manager = FivemConnectionManager()
