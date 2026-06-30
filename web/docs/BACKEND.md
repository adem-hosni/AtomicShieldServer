# Backend Architecture

## Overview

The backend is an **Express 4** server written in **TypeScript**. It operates in two modes:

1. **Development** — Integrated with Vite dev server, handles `/api` requests while Vite serves the frontend with HMR
2. **Production** — Built with Vite (`vite.config.server.ts`) into a standalone Node.js bundle, serves both the API and the built SPA

## Server Setup

Defined in `server/index.ts` using a `createServer()` factory function:

```typescript
export function createServer() {
  const app = express();
  // Middleware
  // Routes
  return app;
}
```

## Middleware Stack

| Middleware                               | Purpose                                                       |
| ---------------------------------------- | ------------------------------------------------------------- |
| `cors()`                                 | Cross-Origin Resource Sharing                                 |
| `express.json()`                         | JSON body parsing                                             |
| `express.urlencoded({ extended: true })` | URL-encoded body parsing                                      |
| `express-session`                        | Session management for OAuth state (24h cookie)               |
| Debug logger                             | Logs all `/api` requests (method, path, query, body, headers) |

### Session Configuration

```typescript
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "fallback-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);
```

## Route Handlers

### Routes Index (`server/index.ts`)

| Path                                                           | Handler                   | Auth    | File                      |
| -------------------------------------------------------------- | ------------------------- | ------- | ------------------------- |
| `GET /api/ping`                                                | Inline                    | No      | `index.ts`                |
| `GET /api/demo`                                                | `handleDemo`              | No      | `routes/demo.ts`          |
| `POST /api/auth/signin`                                        | `signIn`                  | No      | `routes/auth.ts`          |
| `POST /api/auth/signup`                                        | `signUp`                  | No      | `routes/auth.ts`          |
| `GET /api/auth/social/:provider`                               | `socialAuth`              | No      | `routes/auth.ts`          |
| `POST /api/auth/forgot-password`                               | `forgotPassword`          | No      | `routes/auth.ts`          |
| `POST /api/auth/reset-password`                                | `resetPassword`           | No      | `routes/auth.ts`          |
| `GET /api/auth/profile`                                        | `getProfile`              | No      | `routes/auth.ts`          |
| `GET /api/auth/google/login`                                   | `googleAuth`              | No      | `routes/google-oauth.ts`  |
| `GET+POST /api/auth/google/callback`                           | `googleCallback`          | No      | `routes/google-oauth.ts`  |
| `GET /api/auth/google/user`                                    | `getGoogleUser`           | No      | `routes/google-oauth.ts`  |
| `GET /api/auth/discord/login`                                  | `discordAuth`             | No      | `routes/discord-oauth.ts` |
| `GET /api/auth/discord/callback`                               | `discordCallback`         | No      | `routes/discord-oauth.ts` |
| `GET /api/auth/discord/user`                                   | `getDiscordUser`          | No      | `routes/discord-oauth.ts` |
| `GET /api/players`                                             | `getPlayers`              | No      | `routes/players.ts`       |
| `POST /api/players/kick`                                       | `kickPlayer`              | No      | `routes/players.ts`       |
| `POST /api/players/ban`                                        | `banPlayer`               | No      | `routes/players.ts`       |
| `POST /api/players/screenshot/:playerId`                       | `takeScreenshot`          | No      | `routes/players.ts`       |
| `GET /api/players/stats`                                       | `getPlayerStats`          | No      | `routes/players.ts`       |
| `GET /api/dashboard/`                                          | `getDashboardOverview`    | **JWT** | `routes/dashboard.ts`     |
| `GET /api/bans`                                                | `getBans`                 | No      | `routes/bans.ts`          |
| `POST /api/bans/create`                                        | `createBan`               | No      | `routes/bans.ts`          |
| `PUT /api/bans/update/:banId`                                  | `updateBan`               | No      | `routes/bans.ts`          |
| `DELETE /api/bans/delete/:banId`                               | `deleteBan`               | No      | `routes/bans.ts`          |
| `GET /api/servers`                                             | `getServers`              | No      | `routes/servers.ts`       |
| `POST /api/servers/add`                                        | `addServer`               | No      | `routes/servers.ts`       |
| `DELETE /api/servers/:serverId`                                | `deleteServer`            | No      | `routes/servers.ts`       |
| `GET /api/server/:serverId`                                    | `getServerDashboard`      | **JWT** | `routes/servers.ts`       |
| `GET /api/server/:serverId/bans`                               | `getServerBans`           | **JWT** | `routes/servers.ts`       |
| `GET /api/server/:serverId/configurations`                     | `getServerConfigurations` | **JWT** | `routes/servers.ts`       |
| `POST /api/api/server/63/bans/unban`                           | `unbanPlayer`             | **JWT** | `routes/bans.ts`          |
| `POST /api/server/:serverId/bans/:banId/report-false-positive` | `reportFalsePositive`     | **JWT** | `routes/bans.ts`          |
| `POST /api/server/:serverId/bans`                              | `createBan`               | **JWT** | `routes/bans.ts`          |
| `GET /api/server/:serverId/configuration`                      | `getConfiguration`        | **JWT** | `routes/configuration.ts` |
| `PUT /api/server/:serverId/configuration`                      | `updateConfiguration`     | **JWT** | `routes/configuration.ts` |
| `GET /api/server/:serverId/configuration/history`              | `getConfigurationHistory` | **JWT** | `routes/configuration.ts` |
| `POST /api/webhook/test`                                       | `testWebhook`             | **JWT** | `routes/webhook-test.ts`  |

### Placeholder Routes

Return "to be implemented" messages:

| Path                        | Future Purpose       |
| --------------------------- | -------------------- |
| `GET /api/audit-logs`       | Audit log queries    |
| `GET /api/moderators`       | Moderator management |
| `GET /api/news`             | News/announcements   |
| `GET /api/changelogs`       | Changelog entries    |
| `GET /api/analytics/stats`  | Server statistics    |
| `GET /api/analytics/charts` | Analytics charts     |

## Auth Middleware

### `authenticateToken`

Extracts JWT from `Authorization: Bearer <token>` header, verifies with `jsonwebtoken`, and attaches decoded payload to `req.user`. Returns 401 if no token, 403 if invalid/expired.

### `optionalAuth`

Same extraction and verification but does NOT reject unauthenticated requests. Useful for routes that work both with and without authentication.

### JWT Payload

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}
```

Secret: `process.env.JWT_SECRET || "fallback-secret-change-in-production"`
Expiration: 24 hours

## Mock Data System

All routes currently operate with in-memory mock data:

| Route                    | Mock Strategy                                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Auth**                 | In-memory `users[]` array with 2 pre-seeded users. New sign-ups appended to array.                                                                                             |
| **Players**              | `mockPlayers[]` array with 50 records (2 hand-crafted + 48 generated). Supports pagination, search, sorting.                                                                   |
| **Bans**                 | `mockBans[]` array with 50 records (4 hand-crafted + 46 generated). Supports pagination, search, filter, sort.                                                                 |
| **Dashboard**            | `DashboardDataService` singleton with `getTimeBasedVariance()` for realistic time-of-day player count simulation. Caches data for 30 seconds.                                  |
| **Servers**              | Static mock objects with generated license keys, expiration dates, and status.                                                                                                 |
| **Configuration**        | Registry-based generator that creates configs per server with server-specific defaults. Simulates random database delays (500-1500ms) and 5% error rate for realistic testing. |
| **Configuration Update** | Simulates validation delay (1000-3000ms) and 10% validation error for realistic testing.                                                                                       |

## Route Files

| File                      | Key Exports                                                                                                 | Lines |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- | ----- |
| `routes/auth.ts`          | `signIn`, `signUp`, `socialAuth`, `forgotPassword`, `resetPassword`, `getProfile`                           | 431   |
| `routes/bans.ts`          | `getBans`, `createBan`, `updateBan`, `deleteBan`, `unbanPlayer`, `reportFalsePositive`                      | 442   |
| `routes/players.ts`       | `getPlayers`, `kickPlayer`, `banPlayer`, `takeScreenshot`, `getPlayerStats`                                 | 342   |
| `routes/dashboard.ts`     | `getDashboardOverview` (uses `DashboardDataService` class)                                                  | 417   |
| `routes/servers.ts`       | `addServer`, `getServers`, `deleteServer`, `getServerDashboard`, `getServerBans`, `getServerConfigurations` | 685   |
| `routes/configuration.ts` | `getConfiguration`, `updateConfiguration`, `getConfigurationHistory` (+ registry builder)                   | 769   |
| `routes/google-oauth.ts`  | `googleAuth`, `googleCallback`, `getGoogleUser`                                                             | ~100  |
| `routes/discord-oauth.ts` | `discordAuth`, `discordCallback`, `getDiscordUser`                                                          | ~100  |
| `routes/demo.ts`          | `handleDemo`                                                                                                | ~20   |
| `routes/webhook-test.ts`  | `testWebhook`                                                                                               | ~80   |

## Standalone Server

`server/standalone.ts` provides a production entry point:

```typescript
const app = createServer();
// Serve static SPA build
app.use(express.static("dist/spa"));
// SPA fallback
app.get("*", (req, res) => res.sendFile("dist/spa/index.html"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```
