# Frontend Architecture

## Overview

The frontend is a **React 18 Single Page Application** built with **Vite 5** and **TypeScript**. It uses **TailwindCSS 3** for styling with a custom dark theme, **shadcn/ui** for UI components (Radix UI primitives), and **React Router 6** for client-side routing.

## Directory Structure

```
client/
├── pages/                  # Route-level page components
│   ├── Index.tsx           # Home page (legacy)
│   ├── HomePage.tsx        # Home page (legacy)
│   ├── HomePageNew.tsx     # Current home page
│   ├── SignIn.tsx          # Sign-in page
│   ├── SignUp.tsx          # Sign-up page
│   ├── ForgotPassword.tsx  # Password reset page
│   ├── TermsOfService.tsx  # Terms of service
│   ├── PrivacyPolicy.tsx   # Privacy policy
│   ├── NotFound.tsx        # 404 catch-all
│   ├── GoogleAuthCallback.tsx   # Google OAuth callback
│   ├── OAuthJsonCallback.tsx    # Generic OAuth callback
│   ├── GoogleSignInDemo.tsx     # Google sign-in demo
│   └── DynamicConfigTest.tsx    # Configuration test page
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives (51 files)
│   ├── AtomicSidebar.tsx   # Dashboard sidebar navigation
│   ├── DashboardContent.tsx # Dynamic dashboard content loader
│   ├── GeneralDashboard.tsx # General/overview dashboard
│   ├── DashboardOverview.tsx # Dashboard overview panel
│   ├── SimpleServerDashboard.tsx # Server-specific dashboard
│   ├── BansPage.tsx        # Ban management page
│   ├── PlayersPage.tsx     # Player management page
│   ├── AuditLogsPage.tsx   # Audit log viewer
│   ├── ModeratorsPage.tsx  # Moderator management
│   ├── NewsPage.tsx        # News feed
│   ├── ChangelogsPage.tsx  # Changelog viewer
│   ├── DownloadPage.tsx    # Download center
│   ├── SubscriptionsPage.tsx # Subscription management
│   ├── RedeemPage.tsx      # License key redemption
│   ├── SupportPage.tsx     # Support/help page
│   ├── DocumentationPage.tsx # In-app documentation
│   ├── MultiStreamPage.tsx # Multi-stream viewer
│   ├── AntiCheatConfigurationPage.tsx # Config UI
│   ├── AcceptInvite.tsx    # Moderator invite acceptance
│   ├── ProtectedRoute.tsx  # Auth guard wrapper
│   ├── PublicRoute.tsx     # Guest-only route wrapper
│   ├── MobileNavigation.tsx # Mobile navigation drawer
│   └── SEO.tsx             # SEO Helmet wrapper
├── hooks/                  # Custom React hooks
│   ├── use-language.tsx    # Multi-language system (10 languages)
│   ├── use-page-title.ts   # Dynamic page title & favicon
│   ├── use-api.ts          # API integration hooks
│   ├── use-dashboard-loading.ts # Dashboard loading states
│   ├── use-error-tracking.ts # Error tracking & reporting
│   ├── use-mobile.ts       # Mobile detection hook
│   ├── use-scroll-animation.ts # Scroll-based animations
│   ├── use-toast.ts        # Toast notification hook
│   └── useSellAuthEmbed.ts # SellAuth embed integration
├── lib/                    # Utility modules
│   ├── api-client.ts       # Typed API client with auth
│   ├── auth-utils.ts       # Auth utilities (token mgmt, OAuth)
│   ├── auth-utils-enhanced.ts # Enhanced auth utilities
│   ├── seo-config.ts       # SEO/site configuration
│   ├── seo-routes.ts       # Per-route SEO configurations
│   ├── structured-data.ts  # JSON-LD schema generators
│   ├── configuration-manager.ts # Config state management hook
│   ├── pricing-config.ts   # Pricing plans & payment config
│   ├── route-config.ts     # Route configuration
│   ├── dashboard-data.ts   # Dashboard data helpers
│   ├── oauth-handler.ts    # OAuth flow handler
│   ├── manual-oauth.ts     # Manual OAuth implementation
│   ├── copy-utils.ts       # Clipboard utilities
│   ├── utils.ts            # General utilities (cn, etc.)
│   └── utils.spec.ts       # Utility tests
├── contexts/               # React contexts
│   └── AuthContext.tsx     # Authentication context
├── App.tsx                 # Root component with routing
└── global.css              # TailwindCSS theme + custom styles
```

## Routing

Defined in `client/App.tsx` using `BrowserRouter` from React Router 6.

### Route Table

| Path                                     | Component                         | Access        | Layout          |
| ---------------------------------------- | --------------------------------- | ------------- | --------------- |
| `/`                                      | `HomePage`                        | Public        | None            |
| `/tos`                                   | `TermsOfService`                  | Public        | None            |
| `/privacy`                               | `PrivacyPolicy`                   | Public        | None            |
| `/invite`                                | `AcceptInvite`                    | Public        | None            |
| `/auth/signin`                           | `SignIn`                          | Guest only    | None            |
| `/auth/signup`                           | `SignUp`                          | Guest only    | None            |
| `/auth/forgot-password`                  | `ForgotPassword`                  | Guest only    | None            |
| `/auth/google/callback`                  | `GoogleAuthCallback`              | Public        | None            |
| `/auth/oauth/callback`                   | `OAuthJsonCallback`               | Public        | None            |
| `/dashboard`                             | Redirect to `/dashboard/overview` | Auth required | None            |
| `/dashboard/overview`                    | `GeneralDashboard`                | Auth required | DashboardLayout |
| `/dashboard/server/:serverId`            | `DashboardContent`                | Auth required | DashboardLayout |
| `/dashboard/server/:serverId/players`    | `PlayersPage`                     | Auth required | DashboardLayout |
| `/dashboard/server/:serverId/bans`       | `BansPage`                        | Auth required | DashboardLayout |
| `/dashboard/server/:serverId/config`     | `AntiCheatConfigurationPage`      | Auth required | DashboardLayout |
| `/dashboard/server/:serverId/moderators` | `ModeratorsPage`                  | Auth required | DashboardLayout |
| `/dashboard/server/:serverId/logs`       | `AuditLogsPage`                   | Auth required | DashboardLayout |
| `/dashboard/server/:serverId/streams`    | `MultiStreamPage`                 | Auth required | DashboardLayout |
| `/dashboard/news`                        | `NewsPage`                        | Auth required | DashboardLayout |
| `/dashboard/changelogs`                  | `ChangelogsPage`                  | Auth required | DashboardLayout |
| `/dashboard/download`                    | `DownloadPage`                    | Auth required | DashboardLayout |
| `/dashboard/subscriptions`               | `SubscriptionsPage`               | Auth required | DashboardLayout |
| `/dashboard/redeem`                      | `RedeemPage`                      | Auth required | DashboardLayout |
| `/dashboard/support`                     | `SupportPage`                     | Auth required | DashboardLayout |
| `/dashboard/docs`                        | `DocumentationPage`               | Auth required | DashboardLayout |
| `/dashboard/streams`                     | `MultiStreamPage`                 | Auth required | DashboardLayout |
| `*`                                      | `NotFound`                        | Public        | None            |

### Route Protection

- **`ProtectedRoute`** — Checks JWT token in localStorage. Redirects to `/auth/signin` if not authenticated.
- **`PublicRoute`** — Redirects authenticated users to `/dashboard/overview` to prevent accessing sign-in/sign-up pages while logged in.

### DashboardLayout

Wraps all dashboard pages with:

- `AtomicSidebar` — Fixed left sidebar with navigation links
- `MobileNavigation` — Bottom navigation bar on mobile
- Main content area with responsive padding

## Styling

### TailwindCSS Theme

Defined in `client/global.css` using CSS custom properties:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... light theme variables ... */
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark theme variables ... */
  }
}
```

Custom colors: `sidebar-*`, `success`, `warning` — all theme-aware via CSS variables.

### cn() Utility

Combines `clsx` and `tailwind-merge` for conditional class merging:

```typescript
import { cn } from '@/lib/utils';
className={cn('base-class', { 'conditional': condition }, className)}
```

### shadcn/ui Components

51 pre-built UI components in `client/components/ui/`:

- Layout: Accordion, Card, Sheet, Sidebar, Resizable, ScrollArea
- Forms: Button, Input, Select, Checkbox, RadioGroup, Switch, Textarea, Slider, Label, Form
- Feedback: Toast, Toaster, Sonner, Alert, AlertDialog, Skeleton, Progress
- Navigation: DropdownMenu, NavigationMenu, Menubar, Breadcrumb, Tabs, Pagination
- Data Display: Table, Badge, Avatar, Calendar, Chart, Carousel, Command
- Overlays: Dialog, Drawer, Popover, HoverCard, Tooltip, ContextMenu, Collapsible
- Utilities: Separator, Toggle, ToggleGroup, AspectRatio, InputOTP

## Hooks

### use-language (LanguageProvider)

Provides `t()` translation function and language switching across 10 languages. Translations stored in `TRANSLATIONS` map with per-language string dictionaries.

### use-api()

Provides React Query wrappers for all API endpoints with caching, loading, and error states.

### use-page-title

Dynamically sets document title and favicon based on route. Integrates with SEO Helmet.

### use-toast

Toast notification system (wraps sonner library).

## Providers

Providers wrap the entire app in `App.tsx`:

```
HelmetProvider         ← react-helmet-async for SEO
  QueryClientProvider  ← TanStack Query
    AuthProvider       ← Auth context (JWT management)
      LanguageProvider ← i18n context
        TooltipProvider ← Radix UI tooltips
          Toaster/Sonner ← Toast components
            BrowserRouter ← React Router
```

## API Client

`lib/api-client.ts` provides a typed API client with:

- **`apiRequest<T>()`** — Generic fetch wrapper with JWT Bearer token injection
- **`authManager`** — Token persistence in localStorage
- **Auto-redirect** on 401 responses — dispatches `auth-logout` event and redirects to sign-in
- **`buildQueryString()`** — URL search params builder
- Module-specific API objects: `authApi`, `playersApi`, `bansApi`, `serversApi`, `configApi`, etc.
- Combined `api` object exporting all modules
