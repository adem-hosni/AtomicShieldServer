"""
ASE Query Parser for MTA:SA by Eagle Developers

Example of code:
```
client = ASEQueryClient()
buffer = client.clean_query(client.getquery(("127.0.0.1", 22003)))
parser = ASEParser(buffer)
print(parser.get_server())
```
"""

from dataclasses import dataclass
from typing import Union, List, Optional, Tuple
import socket


@dataclass
class ASEQueryLightData:
    server_name: str
    game_type: str
    map_name: str
    build_type: str
    build_number: str
    uptime: int
    http_port: int
    ase_version: int
    passworded: bool
    serial_verification: bool
    joined_players: int
    max_players: int


class ASEParser:
    def __init__(self, query: Union[str, bytes]) -> None:
        if isinstance(query, str):
            query = query.encode()

        self._buffer = query
        self._current_pos = 0

    def read_length(self) -> int:
        if len(self._buffer) < self._current_pos + 1:
            return 0

        byte = self._buffer[self._current_pos]
        self._current_pos += 1
        return byte - 1

    def read_byte(self) -> int:
        byte = self._buffer[self._current_pos]
        self._current_pos += 1
        return byte

    def read_string(self) -> str:
        size = self.read_length()
        if len(self._buffer) < self._current_pos + size:
            return ""
        buffer = self._buffer[self._current_pos : self._current_pos + size]
        self._current_pos += size
        return buffer.decode()

    def read_extradata(self) -> List[bytes]:
        extra_data_length = self.read_length()
        buffer = self._buffer[self._current_pos : self._current_pos + extra_data_length]
        self._current_pos += extra_data_length
        return buffer.split(b"\0")

    def get_server(self) -> ASEQueryLightData:
        # Reset cursor position to 0
        self._current_pos = 0

        server_name = self.read_string()
        game_type = self.read_string()
        map_name = self.read_string()

        extra_data = self.read_extradata()
        build_type = extra_data[2]
        build_number = extra_data[3]
        uptime = extra_data[6]
        http_port = extra_data[7]
        ase_version = self.read_string()
        passworded = self.read_byte()
        serial_verification = self.read_byte()
        joined_players = self.read_byte()
        max_players = self.read_byte()

        return ASEQueryLightData(
            server_name,
            game_type,
            map_name,
            build_type,
            build_number,
            uptime,
            http_port,
            ase_version,
            passworded,
            serial_verification,
            joined_players,
            max_players,
        )


class ASEQueryClient(socket.socket):
    def __init__(self, timeout: Optional[int] = 5) -> None:
        super().__init__(socket.AF_INET, socket.SOCK_DGRAM)

        # Set Socket Options
        self.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.settimeout(timeout)

    def getquery(self, address: Tuple[str, int]) -> Union[bool, bytes]:
        try:
            self.connect((address[0], address[1] + 123))
            self.send("r".encode())

            _buffer = self.recvfrom(1024)[0]
        except Exception as err:
            print("Failed to get server query, ERROR: ", err)
            return False

        self.close()
        return _buffer

    def clean_query(self, query: bytes) -> bytes:
        if len(query) < 8:
            raise ValueError("Invalid Query")
        return query[8:]
