# Security

## ⚠️ IMPORTANT: Pre-Production Checklist

The following credentials are hardcoded in `settings.py` and must be moved to environment variables before production:

| Credential | Location | Action |
|------------|----------|--------|
| `SECRET_KEY` | `settings.py:28` | Move to env var |
| `DISCORD_CLIENT_ID` | `settings.py:126` | Move to env var |
| `DISCORD_CLIENT_SECRET` | `settings.py:127` | Move to env var |
| `GOOGLE_CLIENT_ID` | `settings.py:130` | Move to env var |
| `GOOGLE_CLIENT_SECRET` | `settings.py:131` | Move to env var |
| `RECAPTCHA_PUBLIC_KEY` | `settings.py:449` | Move to env var |
| `RECAPTCHA_PRIVATE_KEY` | `settings.py:450` | Move to env var |
| `TEBEX_SECRET_KEY` | `settings.py:462` | Move to env var |
| `DETECTIONS_WEBHOOK_URL` | `settings.py:360-362` | Move to env var |

## Encryption

### WebSocket Protocol

- **Algorithm:** AES-256-CBC
- **Key storage:** Binary files in `bin/debug/aes_keys/` and `bin/production/aes_keys/`
- **Key selection:** Random index per packet (0-7), prepended as `chr(index + 31)`
- **Padding:** PKCS7

### REST API

- **Authentication:** JWT (RS256/HS256) via `rest_framework_simplejwt`
- **Token lifetime:** 1 day (access), 7 days (refresh)

## Network Security

### Anti-Replay

- All packets include Unix timestamp (`ut` field)
- Packets with timestamp difference > 120 seconds are rejected
- IP binding for server subscriptions

### Webhook Validation

- Tebex webhooks validate IP against known Tebex IPs
- Webhook User-Agent validation available (disabled for production flexibility)

## Database

- MySQL with utf8mb4 charset
- Connection health checks enabled
- Session engine uses database backend
- CSRF cookie: Secure + HttpOnly in production
- Session cookie: Secure + HttpOnly + SameSite=None in production

## HSTS (Production)

```python
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
```
