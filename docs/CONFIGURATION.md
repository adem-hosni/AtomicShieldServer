# Configuration

## Django Settings

Located in `src/AtomicShield/settings.py`.

### Database

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "atomicshield",
        "USER": "root",
        "PASSWORD": "",
        "HOST": "localhost",
        "OPTIONS": {"charset": "utf8mb4"},
    }
}
```

### Channel Layers (WebSocket)

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}
```

For production, use Redis:

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {"hosts": [("127.0.0.1", 6379)]},
    },
}
```

### JWT Authentication

```python
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
}
```

### reCAPTCHA

```python
RECAPTCHA_PUBLIC_KEY = "..."
RECAPTCHA_PRIVATE_KEY = "..."
RECAPTCHA_REQUIRED_SCORE = 0.6
```

### Discord Webhooks

```python
DETECTIONS_WEBHOOK_URL = "https://discord.com/api/webhooks/..."
DISCORD_INVITE = "https://discord.gg/YFCRffsZKK"
```

### AntiCheat Config IDs

See `src/anticheat/config_ids.py`:

| ID | Name | Description |
|----|------|-------------|
| 10 | `ALLOW_SEND_DETECTION_ALERT` | Enable detection alerts |
| 11 | `DISCORD_WEBHOOK_URL` | Discord webhook for alerts |
| 12 | `FORCE_SECUREBOOT` | Require Secure Boot |
| 13 | `FORCE_TESTSIGNING` | Require Test Signing disabled |
| 14 | `ALLOWED_FIVEM_PLUGINS` | Allowed plugin list |
| 15 | `ALLOW_PROCESS_HACKER` | Allow Process Hacker |
| 18 | `DISCORD_EMBED_TITLE` | Custom embed title |
| 19 | `ALLOW_SEND_SCREENSHOT_ALERT` | Screenshot alerts |
| 28 | `AGENT_NOT_DETECTED_MSG` | Agent missing message |
| 20 | `NETWORK_CORRUPTED` | Network error message |

## Subscription Plans

| Plan | Duration | Value |
|------|----------|-------|
| FREE | 3 days | 3 |
| BASIC | 30 days | 1 |
| PRO | 90 days | 2 |
| ENTREPRISE | 9999 days | 4 |
| LIFETIME | 9999 days | 5 |
