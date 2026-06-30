# Guard Managers

## Overview

Guard managers are singleton classes that track all active WebSocket connections for game servers and client engines. They provide centralized lookup and management.

## Guard Base (`guards/_base.py`)

`_GuardManagerBase` provides the foundation with these capabilities:

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `engines` | `List[SafeEngineConsumer]` | All connected client engines |
| `servers` | `List[SafeServerConsumer]` | All connected game servers |
| `total_engines` | int | Count of connected engines |
| `total_servers` | int | Count of connected servers |

### Methods

| Method | Description |
|--------|-------------|
| `add_safe_server(server)` | Register a game server connection |
| `remove_safe_server(server)` | Unregister a game server connection |
| `add_engine(scanner)` | Register a client engine connection |
| `remove_safe_scanner(scanner)` | Unregister a client engine connection |
| `is_server_running(ip)` | Check if server is connected by IP |
| `is_engine_connected(ip)` | Check if engine is connected by IP |
| `is_engine_connected_by_hwid(hwid)` | Check engine by HWID |
| `get_scanner_by_ip(ip)` | Find engine by IP address |
| `get_scanner_by_hwid(hwid)` | Find engine by HWID |
| `get_engine_by_24subnet(ip)` | Find engine by /24 subnet match |
| `get_server_by_ip(ip)` | Find server by IP address |

## FiveM Guard

```python
from guards import fivem_guard

# Singleton instance
fivem_guard = FivemGuardManager()
```

Used by: `anticheat/handlers/safe_server.py`, `anticheat/handlers/safe_engine.py`, `anticheat/admin.py`, `dashboard/views.py`

## MTA:SA Guard

```python
from guards import mta_guard

# Singleton instance (reserved for future Multi Theft Auto support)
mta_guard = MultiTheftAutoGuardManager()
```

Currently available for future MTA:SA integration but not yet used in active handlers.
