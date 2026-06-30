# Deployment Guide

## Prerequisites

- Node.js 18+
- npm 9+

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable         | Required | Description                             | Default                                    |
| ---------------- | -------- | --------------------------------------- | ------------------------------------------ |
| `JWT_SECRET`     | Yes      | Secret key for JWT token signing        | `fallback-secret-change-in-production`     |
| `SESSION_SECRET` | Yes      | Secret for Express session cookies      | `fallback-secret-key-change-in-production` |
| `VITE_API_URL`   | No       | API base URL (set by Vite proxy in dev) | `/api`                                     |
| `PORT`           | No       | Server port                             | `8080`                                     |
| `NODE_ENV`       | No       | Runtime environment                     | `development`                              |

**Important:** Change all default secrets before production deployment.

## Development

```bash
# Full stack (client + server with HMR)
npm run dev

# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# TypeScript validation
npm run typecheck

# Run tests
npm test
```

The dev server runs on port 8080 by default. Vite proxies `/api` requests to the Express server.

## Production Build

```bash
# Build everything
npm run build

# Build steps:
npm run build:client   # Vite builds SPA → dist/spa/
npm run build:server   # Vite builds server → dist/server/

# Start production server
npm start
```

The production server:

1. Serves the built SPA from `dist/spa/` as static files
2. Provides `/api/*` endpoints via Express
3. Falls back to `index.html` for SPA routing on all non-API routes

## Docker

A `Dockerfile` is included for containerized deployment:

```bash
docker build -t atomicshield .
docker run -p 8080:8080 -e JWT_SECRET=your-secret atomicshield
```

## Standalone Binary

The project supports `pkg` for building self-contained executables:

```bash
npm run build  # Builds client + server first
npx pkg .      # Creates binaries for Linux, macOS, Windows
```

Binary outputs are configured in `package.json` under the `pkg` section:

- Assets: `dist/spa/*`
- Scripts: `dist/server/**/*.js`

## Netlify Deployment

A `netlify.toml` is included for SPA deployment:

```toml
[build]
  command = "npm run build:client"
  publish = "dist/spa"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Note: Netlify deployment only serves the frontend. You'll need a separate server instance for the API.

## Vite Configuration

### Client (`vite.config.ts`)

- React plugin with SWC for fast refresh
- Path aliases: `@/` → `client/`, `@shared/` → `shared/`
- SPA fallback in dev
- Proxy `/api` to Express server

### Server (`vite.config.server.ts`)

- Builds server to `dist/server/` as ESM
- Externalizes all dependencies
- Entry: `server/standalone.ts`

## CI/CD Considerations

For automated deployments:

1. Run `npm run typecheck && npm test` for validation
2. Run `npm run build` for artifacts
3. Deploy `dist/` directory alongside `package.json` dependencies
4. Set environment variables in your hosting platform
