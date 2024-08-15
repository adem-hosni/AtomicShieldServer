from server_manager.consumers.eagle_server import EagleServerConsumer
from server_manager.consumers.eagle_scanner import EagleScanner
from shared.ws import WebSocketGroupNames
from typing import List, Union, Any


class EagleManager(object):
    def __init__(self) -> None:
        self._eagle_servers: List[EagleServerConsumer] = []
        self._eagle_scanners: List[EagleScanner] = []

    def add_eagle_server(self, server: Union[EagleServerConsumer, Any]) -> bool:
        if server.group_name != WebSocketGroupNames.EAGLE_SERVERS.value:
            return False
        self._eagle_servers.append(server)
        return True

    def add_eagle_scanner(self, scanner: EagleScanner) -> bool:
        if scanner.group_name != WebSocketGroupNames.EAGLE_CLIENTSCANNER.value:
            return False
        self._eagle_scanners.append(scanner)
        return True

    def remove_eagle_server(self, server: EagleServerConsumer) -> bool:
        if not server in self._eagle_servers:
            return False

        for iter_server in self._eagle_servers:
            if iter_server == server:
                del self._eagle_servers[self._eagle_servers.index(iter_server)]
                return True

    def remove_eagle_scanner(self, scanner: EagleScanner) -> bool:
        if not scanner in self._eagle_scanners:
            return False

        for iter_scanner in self._eagle_scanners:
            if iter_scanner == scanner:
                del self._eagle_scanners[self._eagle_scanners.index(iter_scanner)]
                iter_scanner.kick("Eagle Agent Disconnected")

    def is_scanner_connected_to_eagle(self, scanner_ip: str) -> bool:
        return bool(self.get_scanner_by_ip(scanner_ip))

    def get_scanner_by_ip(self, scanner_ip: str) -> Union[EagleScanner, None]:
        for iter_scanner in self._eagle_scanners:
            if iter_scanner.address[0] == scanner_ip:
                return iter_scanner
        return None  # Not Found


eagle_manager = EagleManager()
