# API Reference

## Authentication

All dashboard API endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Sign In

```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "success": true,
  "data": {
    "token": "jwt_token_string",
    "user": { "id": 1, "name": "username", "email": "..." }
  }
}
```

### Sign Up

```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "username"
}
```

### Discord OAuth

```
GET /api/auth/discord/login?returnUrl=/dashboard
GET /api/auth/discord/callback?code=...
```

### Google OAuth

```
GET /api/auth/google/login
GET /api/auth/google/callback?code=...
```

## Dashboard API

### Overview

```
GET /api/dashboard/
Authorization: Bearer <token>
```

Returns system stats, servers, threat assessment, recent activity, subscriptions.

### Servers

```
GET  /api/servers/                           # List user's servers
POST /api/servers/add                        # Add new server
POST /api/servers/select/                    # Select active server
```

### Server Dashboard

```
GET /api/server/<id>                         # Server info, stats, chart data
```

### Bans

```
GET  /api/server/<id>/bans                   # List bans for server
POST /api/server/<id>/bans/unban             # Unban player
POST /api/server/<id>/bans/ban               # Ban player
POST /api/server/<id>/bans/<ban_id>/report-false-positive  # Report false positive
```

### Configurations

```
GET  /api/server/<id>/configurations         # Get all configs
POST /api/server/<id>/configurations/save    # Save configs
```

### Moderators

```
GET   /api/server/<id>/moderators            # List moderators
PUT   /api/server/<id>/moderators/<mid>/update    # Update permissions
POST  /api/server/<id>/moderators/<mid>/action    # Suspend/reactivate/remove
POST  /api/server/<id>/moderators/add        # Invite moderator
GET   /api/moderators?search=term            # Search for users
POST  /api/moderation/invite?token=...       # Get invite details
POST  /api/moderation/invite/mark?token=...  # Accept/decline invite
```

### Audit Logs

```
GET /api/server/<id>/audit-logs              # List audit log entries
```

### Players

```
GET /api/server/<id>/players                 # List active players
```

### Webhook Test

```
POST /api/webhook/test                       # Test Discord webhook
```

### Patch Notes

```
GET  /api/patch-notes/                       # List changelogs
POST /api/patch-notes/                       # Mark as seen
```

### Assets / Releases

```
GET  /api/download-assets/                   # List releases & assets
POST /api/download-assets/                   # Download release asset
```

### Subscriptions

```
GET  /api/subscriptions/                     # List user subscriptions
POST /api/subscriptions/                     # Redeem key or trial
```

## AntiCheat Endpoints

### Status

```
POST /anticheat/status/agent          # Agent health check
POST /anticheat/status/isconnected    # Check if engine connected
POST /anticheat/status/server         # Server health check
POST /anticheat/status/version        # Version validation
```

### Engine

```
POST /anticheat/engine/interaction    # Engine interaction (screenshots, etc.)
POST /anticheat/crash-report          # Upload crash report
```

## Payment Webhook (Tebex)

```
POST /api/payment/completed           # Tebex payment webhook
```
