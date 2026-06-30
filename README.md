# ⚛️ AtomicShield Server

> **Advanced Game AntiCheat Master Server** — The backend powering the AtomicShield anti-cheat ecosystem.
>
> 💰 **Note: This project has been sold.**

[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.0%2B-092E20?logo=django)](https://djangoproject.com)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)
[![Client Repo](https://img.shields.io/badge/Client-AtomicShieldClient-181717?logo=github)](https://github.com/adem-hosni/AtomicShieldClient)

---

## 📋 Overview

AtomicShield Server is the **central command hub** for the AtomicShield anti-cheat platform. It manages real-time WebSocket connections with game servers and client-side agents, processes cheat detections, issues bans, handles HWID fingerprinting, and provides a full-featured **Django Admin** dashboard plus a **React SPA** frontend for server owners.

**Key capabilities:**
- 🛡️ **Real-time cheat detection** via encrypted WebSocket communication
- 🔐 **Hardware ID (HWID) fingerprinting** with historical tracking
- ⚡ **Low-latency AES-encrypted packet protocol** between server ↔ agent
- 📊 **Full admin dashboard** (Django Unfold + React SPA)
- 💳 **Subscription & payment system**
- 👥 **Moderator role management** with granular permissions
- 📝 **Comprehensive audit logging** for all actions
- 🔔 **Discord webhook notifications** for detections, bans, and alerts
- 📦 **Release management & asset distribution**
- 🖥️ **Live screen streaming** via WebRTC signaling

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   AtomicShield Server               │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Django  │  │  Django  │  │  WebSocket        │  │
│  │  REST API│  │  Admin   │  │  (Channels/Daphne)│  │
│  │  (JWT)   │  │ (Unfold) │  │                   │  │
│  └──────────┘  └──────────┘  └────────┬──────────┘  │
│       │              │                │             │
│  ┌────┴──────────────┴────────────────┴──────────┐  │
│  │              MySQL Database                   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │   Guards     │  │     Core     │                 │
│  │              │  │  (AES Crypto)│                 │
│  └──────────────┘  └──────────────┘                 │
│                                                     │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│   │ Utils    │  │ Shared   │  │Analytics │          │
│   │(Discord, │  │(Enums,   │  │(Charts,  │          │
│   │ ASE, etc)│  │ Flags)   │  │ Stats)   │          │
│   └──────────┘  └──────────┘  └──────────┘          │
└───────────────────────────────┬─────────────────────┘
                                │
        ┌───────────────────────┼─────────────────────┐
        │                       │                     │
  ┌─────┴─────────┐       ┌─────┴──────┐       ┌──────┴──────┐
  │  Game Server  │       │   Agent    │       │  React SPA  │
  │ (Resource)    │       │  (Engine)  │       │  (Frontend) │
  │  WS Client    │       │  WS Client │       │  HTTP/JWT   │
  └───────────────┘       └────────────┘       └─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- MySQL 8+
- Node.js 18+ (for frontend)

### Installation

```bash
# Clone the repository (with submodules)
git clone --recurse-submodules https://github.com/adem-hosni/AtomicShieldServer.git
cd AtomicShieldServer

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install Python dependencies
pip install -r requirements.txt

# Configure database (MySQL)
mysql -u root -e "CREATE DATABASE atomicshield CHARACTER SET utf8mb4;"

# Run migrations
python src/manage.py migrate

# Generate AES encryption keys
python scripts/generate_keys.py --target debug/aes_keys --count 8 --key_size 16

# Start development server
python src/manage.py runserver
```

### Frontend (React SPA)

```bash
cd web
npm install
npm run dev
```

---

## 🧩 Project Structure

```
AtomicShieldServer/
├── src/                        # Python backend
│   ├── AtomicShield/           # Django project configuration
│   │   ├── settings.py         # Main settings (DB, apps, channels, etc.)
│   │   ├── urls.py             # Root URL routing
│   │   ├── asgi.py             # ASGI config (WebSocket + HTTP)
│   │   ├── middleware.py       # Custom middleware
│   │   ├── hosts.py            # Django-hosts subdomain routing
│   │   └── sitemaps.py         # SEO sitemaps
│   ├── anticheat/              # Core anti-cheat app
│   │   ├── consumers/          # WebSocket consumers
│   │   │   ├── safe_server.py  # FxServer WS consumer
│   │   │   ├── safe_engine.py  # Agent/Engine WS consumer
│   │   │   └── streamer.py     # WebRTC signaling consumer
│   │   ├── handlers/           # Packet handlers
│   │   │   ├── safe_server.py  # Server packet logic
│   │   │   └── safe_engine.py  # Engine packet logic
│   │   ├── models.py           # DB models (HWID, Ban, Detection, etc.)
│   │   ├── admin.py            # Django admin interfaces
│   │   └── routing.py          # WebSocket URL routing
│   ├── dashboard/              # Dashboard & management app
│   │   ├── models.py           # GameServer, Subscription, AuditLog, etc.
│   │   ├── views.py            # REST API + Jinja views (~3000 lines)
│   │   └── admin.py            # Admin interfaces for dashboard models
│   ├── authentication/         # Auth app (JWT, Discord OAuth, Google OAuth)
│   ├── api/                    # Payment/Tebex webhook API
│   ├── home/                   # Landing page views
│   ├── resources/              # Engine binary distribution
│   ├── guards/                 # Connection managers
│   │   ├── _base.py            # Base guard manager
│   │   ├── fivem.py            # FiveM guard (singleton)
│   │   └── multitheftauto.py   # MTA:SA guard (singleton)
│   ├── core/                   # Core AES crypto engine
│   ├── shared/                 # Shared enums, flags, models
│   └── utils/                  # Utilities (Discord, ASE, analytics)
├── web/                        # React SPA frontend
│   ├── client/                 # React app source
│   ├── server/                 # Express mock server (deprecated)
│   └── shared/                 # Shared TS types
├── config/                     # Server configuration
├── scripts/                    # Utility scripts
├── tests/                      # Load testing (Locust)
└── bin/                        # Binary resources (AES keys, engines)
```

---

## 🔌 WebSocket Protocol

The server communicates with game servers and agents via **AES-256-CBC encrypted** WebSocket packets.

### Packet Structure

```json
{
  "type": "<PacketID>",
  "ut": <unix_timestamp>,
  "...": "<payload>"
}
```

### Server Packet IDs (SafeServerPacketID)

| ID | Name | Description |
|----|------|-------------|
| 1 | `NETWORK_JOIN` | Server authentication & join |
| 2 | `SYNC_ANTICHEAT_CONFIGS` | Sync configuration templates |
| 3 | `REQUEST_STATUS` | Server health check |
| 4 | `REQUEST_PLAYER_JOIN` | Player connection validation |
| 5 | `PLAYER_KICK` | Kick a player |
| 6 | `OBFUSCATE_CLIENT_SCRIPT` | Script obfuscation |
| 7 | `SYNC_ANTICHEAT_COMPONENTS` | Component sync |
| 8 | `PLAYER_QUIT` | Player disconnect |
| 9 | `MANAGE_ONLINE_PLAYER` | Online player management |
| 10 | `ENGINE_CHECK` | Engine connectivity check |

### Engine Packet IDs (SafeEnginePacketID)

| ID | Name | Description |
|----|------|-------------|
| 1 | `NETWORK_JOIN` | Agent authentication & HWID registration |
| 2 | `SYNC_SIGNATURES` | Malicious signature sync |
| 3 | `MALICIOUS_SIGNATURE_DETECTION` | Signature match found |
| 4 | `GAME_ANTICHEAT_COMPONENT_STATUS` | Component health |
| 5 | `SCANNER_DISCONNECT` | Agent disconnect |
| 6 | `REQUEST_UPLOAD` | File upload request |
| 7 | `CHEAT_DETECTION` | Cheat detection report |
| 8 | `REQUEST_SCREENSHOT` | Screenshot capture |
| 9 | `RUN_SCANNERS` | Toggle scanner state |
| 10 | `ENGINE_SHUTDOWN` | Engine shutdown command |
| 11 | `REQUEST_DEBUG_LOGS` | Debug log retrieval |
| 12 | `REQUEST_FILEHASH` | File hash lookup |
| 13 | `REQUEST_FILE_UPLOAD` | File upload request |

---

## 🛡️ Detection System

### Detection Types

| Value | Type | Severity |
|-------|------|----------|
| 0 | Custom | Strict |
| 1 | Unauthorized Thread | Strict |
| 2 | Unrecognized IAT | Strict |
| 3 | Direct X DLL Found | Unstrict |
| 4 | Secure Boot Disabled | Unstrict |
| 5 | Debug Mode Enabled | Unstrict |
| 6 | Test Signing Enabled | Unstrict |
| 7 | Injected DLL | Strict |
| 8 | Cheat Signature Found | Strict |
| 9 | Malicious Process Handle Open | Strict |
| 10 | Malicious Driver Found | Unstrict |
| 11 | Thread Shell Code | Strict |

**Strict** detections result in an automatic ban. **Unstrict** detections are checked against server configuration before action is taken.

---

## 🔐 Security

- **AES-256-CBC encryption** for all WebSocket communication
- **Random key selection** from 8 key pairs for each packet
- **Timestamp-based anti-replay** protection
- **JWT authentication** for REST API
- **CORS protection** with configurable origins
- **reCAPTCHA** integration for public forms
- **IP validation** for server subscriptions
- **Comprehensive audit logging** for all sensitive actions

---

## 📦 Related Repositories

The AtomicShield ecosystem consists of several repositories:

| Repository | Description |
|------------|-------------|
| [![AtomicShield Server](https://img.shields.io/badge/AtomicShield_Server-181717?logo=github)](https://github.com/AtomicShieldServer) | Backend API and WebSocket server (this repo) |
| [![AtomicShield Platform](https://img.shields.io/badge/AtomicShield_Platform-181717?logo=github)](https://github.com/atomicshield-platform) | Management dashboard UI |
| [![AtomicShieldClient](https://img.shields.io/badge/AtomicShieldClient-181717?logo=github)](https://github.com/adem-hosni/AtomicShieldClient) | Client-side anti-cheat engine agent |

### AtomicShieldClient

The AtomicShield Agent (game client-side component) is maintained in a separate repository and contains:
- **AtomicShield Agent** — The client-side anti-cheat engine that connects to this server
- **Game integration libraries** for FiveM and other platforms
- **Client-side detection scanners**

---

## 🤝 Contributing

Internal project. Contributions are managed by the AtomicShield team.

---

## 📬 Contact

- **Email:** hosniadem400@gmail.com & aifaouiameen@gmail.com

---

## 📄 License

Proprietary. All rights reserved.

---

## Related Repositories

- [AtomicShield Client](https://github.com/adem-hosni/AtomicShieldServer) — Backend API and WebSocket server
- [AtomicShield Platform](https://github.com/adem-hosni/atomicshield-platform) — Management dashboard UI
