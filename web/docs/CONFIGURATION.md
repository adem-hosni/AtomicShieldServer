# Anti-Cheat Configuration System

## Overview

The configuration system allows server administrators to fine-tune AtomicShield's anti-cheat behavior through a dynamic, category-based interface. It uses a **registry pattern**: all configurations are defined in a flat registry and then organized into a nested category/section structure for the UI.

## Architecture

```
Server (registry-based generation)
  ├── createConfigurationRegistry() — Flat config definitions
  ├── buildNestedStructure() — Organizes into categories → sections
  └── generateDynamicConfigurationData() — Server-specific overrides

Client (state management)
  └── useConfigurationManager() — Tracks changes, computes diffs
      ├── updateConfigurationValue(categoryId, sectionId, configId, value)
      ├── getChangedValues() → { static?, dynamic? }
      └── resetChanges()
```

## Server Route Files

| File                             | Purpose                                                          |
| -------------------------------- | ---------------------------------------------------------------- |
| `server/routes/configuration.ts` | Main configuration route handler (769 lines)                     |
| `server/routes/servers.ts`       | Contains `getServerConfigurations` (alternative config endpoint) |

### Configuration Route Endpoints

| Endpoint                                          | Auth | Description                                                     |
| ------------------------------------------------- | ---- | --------------------------------------------------------------- |
| `GET /api/server/:serverId/configuration`         | JWT  | Full configuration with categories, sections, registry metadata |
| `PUT /api/server/:serverId/configuration`         | JWT  | Update configuration values                                     |
| `GET /api/server/:serverId/configuration/history` | JWT  | Configuration change history                                    |

### Servers Route Configuration Endpoint

| Endpoint                                   | Auth | Description                                          |
| ------------------------------------------ | ---- | ---------------------------------------------------- |
| `GET /api/server/:serverId/configurations` | JWT  | Alternative config endpoint with different structure |

## Configuration Categories

There are **5 categories**, each with multiple sections:

### 1. General Settings (`general_settings`)

| Section         | Configurations                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **General**     | Enable Shield (toggle), Protection Level (dropdown: low/medium/high/maximum), Server Name (text), Max Players (number) |
| **Performance** | Performance Mode (toggle), Scan Frequency in seconds (number, default 30), Memory Limit in MB (number, default 512)    |

### 2. Detection Settings (`detection_settings`)

| Section                  | Configurations                                                                                                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Detection Algorithms** | Aimbot Detection (toggle), Wallhack Detection (toggle), Speed Hack Detection (toggle), Detection Sensitivity (number 1-100), Detection Mode (dropdown: lenient/balanced/strict/paranoid) |
| **Advanced Detection**   | Behavioral Analysis (toggle), Network Analysis (toggle), Statistical Analysis (toggle)                                                                                                   |

### 3. Punishment Settings (`punishment_settings`)

| Section                      | Configurations                                                                                                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Punishment Actions**       | Automatic Ban (toggle), Ban Duration in hours (number, 0=permanent), Automatic Kick (toggle), Warning System (toggle), Escalation Policy (dropdown: immediate_ban/warn_ban/warn_kick_ban/kick_ban) |
| **Punishment Customization** | Ban Message (text), Kick Message (text), Global Ban Network (toggle)                                                                                                                               |

### 4. Hits & Exceptions (`hits_exceptions`)

| Section                  | Configurations                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Exception Management** | Admin Immunity (toggle), Moderator Immunity (toggle), Whitelist Mode (toggle), VIP Immunity (toggle)                |
| **Hit Management**       | Hit Threshold (number, default 3), Hit Decay Time in minutes (number, default 60), False Positive Learning (toggle) |

### 5. Logging & Notifications (`logging_notifications`)

| Section                   | Configurations                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Logging Settings**      | Log All Detections (toggle), Log Player Actions (toggle), Log Level (dropdown: debug/info/warn/error), Log Retention in days (number, default 30) |
| **Discord Notifications** | Discord Webhook URL (text/embed), Notify on Ban (toggle), Notify on Kick (toggle), Notify on Detection (toggle)                                   |
| **Data Management**       | Automatic Backups (toggle), Backup Retention in days (number, default 7), Export Configuration (export)                                           |

## Configuration Types

Supports 4 value types:

| Type          | UI Control        | Value Type                 |
| ------------- | ----------------- | -------------------------- |
| `boolean`     | Toggle switch     | `true`/`false`             |
| `number`      | Number input      | Integer/float              |
| `string`      | Text input        | String                     |
| `select`      | Dropdown          | String (from options list) |
| `embed_json`  | JSON embed editor | String (JSON)              |
| `export_json` | Download button   | N/A (triggers download)    |

## Configuration Registry

Defined in `createConfigurationRegistry()` function in `server/routes/configuration.ts`. Each config entry has:

```typescript
{
  id: string;          // Unique identifier (e.g., "enable_shield")
  title: string;       // Display name
  subtitle: string;    // Description/help text
  type: string;        // Control type (toggle, dropdown, text, number)
  defaultValue: any;   // Initial value
  tip: string;         // Help tooltip text
  category: string;    // Category ID for grouping
  section: string;     // Section ID within category
  options?: string[];  // Dropdown options (for type=dropdown)
}
```

Total: **30+ configuration entries** across all categories.

## Server-Specific Defaults

Configurations adapt to each server:

| Server ID  | Server Name             | Max Players | Detection Sensitivity |
| ---------- | ----------------------- | ----------- | --------------------- |
| `server-1` | AtomicRP Main Server    | 64          | 85                    |
| `server-2` | AtomicRP Test Server    | 32          | 70                    |
| `default`  | FiveCity RP Demo Server | 48          | 75                    |

## Client Configuration Manager

The `useConfigurationManager()` hook in `client/lib/configuration-manager.ts` provides:

### State

- `configData` — Current configuration state (AntiCheatConfigurations)
- `originalConfig` (ref) — Snapshot of initial config for diffing
- `pendingUpdates` (ref) — Map of changed config IDs to their new values

### Methods

| Method                                                             | Description                                                                                                 |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `updateConfig(updater)`                                            | Update entire config                                                                                        |
| `updateStaticConfig(updater)`                                      | Update static config only                                                                                   |
| `updateDynamicConfig(updater)`                                     | Update dynamic config only                                                                                  |
| `updateConfigurationValue(categoryId, sectionId, configId, value)` | Update a single config value by traversing the nested structure                                             |
| `getChangedValues()`                                               | Compute diff between current and original configs; returns `{ static?, dynamic? }` with only changed values |
| `resetChanges()`                                                   | Reset state to original config                                                                              |

### Data Flow

```
User toggles a setting
  → updateConfigurationValue(categoryId, sectionId, configId, value)
    → Updates pendingUpdates ref
    → Traverses nested config structure
    → Returns new state with updated value

Save button clicked
  → getChangedValues()
    → Compares current state to originalConfig ref
    → Returns { dynamic: { configId: value } }
  → POST to /api/server/:serverId/configuration
    → Server validates + saves
    → resetChanges() on success
```

## Simulated Behavior

The server simulates realistic behavior for development testing:

- **GET**: Random delay 500-1500ms, 5% simulated database error
- **PUT**: Random delay 1000-3000ms, 10% simulated validation error
- **History**: Generates mock version history entries
