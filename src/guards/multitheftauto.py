from anticheat.consumers.safe_server import SafeServerConsumer
from anticheat.consumers.safe_engine import SafeEngineConsumer
from shared.ws import WebSocketGroupNames
from typing import List, Union, Any


class MultiTheftAutoGuardManager(object):
    """
    MultiTheftAutoGuardManager is responsible for managing SafeGuard servers and scanners.
    It provides functionalities to add, remove, and check the status of servers and scanners.
    """

    def __init__(self) -> None:
        """
        Initialize MultiTheftAutoGuardManager with empty lists to track Eagle servers and Eagle scanners.
        """
        self._eagle_servers: List[SafeServerConsumer] = []
        self._eagle_scanners: List[SafeEngineConsumer] = []

    def add_eagle_server(self, server: Union[SafeServerConsumer, Any]) -> bool:
        """
        Add an Eagle server to the manager if it belongs to the correct WebSocket group.

        Args:
            server (Union[EagleServerConsumer, Any]): The server instance to be added.

        Returns:
            bool: True if the server was successfully added, False otherwise.
        """
        if server.group_name != WebSocketGroupNames.SAFE_SERVERS.value:
            return False
        self._eagle_servers.append(server)
        return True
    
    def is_server_running(self, server_ip: str) -> bool:
        """
        Check if the Server is running

        Args:
            server_ip (str): _description_

        Returns:
            bool: True if running else False
        """
        for server in self._eagle_servers:
            if server.address[0] == server_ip:
                return True
        return False

    def add_eagle_scanner(self, scanner: SafeEngineConsumer) -> bool:
        """
        Add an Eagle scanner to the manager if it belongs to the correct WebSocket group.

        Args:
            scanner (EagleScanner): The scanner instance to be added.

        Returns:
            bool: True if the scanner was successfully added, False otherwise.
        """
        if scanner.group_name != WebSocketGroupNames.SAFE_ENGINES.value:
            return False
        self._eagle_scanners.append(scanner)
        return True

    def remove_eagle_server(self, server: SafeServerConsumer) -> bool:
        """
        Remove an Eagle server from the manager.

        Args:
            server (EagleServerConsumer): The server instance to be removed.

        Returns:
            bool: True if the server was successfully removed, False otherwise.
        """
        if server not in self._eagle_servers:
            return False

        for iter_server in self._eagle_servers:
            if iter_server == server:
                # Remove the server from the list
                del self._eagle_servers[self._eagle_servers.index(iter_server)]
                return True

    def remove_eagle_scanner(self, scanner: SafeEngineConsumer) -> bool:
        """
        Remove an Eagle scanner from the manager and trigger a disconnect action.

        Args:
            scanner (EagleScanner): The scanner instance to be removed.

        Returns:
            bool: True if the scanner was successfully removed, False otherwise.
        """
        if scanner not in self._eagle_scanners:
            return False

        for iter_scanner in self._eagle_scanners:
            if iter_scanner == scanner:
                # Remove the scanner from the list
                del self._eagle_scanners[self._eagle_scanners.index(iter_scanner)]
                # Trigger the disconnect action for the scanner
                iter_scanner.kick("Eagle Agent Disconnected")

    def is_scanner_connected_to_eagle(self, scanner_ip: str) -> bool:
        """
        Check if a scanner is connected to an Eagle server based on the scanner's IP address.

        Args:
            scanner_ip (str): The IP address of the scanner to check.

        Returns:
            bool: True if the scanner is connected, False otherwise.
        """
        return bool(self.get_scanner_by_ip(scanner_ip))

    def get_scanner_by_ip(self, scanner_ip: str) -> Union[SafeEngineConsumer, None]:
        """
        Retrieve an Eagle scanner by its IP address.

        Args:
            scanner_ip (str): The IP address of the scanner to retrieve.

        Returns:
            Union[EagleScanner, None]: The scanner instance if found, otherwise None.
        """
        for iter_scanner in self._eagle_scanners:
            if iter_scanner.address[0] == scanner_ip:
                return iter_scanner
        return None  # Not Found


# Instantiate the MultiTheftAutoGuardManager
safeguard_manager = MultiTheftAutoGuardManager()
