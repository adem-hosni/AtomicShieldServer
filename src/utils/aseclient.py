"""
ASE Query Parser for MTA:SA by SafeGuard

Code Example:
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
    """
    Data class to hold the server information extracted from an ASE query.

    Attributes:
    -----------
        server_name (str): Name of the server.
        game_type (str): Type of game being played on the server.
        map_name (str): Name of the map currently in use.
        build_type (str): Type of build of the server.
        build_number (str): Build number of the server.
        uptime (int): Time in seconds the server has been up.
        http_port (int): HTTP port used by the server.
        ase_version (int): Version of the ASE protocol.
        passworded (bool): Indicates if the server is password protected.
        serial_verification (bool): Indicates if serial verification is enabled.
        joined_players (int): Number of players currently joined.
        max_players (int): Maximum number of players allowed.
    """

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
    """
    Parses an ASE (All-Seeing Eye) query response to extract server information.

    Attributes:
    -----------
        query (Union[str, bytes]): The ASE query response, either as a string or bytes.
    """

    def __init__(self, query: Union[str, bytes]) -> None:
        """
        Initializes the ASEParser with a query.

        Args:
        -----
            query (Union[str, bytes]): The ASE query response.
        """
        if isinstance(query, str):
            query = query.encode()

        self._buffer = query
        self._current_pos = 0

    def read_length(self) -> int:
        """
        Reads the length of the next data segment from the buffer.

        Returns:
        --------
            int: The length of the data segment.
        """
        if len(self._buffer) < self._current_pos + 1:
            return 0

        byte = self._buffer[self._current_pos]
        self._current_pos += 1
        return byte - 1

    def read_byte(self) -> int:
        """
        Reads a single byte from the buffer.

        Returns:
        --------
            int: The byte value.
        """
        byte = self._buffer[self._current_pos]
        self._current_pos += 1
        return byte

    def read_string(self) -> str:
        """
        Reads a string from the buffer.

        Returns:
        --------
            str: The decoded string.
        """
        size = self.read_length()
        if len(self._buffer) < self._current_pos + size:
            return ""
        buffer = self._buffer[self._current_pos : self._current_pos + size]
        self._current_pos += size
        return buffer.decode()

    def read_extradata(self) -> List[bytes]:
        """
        Reads extra data from the buffer, split by null bytes.

        Returns:
        --------
            List[bytes]: List of extra data segments as bytes.
        """
        extra_data_length = self.read_length()
        buffer = self._buffer[self._current_pos : self._current_pos + extra_data_length]
        self._current_pos += extra_data_length
        return buffer.split(b"\0")

    def get_server(self) -> ASEQueryLightData:
        """
        Parses the ASE query response to extract server information.

        Returns:
        --------
            ASEQueryLightData: An instance containing the server information.
        """
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
            server_name=server_name,
            game_type=game_type,
            map_name=map_name,
            build_type=build_type,
            build_number=build_number,
            uptime=uptime,
            http_port=http_port,
            ase_version=ase_version,
            passworded=passworded,
            serial_verification=serial_verification,
            joined_players=joined_players,
            max_players=max_players,
        )


class ASEQueryClient(socket.socket):
    """
    Client class to send and receive ASE queries over UDP.

    Attributes:
    -----------
        timeout (Optional[int]): Timeout duration in seconds for socket operations.
    """

    def __init__(self, timeout: Optional[int] = 5) -> None:
        """
        Initializes the ASEQueryClient with optional timeout.

        Args:
        -----
            timeout (Optional[int]): Timeout duration for socket operations.
        """
        super().__init__(socket.AF_INET, socket.SOCK_DGRAM)

        # Set Socket Options
        self.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.settimeout(timeout)

    def getquery(self, address: Tuple[str, int]) -> Union[bool, bytes]:
        """
        Sends a query to the specified server address and receives the response.

        Args:
        -----
            address (Tuple[str, int]): Tuple containing the server IP address and port.

        Returns:
        --------
            Union[bool, bytes]: The query response in bytes or False if an error occurs.
        """
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
        """
        Cleans the query response by removing the first 8 bytes.

        Args:
        -----
            query (bytes): The query response.

        Returns:
        --------
            bytes: The cleaned query response.
        """
        if len(query) < 8:
            raise ValueError("Invalid Query")
        return query[8:]
