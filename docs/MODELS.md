# Data Models

## anticheat app

### HWID

Hardware ID fingerprint with historical tracking.

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| username | CharField(32) | Player username |
| computer_name | CharField(64) | Windows computer name |
| disks | JSONField | List of disk serials |
| cpuid | CharField(64) | CPU ID |
| motherboard_serial | CharField(64) | Motherboard serial |
| bios_version | CharField(32) | BIOS version |
| pnp_device | CharField(512) | PnP device identifier |
| fivem_license | CharField(64) | FiveM license identifier |
| fivem_token | JSONField | FiveM tokens |
| steam | CharField(64) | Steam ID |
| discord_id | CharField(64) | Discord ID |
| history | HistoricalRecords | Change tracking |

### DetectionReport

| Field | Type | Description |
|-------|------|-------------|
| hwid | FK→HWID | Detected player |
| detection_type | IntegerField | DetectionType enum |
| detected_at | DateTimeField | Auto-set timestamp |
| report | JSONField | Detection details |
| screenshot | ImageField | Evidence image |

### Ban

| Field | Type | Description |
|-------|------|-------------|
| hwid | FK→HWID | Banned player |
| banned_at | DateTimeField | Auto-set |
| duration | DurationField | Ban length (null=permanent) |
| game_server | FK→GameServer | Banning server |
| active | BooleanField | Whether ban is active |
| reason | CharField(256) | Ban reason |
| report | FK→DetectionReport | Evidence report |

### MaliciousSignatures

| Field | Type | Description |
|-------|------|-------------|
| name | CharField(64) | Signature name |
| signatures | JSONField | List of signature strings |
| type | IntegerField | ServerType |
| priority | IntegerField | Detection priority |
| ban_message | CharField(64) | Custom ban message |

### AntiCheatConfigTemplate

| Field | Type | Description |
|-------|------|-------------|
| section | FK→Section | Configuration section |
| name | CharField(64) | Display name |
| pseudo_name | CharField(32) | Unique identifier |
| server_type | IntegerField | ServerType |
| config_type | TextField | AntiCheatConfigDataTypes |
| default_value | CharField(512) | Default value |
| extra | JSONField | Extra metadata |

### AntiCheatConfigurations

| Field | Type | Description |
|-------|------|-------------|
| config | JSONField | Configuration key-value pairs |
| webhooks | JSONField | Discord webhook URLs |
| embeds | JSONField | Discord embed templates |
| server_image | ImageField | Server logo |

### Additional Models

- **Warning** — Player warning counts (max 3)
- **AntiCheatVersion** — Version management (stable/beta/deprecated)
- **WhitelistedProcess** — Whitelisted system processes
- **ThreatFile** — Uploaded threat file samples
- **CrashReport** — Engine crash dumps
- **FalsePositiveReport** — Ban appeal/false positive reports

## dashboard app

### GameServer

| Field | Type | Description |
|-------|------|-------------|
| ip | CharField(49) | Server IP address |
| port | IntegerField | Server port |
| name | CharField(32) | Server name |
| owner | FK→User | Server owner |
| subscriptions | M2M→ServerSubscription | Active subscriptions |
| configurations | FK→AntiCheatConfigurations | Anti-cheat config |
| type | IntegerField | ServerType |
| status | IntegerField | ServerStatus |

### ServerSubscription

| Field | Type | Description |
|-------|------|-------------|
| owner | FK→User | Subscription owner |
| started_at | DateTimeField | When subscription started |
| key | CharField(32) | Unique license key |
| payment | FK→Payment | Associated payment |
| plan | IntegerField | Plans (FREE/BASIC/PRO/ENTREPRISE/LIFETIME) |
| type | IntegerField | ServerType |
| status | IntegerField | SubscriptionStatus |

### AuditLogEntry

Comprehensive audit trail with GenericForeignKey for actors and targets.

| Field | Type | Description |
|-------|------|-------------|
| timestamp | DateTimeField | When event occurred |
| action | SmallIntegerField | Action enum |
| severity | SmallIntegerField | Severity enum |
| category | IntegerField | Category enum |
| actor_content_type | FK→ContentType | Actor model type |
| actor_object_id | CharField(128) | Actor object ID |
| summary | CharField(140) | Short description |
| details | TextField | Full description |
| game_server | FK→GameServer | Related server |
| target_content_type | FK→ContentType | Target model type |
| target_object_id | CharField(128) | Target object ID |
| metadata | JSONField | Extra data |
| source | CharField(32) | Event source |
| reviewed | BooleanField | Reviewed flag |

### GameServerModerator

| Field | Type | Description |
|-------|------|-------------|
| user | O2O→User | Moderator user |
| game_server | FK→GameServer | Managed server |
| can_* | BooleanField | 10 permission flags |
| status | CharField | Active/Suspended |

### Additional Models

- **Announcements** — System announcements with read tracking
- **PatchNotes** — Version changelogs with highlights
- **Release** — Software releases with assets
- **ReleaseAsset** — Downloadable release files
- **ModeratorInviteToken** — Invite-based moderation system

## api app

### Payment

| Field | Type | Description |
|-------|------|-------------|
| tebex_payment_id | CharField(128) | Tebex transaction ID |
| transaction_id | CharField(512) | Payment reference |
| customer_* | Various | Customer details |
| status | IntegerField | Payment status |
| price | IntegerField | Amount paid |
| paid_products | JSONField | Purchased products |
