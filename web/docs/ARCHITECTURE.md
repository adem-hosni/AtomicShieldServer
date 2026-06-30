# Architecture

## Overview

AtomicShield is a full-stack web application following a **monorepo** structure with three main directories: `client/` (React SPA), `server/` (Express API), and `shared/` (common TypeScript types). The application is served from a single port during development (Vite proxy to Express) and production (Express serves the built SPA).

```
┌─────────────────────────────────────────────────┐
│                  Browser                         │
│  React SPA (Vite HMR in dev)                    │
│  TailwindCSS dark theme                          │
│  react-helmet-async for SEO                      │
└───────────────────┬─────────────────────────────┘
                    │ HTTP (fetch)
                    ▼
┌─────────────────────────────────────────────────┐
│              Express Server (port 8080)           │
│  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ API Routes  │  │  Static SPA (production) │  │
│  │ /api/*      │  │  SPA fallback (*.html)   │  │
│  └─────────────┘  └──────────────────────────┘  │
│  Middleware: cors, json, session, debug logging  │
└─────────────────────────────────────────────────┘
```

## Client Architecture

The client is a **React 18 SPA** built with Vite. It uses React Router 6 with SPA mode (hash-free routing) and a `BrowserRouter`.

### Routing Layers

1. **Public Routes** — `/` (home), `/tos`, `/privacy`, `/invite`
2. **Auth Routes** — `/auth/signin`, `/auth/signup`, `/auth/forgot-password` (wrapped with `PublicRoute` — redirects to dashboard if authenticated)
3. **OAuth Callbacks** — `/auth/google/callback`, `/auth/oauth/callback`
4. **Protected Dashboard Routes** — All `/dashboard/*` paths (wrapped with `ProtectedRoute` + `DashboardLayout`)
5. **Catch-all** — `*` renders a 404 page

### State Management

| Concern     | Solution                                                        |
| ----------- | --------------------------------------------------------------- |
| Server data | TanStack Query (React Query) with query client provider         |
| Auth state  | React Context (`AuthContext`) with localStorage persistence     |
| Language    | React Context (`LanguageContext`) with localStorage persistence |
| UI state    | Local component state (useState)                                |

### Data Flow

```
Page/Component
  → hooks/use-api.ts or lib/api-client.ts
    → fetch() to /api/endpoint
      → Express handler
        → Mock data (future: database)
      ← JSON response
    ← typed response (ApiResponse<T>)
  → component re-render
```

## Backend Architecture

The Express server is created via a `createServer()` factory function in `server/index.ts`. This is used by both the Vite dev server integration and the standalone production server.

### Middleware Pipeline

1. `cors()` — Cross-origin support
2. `express.json()` — Body parsing
3. `express.urlencoded()` — URL-encoded body parsing
4. `express-session` — Session management (for OAuth state)
5. Debug logger — Logs all `/api` requests with method, path, query, body, headers

### Route Registration

Routes are registered in `server/index.ts` with optional `authenticateToken` or `optionalAuth` middleware from `server/middleware/auth.ts`.

### JWT Authentication

- Tokens generated with `jsonwebtoken` library
- 24-hour expiration
- Payload: `{ userId, email, name }`
- Middleware extracts Bearer token from Authorization header
- On 401: API client auto-clears token and redirects to sign-in

## Shared Types

The `shared/` directory contains TypeScript interfaces used by both client and server:

| File               | Contents                                                                     |
| ------------------ | ---------------------------------------------------------------------------- |
| `api.ts`           | All API response types, request types, entity interfaces, endpoint constants |
| `configuration.ts` | Configuration page/category/section/configuration type definitions           |

Path aliases:

- `@shared/*` → `shared/*`
- `@/*` → `client/*`

## Data Layer (Current — Mock)

All server routes currently use **in-memory mock data** with realistic randomization. Future implementations should replace mock arrays and services with real database queries.

| Route         | Mock Data Source                                          |
| ------------- | --------------------------------------------------------- |
| Auth          | In-memory `users[]` array                                 |
| Bans          | `mockBans[]` array with 50 records                        |
| Players       | `mockPlayers[]` array with 50 records                     |
| Dashboard     | `DashboardDataService` singleton with time-based variance |
| Servers       | Static mock objects                                       |
| Configuration | Registry-based generator per server                       |

## Configuration System Architecture

The anti-cheat configuration uses a **registry pattern**:

1. **Flat Registry** — `createConfigurationRegistry()` in `server/routes/configuration.ts` defines all configs in a flat object with `category` and `section` metadata
2. **Nested Builder** — `buildNestedStructure()` organizes the flat registry into a nested `Category → Section → Configuration` hierarchy
3. **Client Manager** — `useConfigurationManager()` hook in `client/lib/configuration-manager.ts` tracks changes, computes diffs, and provides update/reset methods

## Security Architecture

- JWT tokens stored in `localStorage`
- Protected routes check both token existence and validity
- API middleware (`authenticateToken`) verifies JWT on protected endpoints
- `forceLogout()` clears state on 401 responses
- Multi-tab sync via `window.addEventListener('storage', ...)`

## Build & Deployment

```
Development:
  npm run dev → Vite dev server proxies /api to Express

Production:
  npm run build:client → Vite builds SPA to dist/spa/
  npm run build:server → Vite builds server to dist/server/
  npm start → node dist/server/node-build.mjs
```
