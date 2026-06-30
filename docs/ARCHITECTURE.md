# Architecture

## System Design

AtomicShield Server follows a **modular Django monolith** architecture with the following high-level components:

### Component Diagram

```
                     ┌─────────────────────┐
                     │    Internet / Game   │
                     │      Clients         │
                     └──────────┬──────────┘
                                │
                    ┌───────────┴───────────┐
                    │   Daphne ASGI Server  │
                    │  (HTTP + WebSocket)   │
                    └───────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                  │
       ┌──────┴──────┐  ┌──────┴──────┐   ┌──────┴──────┐
       │  HTTP/HTTPS │  │  WebSocket  │   │  WebSocket  │
       │  (Django)   │  │  FxServer   │   │   Agent     │
       └──────┬──────┘  └──────┬──────┘   └──────┬──────┘
              │                │                  │
       ┌──────┴────────────────┴──────────────────┴──┐
       │              Django ORM / MySQL              │
       └─────────────────────────────────────────────┘
```

### Request Flow

1. **Game Server (FxServer)** connects via WebSocket to `/c/atomicshieldserver/`
2. **Agent (Client Engine)** connects via WebSocket to `/c/atomicshieldagent/`
3. Both use **AES-256-CBC encrypted** protocol via `AtomicCore`
4. Server authenticates via subscription key, Agent via HWID fingerprint
5. Player join requests are validated by checking Agent connectivity
6. Cheat detections flow: Agent → Server → Ban + Discord notification
7. **React SPA** communicates via REST API (JWT authenticated)

### Subdomain Routing (django-hosts)

| Host | Handler |
|------|---------|
| `store.*` | Redirects to Tebex store |
| `www.*` | Main Django URL patterns |
