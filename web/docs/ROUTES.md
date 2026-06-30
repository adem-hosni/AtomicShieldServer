# Route Map

## Frontend Routes

All routes defined in `client/App.tsx` using React Router 6.

### Public Routes

| Path       | Component        | File                          | Description                               |
| ---------- | ---------------- | ----------------------------- | ----------------------------------------- |
| `/`        | `HomePage`       | `pages/HomePageNew.tsx`       | Landing page with hero, features, pricing |
| `/tos`     | `TermsOfService` | `pages/TermsOfService.tsx`    | Terms of service                          |
| `/privacy` | `PrivacyPolicy`  | `pages/PrivacyPolicy.tsx`     | Privacy policy                            |
| `/invite`  | `AcceptInvite`   | `components/AcceptInvite.tsx` | Moderator invite acceptance               |

### Auth Routes (Guest only — redirect to dashboard if authenticated)

| Path                    | Component        | File                       | Description                 |
| ----------------------- | ---------------- | -------------------------- | --------------------------- |
| `/auth/signin`          | `SignIn`         | `pages/SignIn.tsx`         | Sign-in with email/password |
| `/auth/signup`          | `SignUp`         | `pages/SignUp.tsx`         | Create account              |
| `/auth/forgot-password` | `ForgotPassword` | `pages/ForgotPassword.tsx` | Password reset request      |

### OAuth Callback Routes

| Path                    | Component            | File                           | Description                         |
| ----------------------- | -------------------- | ------------------------------ | ----------------------------------- |
| `/auth/google/callback` | `GoogleAuthCallback` | `pages/GoogleAuthCallback.tsx` | Google OAuth callback handler       |
| `/auth/oauth/callback`  | `OAuthJsonCallback`  | `pages/OAuthJsonCallback.tsx`  | Generic OAuth callback (JSON token) |

### Protected Dashboard Routes (require authentication)

| Path                                     | Component                         | Description                                    |
| ---------------------------------------- | --------------------------------- | ---------------------------------------------- |
| `/dashboard`                             | Redirect to `/dashboard/overview` | Dashboard root                                 |
| `/dashboard/overview`                    | `GeneralDashboard`                | Global dashboard with stats across all servers |
| `/dashboard/server/:serverId`            | `DashboardContent`                | Server-specific dashboard                      |
| `/dashboard/server/:serverId/players`    | `PlayersPage`                     | Online player management                       |
| `/dashboard/server/:serverId/bans`       | `BansPage`                        | Ban records management                         |
| `/dashboard/server/:serverId/config`     | `AntiCheatConfigurationPage`      | Anti-cheat configuration                       |
| `/dashboard/server/:serverId/moderators` | `ModeratorsPage`                  | Moderator management                           |
| `/dashboard/server/:serverId/logs`       | `AuditLogsPage`                   | Audit log viewer                               |
| `/dashboard/server/:serverId/streams`    | `MultiStreamPage`                 | Multi-stream viewer                            |
| `/dashboard/news`                        | `NewsPage`                        | News and announcements                         |
| `/dashboard/changelogs`                  | `ChangelogsPage`                  | Changelog viewer                               |
| `/dashboard/download`                    | `DownloadPage`                    | Software downloads                             |
| `/dashboard/subscriptions`               | `SubscriptionsPage`               | Subscription management                        |
| `/dashboard/redeem`                      | `RedeemPage`                      | License key redemption                         |
| `/dashboard/support`                     | `SupportPage`                     | Help and support                               |
| `/dashboard/docs`                        | `DocumentationPage`               | In-app documentation                           |
| `/dashboard/streams`                     | `MultiStreamPage`                 | Global multi-stream view                       |

### Catch-All

| Path | Component  | File                 |
| ---- | ---------- | -------------------- |
| `*`  | `NotFound` | `pages/NotFound.tsx` |

---

## Backend API Routes

All routes registered in `server/index.ts`.

### General

| Method | Path        | Handler      | Auth |
| ------ | ----------- | ------------ | ---- |
| GET    | `/api/ping` | Inline       | No   |
| GET    | `/api/demo` | `handleDemo` | No   |

### Authentication

| Method | Path                         | Handler          | Auth                            |
| ------ | ---------------------------- | ---------------- | ------------------------------- |
| POST   | `/api/auth/signin`           | `signIn`         | No                              |
| POST   | `/api/auth/signup`           | `signUp`         | No                              |
| GET    | `/api/auth/social/:provider` | `socialAuth`     | No                              |
| POST   | `/api/auth/forgot-password`  | `forgotPassword` | No                              |
| POST   | `/api/auth/reset-password`   | `resetPassword`  | No                              |
| GET    | `/api/auth/profile`          | `getProfile`     | No (uses Bearer token manually) |

### Google OAuth

| Method | Path                        | Handler          | Auth |
| ------ | --------------------------- | ---------------- | ---- |
| GET    | `/api/auth/google/login`    | `googleAuth`     | No   |
| GET    | `/api/auth/google/callback` | `googleCallback` | No   |
| POST   | `/api/auth/google/callback` | `googleCallback` | No   |
| GET    | `/api/auth/google/user`     | `getGoogleUser`  | No   |

### Discord OAuth

| Method | Path                         | Handler           | Auth |
| ------ | ---------------------------- | ----------------- | ---- |
| GET    | `/api/auth/discord/login`    | `discordAuth`     | No   |
| GET    | `/api/auth/discord/callback` | `discordCallback` | No   |
| GET    | `/api/auth/discord/user`     | `getDiscordUser`  | No   |

### Dashboard

| Method | Path              | Handler                | Auth |
| ------ | ----------------- | ---------------------- | ---- |
| GET    | `/api/dashboard/` | `getDashboardOverview` | JWT  |

### Players

| Method | Path                                | Handler          | Auth |
| ------ | ----------------------------------- | ---------------- | ---- |
| GET    | `/api/players`                      | `getPlayers`     | No   |
| POST   | `/api/players/kick`                 | `kickPlayer`     | No   |
| POST   | `/api/players/ban`                  | `banPlayer`      | No   |
| POST   | `/api/players/screenshot/:playerId` | `takeScreenshot` | No   |
| GET    | `/api/players/stats`                | `getPlayerStats` | No   |

### Bans

| Method | Path                                                      | Handler               | Auth |
| ------ | --------------------------------------------------------- | --------------------- | ---- |
| GET    | `/api/bans`                                               | `getBans`             | No   |
| POST   | `/api/bans/create`                                        | `createBan`           | No   |
| PUT    | `/api/bans/update/:banId`                                 | `updateBan`           | No   |
| DELETE | `/api/bans/delete/:banId`                                 | `deleteBan`           | No   |
| POST   | `/api/api/server/63/bans/unban`                           | `unbanPlayer`         | JWT  |
| POST   | `/api/server/:serverId/bans/:banId/report-false-positive` | `reportFalsePositive` | JWT  |
| POST   | `/api/server/:serverId/bans`                              | `createBan`           | JWT  |

### Servers

| Method | Path                                   | Handler                   | Auth |
| ------ | -------------------------------------- | ------------------------- | ---- |
| GET    | `/api/servers`                         | `getServers`              | No   |
| POST   | `/api/servers/add`                     | `addServer`               | No   |
| DELETE | `/api/servers/:serverId`               | `deleteServer`            | No   |
| GET    | `/api/server/:serverId`                | `getServerDashboard`      | JWT  |
| GET    | `/api/server/:serverId/bans`           | `getServerBans`           | JWT  |
| GET    | `/api/server/:serverId/configurations` | `getServerConfigurations` | JWT  |

### Configuration

| Method | Path                                          | Handler                   | Auth |
| ------ | --------------------------------------------- | ------------------------- | ---- |
| GET    | `/api/server/:serverId/configuration`         | `getConfiguration`        | JWT  |
| PUT    | `/api/server/:serverId/configuration`         | `updateConfiguration`     | JWT  |
| GET    | `/api/server/:serverId/configuration/history` | `getConfigurationHistory` | JWT  |

### Webhooks

| Method | Path                | Handler       | Auth |
| ------ | ------------------- | ------------- | ---- |
| POST   | `/api/webhook/test` | `testWebhook` | JWT  |

### Placeholder Routes

| Method | Path                    | Description       |
| ------ | ----------------------- | ----------------- |
| GET    | `/api/audit-logs`       | To be implemented |
| GET    | `/api/moderators`       | To be implemented |
| GET    | `/api/news`             | To be implemented |
| GET    | `/api/changelogs`       | To be implemented |
| GET    | `/api/analytics/stats`  | To be implemented |
| GET    | `/api/analytics/charts` | To be implemented |

---

## Frontend ↔ Backend Route Mapping

| Frontend Page         | API Endpoints Used                                                    |
| --------------------- | --------------------------------------------------------------------- |
| Home `/`              | None (static landing page)                                            |
| SignIn `/auth/signin` | `POST /api/auth/signin`                                               |
| SignUp `/auth/signup` | `POST /api/auth/signup`                                               |
| Dashboard Overview    | `GET /api/dashboard/`                                                 |
| Server Dashboard      | `GET /api/server/:serverId`                                           |
| Players               | `GET /api/players`, `POST /api/players/kick`, `POST /api/players/ban` |
| Bans                  | `GET /api/bans`, `POST /api/bans/create`, `PUT/DELETE bans`           |
| Configuration         | `GET/PUT /api/server/:serverId/configuration`                         |
| Audit Logs            | `GET /api/audit-logs` (placeholder)                                   |
| Moderators            | `GET /api/moderators` (placeholder)                                   |
| News                  | `GET /api/news` (placeholder)                                         |
| Changelogs            | `GET /api/changelogs` (placeholder)                                   |
