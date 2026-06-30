# Utilities

## `utils/__init__.py`

### `generate_key(parts=4) -> str`
Generates random license keys (e.g., `A1B2C-D3E4F-G5H6I-J7K8L`).

### `check_request_body_key(body, key, key_type) -> bool`
Validates presence and type of a key in a request dictionary.

### `represent_timedelta_string(timedelta) -> str`
Converts `timedelta` to human-readable string (e.g., "30 days 12h 30mn").

### `isvalid_ip(ip) -> bool`
Validates IPv4 address format.

### `caesar_encrypt(plaintext, shift) -> str`
Simple Caesar cipher for signature obfuscation (shift=3).

### `format_string(string, vars) -> str`
Template variable substitution with `{variable_name}` syntax.

### `validate_tebex_request(request) -> bool`
Validates incoming Tebex webhook requests by checking source IP.

### `is_same_subnet_24(ip1, ip2) -> bool`
Checks if two IPs share the same /24 subnet.

### `decode_if_base64(s) -> str`
Decodes a string if it appears to be base64-encoded.

## `utils/discord.py`

### `send_discord_embed()`
Sends rich Discord embeds via webhooks with:
- Custom title, description, fields
- Author name/icon
- Footer text/icon
- Attached image files
- Custom bot name/avatar

## `utils/notifications.py`

### `notify_server(notification_type, server, **extra)`
Sends server-specific Discord notifications for:
- `BAN` — Ban notification with evidence
- `UNBAN` — Unban notification
- `KICK` — Kick notification
- `SCREENSHOT` — Screenshot capture notification

### `build_embed(embed_data, format_data) -> Embed`
Builds a formatted Discord embed from server-configurable templates.

## `utils/aseclient.py`

ASE (All-Seeing Eye) protocol query client for MTA:SA server discovery.

### Classes

#### `ASEQueryClient`
UDP socket client for querying MTA:SA game servers.

#### `ASEParser`
Parses ASE protocol responses into structured data.

#### `ASEQueryLightData`
Dataclass containing: server_name, game_type, map_name, build info, uptime, player counts, etc.

## `utils/analytics.py`

### `get_30_day_chart_data(game_server)`
Generates time-series chart data for the dashboard with:
- Hourly buckets for today
- Daily buckets for 7 days
- Daily buckets for 30 days
- Active player counts and active ban counts per bucket

### `get_peak_players_today(game_server)`
Calculates peak concurrent players for today.

### `get_new_joins_today(game_server)`
Counts unique player joins today.

### `get_actions_taken_today(game_server)`
Returns action counts grouped by AuditLogEntry action type.
