# WebSocket Protocol

## Connection Endpoints

| Path | Purpose |
|------|---------|
| `/c/atomicshieldserver/` | Game server (FxServer) connection |
| `/c/atomicshieldagent/` | Client agent (Engine) connection |
| `/ws/live/<room_id>/` | WebRTC signaling for live streaming |

## Encryption

All WebSocket data is encrypted using **AES-256-CBC** via the `AtomicCore` class.

### Encryption Flow

1. Server selects a random key index from 8 available key pairs
2. Prepends the key index byte (`chr(index + 31)`) to ciphertext
3. Base64 encodes the result for transmission
4. Receiver strips the index byte, selects the corresponding key/IV, decrypts

```
Raw Data → JSON → AES-256-CBC → Key Index Prefix → Base64 → Send
```

## Server Protocol (SafeServerPacketID)

### Network Join (1)

**Request:**
```json
{
  "type": 1,
  "server_key": "XXXXX-XXXXX-XXXXX-XXXXX",
  "server_type": 2
}
```

**Response (success):**
```json
{
  "type": 1,
  "success": true,
  "message": "SUCCESS"
}
```

### Player Join (4)

**Request:**
```json
{
  "type": 4,
  "ip": "1.2.3.4",
  "name": "PlayerName",
  "steam": "steam:...",
  "license": "license:...",
  "token": ["token1", "token2"],
  "discord": "discord_id"
}
```

**Response:**
```json
{
  "type": 4,
  "ip": "1.2.3.4",
  "join": true/false,
  "message": "reason if rejected"
}
```

### Player Kick (5)

**Server → FxServer:**
```json
{
  "type": 5,
  "ip": "1.2.3.4",
  "discordid": "...",
  "steamid": "...",
  "reason": "Cheating detected"
}
```

### Engine Check (10)

**Request:**
```json
{
  "type": 10,
  "players": ["1.2.3.4", "5.6.7.8"]
}
```

**Response:**
```json
{
  "type": 10,
  "inactive_players": ["5.6.7.8"]
}
```

## Engine Protocol (SafeEnginePacketID)

### Network Join (1)

**Request:**
```json
{
  "type": 1,
  "hwid": {
    "username": "PlayerName",
    "computer_name": "DESKTOP-ABC",
    "cpu": "CPUID_STRING",
    "motherboard_serial": "SERIAL",
    "bios": "BIOS_VERSION",
    "disks": ["DISK_SERIAL1", "DISK_SERIAL2"],
    "pnp_device": "PCI\\VEN_...",
    "extra": {}
  },
  "engine_type": 2,
  "build_timestamp": "2024-01-01_12-00-00",
  "ip": "1.2.3.4"
}
```

### Cheat Detection (7)

**Request:**
```json
{
  "type": 7,
  "detection_type": 8,
  "report": { "string": "cheat_signature", ... },
  "ss": "base64_encoded_screenshot"
}
```

### Request File Hash (12)

**Request:**
```json
{
  "type": 12,
  "filehash": "sha256_hash",
  "filepath": "C:\\path\\to\\file.dll"
}
```

## WebRTC Signaling

The `/ws/live/<room_id>/` endpoint implements a WebRTC signaling relay for live game streaming to the dashboard.

### Message Types

| Action | Description |
|--------|-------------|
| `offer` | WebRTC SDP offer |
| `answer` | WebRTC SDP answer |
| `candidate` | ICE candidate |

Messages are relayed to all other clients in the same room.
