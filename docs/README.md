# Documentation Map

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design — component diagram, request flow, subdomain routing |
| [CORE_ENGINE.md](CORE_ENGINE.md) | AtomicCore encryption — AES-CBC encode/decode, key generation, C++ export |
| [WEBSOCKET.md](WEBSOCKET.md) | WebSocket protocol — connection endpoints, encryption flow, packet types (server & engine) |
| [API.md](API.md) | REST API reference — authentication, dashboard, bans, moderators, anticheat endpoints |
| [MODELS.md](MODELS.md) | Data models — HWID, DetectionReport, Ban, GameServer, Subscription, AuditLog, Payment |
| [GUARDS.md](GUARDS.md) | Guard managers — singleton connection trackers for FiveM and MTA:SA |
| [CONFIGURATION.md](CONFIGURATION.md) | Configuration — database, JWT, reCAPTCHA, Discord webhooks, anticheat config IDs, subscription plans |
| [SECURITY.md](SECURITY.md) | Security — pre-production checklist, encryption, anti-replay, webhook validation, HSTS |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment — production setup, environment variables, Gunicorn/Daphne, Nginx, Supervisor |
| [UTILS.md](UTILS.md) | Utilities — key generation, Discord embeds, notifications, ASE client, analytics |
| [SCRIPTS.md](SCRIPTS.md) | Scripts — AES key generation, C++ array dump, migration/runserver batch files |
| [TESTING.md](TESTING.md) | Testing — Locust load testing, manual WebSocket/API/payment tests |
