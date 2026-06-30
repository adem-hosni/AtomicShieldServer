# UI Component Library

## Overview

AtomicShield uses **shadcn/ui** — a collection of re-usable components built on **Radix UI** primitives and styled with **TailwindCSS**. Components are located in `client/components/ui/` and are designed to be copied, customized, and composed.

## Component Count

- **UI primitives (shadcn/ui):** 51 files in `client/components/ui/`
- **Custom dashboard components:** 25+ files in `client/components/`
- **Page components:** 13 files in `client/pages/`

## shadcn/ui Components

All located in `client/components/ui/`:

### Layout

| Component         | Description                                       |
| ----------------- | ------------------------------------------------- |
| `accordion.tsx`   | Collapsible content sections with Radix Accordion |
| `card.tsx`        | Content container with header, content, footer    |
| `sheet.tsx`       | Slide-out panel from any edge (Radix Dialog)      |
| `sidebar.tsx`     | Application sidebar navigation                    |
| `resizable.tsx`   | Drag-to-resize panels                             |
| `scroll-area.tsx` | Custom scrollable container (Radix ScrollArea)    |
| `separator.tsx`   | Visual divider line                               |

### Navigation

| Component             | Description                                    |
| --------------------- | ---------------------------------------------- |
| `breadcrumb.tsx`      | Navigation breadcrumb trail                    |
| `dropdown-menu.tsx`   | Contextual dropdown menus (Radix DropdownMenu) |
| `menubar.tsx`         | Horizontal menu bar (Radix Menubar)            |
| `navigation-menu.tsx` | Responsive navigation (Radix NavigationMenu)   |
| `pagination.tsx`      | Page navigation with prev/next                 |
| `tabs.tsx`            | Tabbed content switching (Radix Tabs)          |

### Forms & Inputs

| Component          | Description                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| `button.tsx`       | Button with variants (default, destructive, outline, secondary, ghost, link) and sizes |
| `checkbox.tsx`     | Checkbox input (Radix Checkbox)                                                        |
| `form.tsx`         | Form with validation (react-hook-form integration)                                     |
| `input.tsx`        | Text input field                                                                       |
| `input-otp.tsx`    | One-time password input                                                                |
| `label.tsx`        | Form label (Radix Label)                                                               |
| `radio-group.tsx`  | Radio button group (Radix RadioGroup)                                                  |
| `select.tsx`       | Dropdown select (Radix Select)                                                         |
| `slider.tsx`       | Range slider (Radix Slider)                                                            |
| `switch.tsx`       | Toggle switch (Radix Switch)                                                           |
| `textarea.tsx`     | Multi-line text input                                                                  |
| `toggle.tsx`       | On/off toggle button (Radix Toggle)                                                    |
| `toggle-group.tsx` | Group of toggle buttons (Radix ToggleGroup)                                            |

### Feedback

| Component          | Description                                       |
| ------------------ | ------------------------------------------------- |
| `alert.tsx`        | Alert message with variant (default, destructive) |
| `alert-dialog.tsx` | Confirmation dialog (Radix AlertDialog)           |
| `progress.tsx`     | Progress bar (Radix Progress)                     |
| `skeleton.tsx`     | Loading placeholder                               |
| `sonner.tsx`       | Sonner toast library integration                  |
| `toast.tsx`        | Toast notification (Radix Toast)                  |
| `toaster.tsx`      | Toast container                                   |

### Overlays

| Component          | Description                                    |
| ------------------ | ---------------------------------------------- |
| `dialog.tsx`       | Modal dialog (Radix Dialog)                    |
| `drawer.tsx`       | Bottom drawer (VAul)                           |
| `hover-card.tsx`   | Hover-triggered popover (Radix HoverCard)      |
| `popover.tsx`      | Click-triggered popover (Radix Popover)        |
| `tooltip.tsx`      | Hover tooltip (Radix Tooltip)                  |
| `context-menu.tsx` | Right-click context menu (Radix ContextMenu)   |
| `collapsible.tsx`  | Expandable content section (Radix Collapsible) |

### Data Display

| Component      | Description                              |
| -------------- | ---------------------------------------- |
| `avatar.tsx`   | User avatar with fallback (Radix Avatar) |
| `badge.tsx`    | Status badge/label                       |
| `calendar.tsx` | Date picker calendar (react-day-picker)  |
| `chart.tsx`    | Recharts chart wrapper                   |
| `carousel.tsx` | Image/content carousel                   |
| `command.tsx`  | Command palette (cmdk)                   |
| `table.tsx`    | Data table with header/body/row          |

### Utilities

| Component          | Description                                      |
| ------------------ | ------------------------------------------------ |
| `aspect-ratio.tsx` | Fixed aspect ratio container (Radix AspectRatio) |

## Custom Dashboard Components

Located in `client/components/`:

### Navigation

| Component              | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `AtomicSidebar.tsx`    | Fixed left sidebar with nav links, server list, user menu |
| `MobileNavigation.tsx` | Mobile-responsive bottom navigation drawer                |

### Dashboard

| Component                   | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| `DashboardContent.tsx`      | Dynamic content loader for server-specific dashboard           |
| `DashboardOverview.tsx`     | Dashboard overview panel                                       |
| `GeneralDashboard.tsx`      | Global dashboard with stats cards, activity, threat assessment |
| `SimpleServerDashboard.tsx` | Individual server dashboard view                               |

### Feature Pages

| Component                        | Description                                                       |
| -------------------------------- | ----------------------------------------------------------------- |
| `BansPage.tsx`                   | Ban management with table, search, filter, pagination             |
| `PlayersPage.tsx`                | Online player list with actions (kick, ban, screenshot)           |
| `AuditLogsPage.tsx`              | Audit log viewer with severity filters                            |
| `ModeratorsPage.tsx`             | Moderator management with invite system                           |
| `AntiCheatConfigurationPage.tsx` | Dynamic anti-cheat configuration UI with drag-and-drop categories |
| `NewsPage.tsx`                   | News feed with categories                                         |
| `ChangelogsPage.tsx`             | Changelog viewer with version filter                              |
| `DownloadPage.tsx`               | Software download center                                          |
| `SubscriptionsPage.tsx`          | Subscription plan management                                      |
| `RedeemPage.tsx`                 | License key redemption                                            |
| `SupportPage.tsx`                | Help/support interface                                            |
| `DocumentationPage.tsx`          | In-app documentation viewer                                       |
| `MultiStreamPage.tsx`            | Multi-player stream viewer                                        |
| `AcceptInvite.tsx`               | Moderator invite page                                             |

### Utilities

| Component            | Description                                           |
| -------------------- | ----------------------------------------------------- |
| `ProtectedRoute.tsx` | Auth guard — redirects to sign-in if unauthenticated  |
| `PublicRoute.tsx`    | Guest guard — redirects to dashboard if authenticated |
| `SEO.tsx`            | React Helmet wrapper for per-page SEO metadata        |

### Custom UI Components

(Not in `ui/` folder but custom-built)

| Component                     | Description                                |
| ----------------------------- | ------------------------------------------ |
| `dashboard-error.tsx`         | Dashboard error state display              |
| `enhanced-loading.tsx`        | Enhanced loading animation                 |
| `server-status-indicator.tsx` | Server online/offline indicator with pulse |

## Styling Conventions

All components use the `cn()` utility from `lib/utils.ts` for conditional class merging:

```typescript
import { cn } from "@/lib/utils";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

Usage pattern:

```typescript
className={cn(
  "base-styles",
  variant === "destructive" && "bg-destructive text-destructive-foreground",
  size === "lg" && "h-11 px-8",
  className // Allow consumer overrides
)}
```

## Theme

Components use CSS custom properties defined in `client/global.css`:

- `--background`, `--foreground` — Page background and text
- `--primary`, `--primary-foreground` — Primary brand color
- `--secondary`, `--secondary-foreground` — Secondary color
- `--destructive`, `--destructive-foreground` — Error/danger
- `--muted`, `--muted-foreground` — Subtle text
- `--accent`, `--accent-foreground` — Accent color
- `--card`, `--card-foreground` — Card backgrounds
- `--border` — Border color
- `--ring` — Focus ring color
- `--sidebar-*` — Sidebar-specific colors
- `--success`, `--warning` — Status colors
- `--radius` — Border radius

Dark mode is enabled by default via the `dark` class on the document.
