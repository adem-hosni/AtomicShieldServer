# Authentication System

## Overview

AtomicShield uses **JWT (JSON Web Token)** based authentication with support for three providers:

1. **Email/Password** — Traditional login with Zod validation
2. **Discord OAuth** — Social login via Discord
3. **Google OAuth** — Social login via Google

## Architecture

```
Client                               Server
──────                               ──────
SignIn page                          POST /api/auth/signin
  → AuthContext.signIn()               → Validate with Zod
  → api-client.ts                      → Find user in mock DB
  → POST /api/auth/signin              → Generate JWT
  → Store token in localStorage        → Return { user, token }
  → Redirect to dashboard

Protected Route                       authenticateToken middleware
  → Check localStorage for token        → Extract Bearer token
  → If no token → redirect /signin      → Verify JWT
  → Render dashboard                    → Attach user to req
  → On 401 → clear token, redirect
```

## JWT Implementation

### Token Generation (`server/middleware/auth.ts`)

```typescript
const generateToken = (payload: { userId; email; name }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};
```

### Token Payload

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number; // Issued at
  exp?: number; // Expiration (24h)
}
```

### Token Verification

```typescript
const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};
```

### Default Secret

```
JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production"
```

**Must be changed in production.**

## Auth Middleware

### `authenticateToken`

Applied to dashboard routes and configuration endpoints:

```typescript
app.get("/api/dashboard/", authenticateToken, getDashboardOverview);
app.get("/api/server/:serverId", authenticateToken, getServerDashboard);
app.get("/api/server/:serverId/configurations", authenticateToken, ...);
// ... etc
```

Behavior:

- Missing token → 401 `{ success: false, error: "Access token required" }`
- Invalid/expired token → 403 `{ success: false, error: "Invalid or expired token" }`
- Valid token → `req.user` set, `next()` called

### `optionalAuth`

Allows both authenticated and unauthenticated requests. If token is present and valid, `req.user` is set. Invalid tokens are silently ignored.

## Email/Password Auth

### Sign In

**Endpoint:** `POST /api/auth/signin`

**Validation** (Zod schema):

- `email` — Must be valid email format
- `password` — Min 6 characters

**Flow:**

1. Validate request body
2. Find user by email (case-insensitive)
3. Compare password (plaintext in mock — hash with bcrypt in production)
4. Update lastLogin timestamp
5. Generate JWT
6. Return `{ user, token, expiresIn: "24h" }`

**Mock users:**
| Email | Password | Name |
|-------|----------|------|
| `admin@atomicshield.com` | `admin123` | Admin User |
| `user@example.com` | `password123` | Test User |

### Sign Up

**Endpoint:** `POST /api/auth/signup`

**Validation** (Zod schema with refinement):

- `email` — Valid email
- `password` — Min 6 characters
- `confirmPassword` — Must match password
- `name` — Min 2 characters

**Flow:**

1. Validate
2. Check for duplicate email → 409 if exists
3. Create user in mock database
4. Generate JWT
5. Return 201 with `{ user, token }`

## Discord OAuth

### Flow

```
1. User clicks "Sign in with Discord"
2. GET /api/auth/discord/login → Redirects to Discord authorization URL
3. User authorizes → Discord redirects to /api/auth/discord/callback
4. Server exchanges code for access token
5. Server fetches user info from Discord API
6. Server creates/updates user in database
7. Server generates JWT
8. Server redirects client to /auth/oauth/callback?token=...&user=...
9. Client extracts token from URL, stores in localStorage
10. Client redirects to /dashboard
```

### Endpoints

| Endpoint                         | Purpose                        |
| -------------------------------- | ------------------------------ |
| `GET /api/auth/discord/login`    | Initiate Discord OAuth         |
| `GET /api/auth/discord/callback` | Handle OAuth callback          |
| `GET /api/auth/discord/user`     | Get authenticated Discord user |

## Google OAuth

### Flow

Same pattern as Discord OAuth.

### Endpoints

| Endpoint                               | Purpose                       |
| -------------------------------------- | ----------------------------- |
| `GET /api/auth/google/login`           | Initiate Google OAuth         |
| `GET + POST /api/auth/google/callback` | Handle OAuth callback         |
| `GET /api/auth/google/user`            | Get authenticated Google user |

### Mock Implementation

Both OAuth flows currently use mock implementations:

- Mock users created per-provider with pattern `user@{provider}.example.com`
- Provider ID stored from the OAuth response
- Existing users matched by `provider + providerId`

## Client-Side Auth Flow

### AuthContext (`client/contexts/AuthContext.tsx`)

Provides:

- `user` — Current user object or null
- `token` — JWT token string or null
- `isAuthenticated` — Boolean derived from `!!user && !!token`
- `isLoading` — Initial auth check in progress
- `signIn(token, userData)` — Store token + user in state and localStorage
- `signOut()` — Clear all auth data
- `checkAuth()` — Re-read from localStorage
- `forceLogout()` — Clear and redirect (used on 401)

### Auth Utils (`client/lib/auth-utils.ts`)

| Function                | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `isAuthenticated()`     | Check localStorage for token + user                  |
| `getCurrentUser()`      | Parse user JSON from localStorage                    |
| `signOut()`             | Remove token + user from localStorage                |
| `getAuthToken()`        | Get token from localStorage                          |
| `initiateDiscordAuth()` | Redirect to `/api/auth/discord`                      |
| `useAuthCallback()`     | Hook to extract token from OAuth callback URL params |

### API Client Auth (`client/lib/api-client.ts`)

`AuthManager` singleton:

- `setToken(token)` — Store in memory + localStorage
- `getToken()` — Retrieve from memory or localStorage
- `clearToken()` — Clear both
- `isAuthenticated()` — Check token exists

**Auto-logout on 401:**
When any API request returns 401:

1. `authManager.clearToken()`
2. Remove user from localStorage
3. Dispatch `auth-logout` custom event
4. Redirect to `/auth/signin?redirect=<current_path>`

### Auth State Persistence

- **Storage:** `localStorage` (keys: `token`, `user`)
- **Multi-tab sync:** `window.addEventListener('storage', ...)` — re-checks auth when localStorage changes in another tab
- **Auto-logout event:** Custom `auth-logout` event listened for in AuthContext

## Route Protection

### ProtectedRoute Component

```typescript
<ProtectedRoute>
  <DashboardLayout>
    <PlayersPage />
  </DashboardLayout>
</ProtectedRoute>
```

Behavior:

- If `isLoading` — show loading skeleton
- If not authenticated — redirect to `/auth/signin`
- If authenticated — render children

### PublicRoute Component

```typescript
<PublicRoute redirectIfAuthenticated={true}>
  <SignIn />
</PublicRoute>
```

Behavior:

- If authenticated — redirect to `/dashboard/overview`
- If not authenticated — render children

## Security Notes

### Current Limitations (Mock Implementation)

- **Plaintext passwords** — In production, use bcrypt with salt rounds
- **Fixed JWT secret** — Must use environment variable in production
- **No rate limiting** — Should implement for auth endpoints
- **No refresh tokens** — Currently single JWT with 24h expiry
- **No email verification** — Mock users created verified
- **OAuth is mock** — No real token exchange implemented
