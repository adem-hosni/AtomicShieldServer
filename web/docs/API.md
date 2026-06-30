# API Reference

Base URL: `/api` (development) or `/api` (production)

All responses follow the `ApiResponse<T>` envelope:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

---

## Authentication

### POST /api/auth/signin

Authenticate with email and password.

**Request Body:**

```json
{
  "email": "admin@atomicshield.com",
  "password": "admin123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "admin@atomicshield.com",
      "name": "Admin User",
      "isVerified": true,
      "provider": "email",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbG...",
    "expiresIn": "24h"
  }
}
```

**Validation:** Zod schema — email must be valid format, password min 6 characters.

---

### POST /api/auth/signup

Create a new account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "name": "New User"
}
```

**Response (201):** Same structure as sign-in.

**Validation:** Zod schema with password confirmation match check.

---

### GET /api/auth/social/:provider

Social authentication (Discord or Google).

**Parameters:**

- `provider` — `"discord"` or `"google"`
- Query: `code`, `state`

**Response (200):** Same structure as sign-in. Mock implementation currently.

---

### POST /api/auth/forgot-password

Request a password reset email.

**Request Body:**

```json
{ "email": "user@example.com" }
```

**Response (200):** Always returns success (security — doesn't reveal if email exists).

---

### POST /api/auth/reset-password

Reset password with a token.

**Request Body:**

```json
{ "token": "reset-1-1234567890", "newPassword": "newpass123" }
```

**Response (200):**

```json
{ "success": true, "message": "Password reset successfully" }
```

---

### GET /api/auth/profile

Get current user profile. Requires `Authorization: Bearer <token>` header.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "admin@atomicshield.com",
      "name": "Admin User"
    }
  }
}
```

---

## OAuth

### Google OAuth

| Endpoint                        | Description                                      |
| ------------------------------- | ------------------------------------------------ |
| `GET /api/auth/google/login`    | Initiate Google OAuth flow, returns redirect URL |
| `GET /api/auth/google/callback` | Handle OAuth callback (also accepts POST)        |
| `GET /api/auth/google/user`     | Get authenticated Google user info               |

### Discord OAuth

| Endpoint                         | Description                         |
| -------------------------------- | ----------------------------------- |
| `GET /api/auth/discord/login`    | Initiate Discord OAuth flow         |
| `GET /api/auth/discord/callback` | Handle Discord OAuth callback       |
| `GET /api/auth/discord/user`     | Get authenticated Discord user info |

---

## Dashboard

### GET /api/dashboard/

Requires authentication (`authenticateToken` middleware).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "stats": {
      "systemStatus": { "value": 100, "badge": { "text": "All Systems Operational", "variant": "default" } },
      "totalServers": { "value": 2, "subtitle": "2 online, 0 maintenance", "trend": { "value": "+1 this week", "isPositive": true } },
      "networkPlayers": { "value": 245, "subtitle": "Across all servers", "trend": { "value": "+12 today", "isPositive": true } },
      "threatLevel": { "value": 5, "subtitle": "Active threats detected", "badge": { "text": "MODERATE", "variant": "secondary" } }
    },
    "servers": [{ "id": "server-2", "name": "Development Server", "status": "TESTING", "playerCount": 89, ... }],
    "recentActivity": [{ "action": "Player Banned", "user": "xX_ProGamer_Xx", "time": "5m ago", "severity": "critical" }],
    "threatAssessment": { "detectionRate": "99.2%", "falsePositives": "0.05%", "responseTime": "12ms" },
    "threatActivity": [{ "time": "14:00", "threatDetections": 18, "falsePositives": 1, "blockedAttempts": 21, "severity": "high" }],
    "globalStats": { "totalBans24h": 52, "kicks24h": 134, "warnings24h": 298, "cleanSessions": 14200 },
    "subscriptions": [{ "id": "premium-001", "name": "AtomicShield Premium", "plan": "Pro Shield", "status": "active", ... }],
    "serverTypes": [{ "id": "fivem", "name": "FiveM Server", "description": "GTA V multiplayer modification" }]
  }
}
```

---

## Players

### GET /api/players

Get list of players with pagination, search, and sorting.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 25 | Items per page |
| `search` | string | "" | Search by name, Steam ID, Discord ID, or IP |
| `sortBy` | string | "name" | Sort field |
| `sortOrder` | "asc"\|"desc" | "asc" | Sort direction |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "players": [{ "id": "1", "serverId": 1, "name": "John_Doe", "steamId": "steam:110000103fa6c42", "ping": 45, "isOnline": true, ... }],
    "totalCount": 50,
    "onlineCount": 35,
    "peakPlayers": 68,
    "newPlayers": 5,
    "actionsTaken": { "Player Banned": 2, "Player Kicked": 7, "Warning Issued": 4, "Cheat Detected": 3 }
  }
}
```

### POST /api/players/kick

Kick a player.

**Request Body:**

```json
{ "playerId": "1", "reason": "Toxic behavior" }
```

### POST /api/players/ban

Ban a player.

**Request Body:**

```json
{ "playerId": "1", "reason": "Speed hacking", "duration": "7d" }
```

### POST /api/players/screenshot/:playerId

Take a screenshot of a player's game.

**Response:**

```json
{
  "success": true,
  "data": { "url": "https://picsum.photos/1920/1080?random=1" }
}
```

### GET /api/players/stats

Get player activity statistics (24-hour time series).

**Response:**

```json
{
  "success": true,
  "data": [
    { "time": "00:00", "players": 18 },
    { "time": "02:00", "players": 15 }
  ]
}
```

---

## Bans

### GET /api/bans

Get list of bans with pagination, search, filtering, and sorting.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 25 | Items per page |
| `search` | string | "" | Search by player name, Steam ID, reason, or admin |
| `filter` | "all"\|"active"\|"expired"\|"permanent"\|"temporary" | "all" | Ban status filter |
| `sortBy` | string | "bannedAt" | Sort field |
| `sortOrder` | "asc"\|"desc" | "desc" | Sort direction |

### POST /api/bans/create

Create a new ban.

**Request Body:**

```json
{
  "steamId": "steam:110000103fa6c42",
  "playerName": "John_Doe",
  "reason": "Speed hacks",
  "adminName": "Admin_Mike"
}
```

### PUT /api/bans/update/:banId

Update an existing ban.

### DELETE /api/bans/delete/:banId

Delete a ban.

---

## Servers

### GET /api/servers

Get list of servers.

### POST /api/servers/add

Add a new server.

**Request Body:**

```json
{
  "serverName": "My FiveM Server",
  "serverIp": "192.168.1.100",
  "subscriptionId": "premium-001",
  "serverType": "fivem",
  "serverImage": "base64_or_url"
}
```

### DELETE /api/servers/:serverId

Delete a server.

### GET /api/server/:serverId

Get server dashboard data (requires auth).

### GET /api/server/:serverId/bans

Get server-specific bans (requires auth).

### GET /api/server/:serverId/configurations

Get server configurations (requires auth).

---

## Configuration

### GET /api/server/:serverId/configuration

Get full anti-cheat configuration for a server (requires auth).

**Response:** Nested structure with categories → sections → configurations, plus registry metadata, total config count, schema version.

### PUT /api/server/:serverId/configuration

Update configuration values (requires auth).

**Request Body:**

```json
{
  "values": {
    "enable_shield": true,
    "protection_level": "high",
    "scan_frequency": 15
  },
  "metadata": {}
}
```

### GET /api/server/:serverId/configuration/history

Get configuration change history (requires auth).

---

## General

### GET /api/ping

Health check.

**Response:** `{ "message": "Hello from Express server v2!" }`

### GET /api/demo

Demo endpoint.

---

## Placeholder Endpoints

These endpoints return empty/skeleton responses marked "to be implemented":

| Endpoint                    | Expected Full Implementation                |
| --------------------------- | ------------------------------------------- |
| `GET /api/audit-logs`       | Audit log entries with filtering and search |
| `GET /api/moderators`       | Moderator list with permissions             |
| `GET /api/news`             | News posts with categories and pagination   |
| `GET /api/changelogs`       | Changelog entries with version tracking     |
| `GET /api/analytics/stats`  | Server statistics                           |
| `GET /api/analytics/charts` | Chart data points                           |
