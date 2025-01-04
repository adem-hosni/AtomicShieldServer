from anticheat.consumers.safe_server import SafeServerConsumer
from anticheat.consumers.safe_engine import SafeEngineConsumer
from shared.ws import WebSocketGroupNames
from typing import List, Union, Any


class _GuardManagerBase(object):
    """
    _GuardManagerBase is responsible for managing AtomicShield servers and engines.
    It provides functionalities to add, remove, and check the status of servers and engines.
    """

    def __init__(self) -> None:
        """
        Initialize _GuardManagerBase with empty lists to track AtomicShield servers and AtomicShield engines.
        """
        self._safe_servers: List[SafeServerConsumer] = []
        self._safe_engines: List[SafeEngineConsumer] = []

    @property
    def engines(self) -> List[SafeEngineConsumer]:
        return self._safe_engines

    def add_safe_server(self, server: Union[SafeServerConsumer, Any]) -> bool:
        """
        Add a AtomicShield server to the manager if it belongs to the correct WebSocket group.

        Args:
            server (Union[SafeServerConsumer, Any]): The server instance to be added.

        Returns:
            bool: True if the server was successfully added, False otherwise.
        """
        if server.group_name != WebSocketGroupNames.SAFE_SERVERS.value:
            return False
        self._safe_servers.append(server)
        return True

    def is_server_running(self, server_ip: str) -> bool:
        """
        Check if the Server is running

        Args:
            server_ip (str): _description_

        Returns:
            bool: True if running else False
        """
        for server in self._safe_servers:
            if server.address[0] == server_ip:
                return True
        return False

    def add_safe_scanner(self, scanner: SafeEngineConsumer) -> bool:
        """
        Add a AtomicShield engine to the manager if it belongs to the correct WebSocket group.

        Args:
            scanner (SafeEngineConsumer): The scanner instance to be added.

        Returns:
            bool: True if the scanner was successfully added, False otherwise.
        """
        if scanner.group_name != WebSocketGroupNames.SAFE_ENGINES.value:
            return False
        self._safe_engines.append(scanner)
        return True

    def remove_safe_server(self, server: SafeServerConsumer) -> bool:
        """
        Remove a AtomicShield server from the manager.

        Args:
            server (SafeServerConsumer): The server instance to be removed.

        Returns:
            bool: True if the server was successfully removed, False otherwise.
        """
        if server not in self._safe_servers:
            return False

        for iter_server in self._safe_servers:
            if iter_server == server:
                # Remove the server from the list
                del self._safe_servers[self._safe_servers.index(iter_server)]
                return True

    def remove_safe_scanner(self, scanner: SafeEngineConsumer) -> bool:
        """
        Remove a AtomicShield scanner from the manager and trigger a disconnect action.

        Args:
            scanner (SafeEngineConsumer): The scanner instance to be removed.

        Returns:
            bool: True if the scanner was successfully removed, False otherwise.
        """
        if scanner not in self._safe_engines:
            return False

        for iter_scanner in self._safe_engines:
            if iter_scanner == scanner:
                # Remove the scanner from the list
                del self._safe_engines[self._safe_engines.index(iter_scanner)]

    def is_engine_connected(self, scanner_ip: str) -> bool:
        """
        Check if a scanner is connected to a AtomicShield server based on the scanner's IP address.

        Args:
            scanner_ip (str): The IP address of the scanner to check.

        Returns:
            bool: True if the scanner is connected, False otherwise.
        """
        return bool(self.get_scanner_by_ip(scanner_ip))

    def get_scanner_by_ip(self, scanner_ip: str) -> Union[SafeEngineConsumer, None]:
        """
        Retrieve a AtomicShield scanner by its IP address.

        Args:
            scanner_ip (str): The IP address of the scanner to retrieve.

        Returns:
            Union[SafeEngineConsumer, None]: The scanner instance if found, otherwise None.
        """
        for iter_engine in self._safe_engines:
            if iter_engine.address[0] == scanner_ip:
                return iter_engine
        return None  # Not Found
