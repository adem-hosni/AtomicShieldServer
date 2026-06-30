# SEO Strategy

## Overview

AtomicShield implements a comprehensive SEO strategy using structured data (JSON-LD), Open Graph tags, Twitter Cards, per-route metadata, and proper crawl configuration. All SEO management is centralized through `lib/seo-config.ts`, `lib/seo-routes.ts`, and the `components/SEO.tsx` Helmet wrapper.

## Architecture

```
lib/seo-config.ts         ← Site-wide defaults (name, domain, URLs, social links, images)
lib/seo-routes.ts          ← Per-route SEO configurations
lib/structured-data.ts     ← JSON-LD schema generators
components/SEO.tsx         ← React Helmet wrapper component
public/robots.txt          ← Crawler directives
public/site.webmanifest    ← PWA manifest
```

## Per-Route SEO Configuration

Defined in `lib/seo-routes.ts` with route-specific `SeoConfig` objects:

| Route         | Title Focus                                             | Keywords                                          | Schema Type                    |
| ------------- | ------------------------------------------------------- | ------------------------------------------------- | ------------------------------ |
| `/`           | Product homepage — "The Most Advanced FiveM Anti-Cheat" | FiveM anti cheat, gta v roleplay anti cheat       | Organization, Website, Product |
| `/features`   | Feature showcase                                        | manual map dll detection, memory scanner fivem    | FAQ                            |
| `/pricing`    | Pricing plans                                           | fivem anti cheat pricing, anti cheat cost         | Product                        |
| `/detections` | Live detection feed                                     | fivem ban activity, cheat detections              | None                           |
| `/docs`       | Documentation/guides                                    | fivem anti cheat setup, atomicshield installation | HowTo (6-step guide)           |
| `/blog`       | News & updates                                          | fivem security news, anti cheat updates           | None                           |
| `/dashboard`  | Server management                                       | server dashboard, ban management                  | None (noindex)                 |
| `/tos`        | Terms of Service                                        | terms of service, legal terms                     | None                           |
| `/privacy`    | Privacy Policy                                          | privacy policy, data protection                   | None                           |
| `/demo`       | Live demo booking                                       | anti cheat demo, book demo                        | None                           |
| `/support`    | Help & support                                          | technical support, help center                    | None                           |

## Structured Data (JSON-LD)

All schemas generated in `lib/structured-data.ts`:

### Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AtomicShield",
  "url": "https://atomicshield.com",
  "logo": "...",
  "sameAs": ["GitHub", "Twitter/X", "Discord", "YouTube"],
  "contactPoint": { "email": "support@atomicshield.com" }
}
```

### Website Schema (with SearchAction)

Enables Google Sitelinks Search Box for direct site search from SERP.

### Product/SoftwareApplication Schema

Marks AtomicShield as both `Product` and `SoftwareApplication` with:

- Application category: `SecurityApplication`
- Operating system: Windows
- Three offers (Starter $29.99, Pro $59.99, Locked $199.99)
- Aggregate rating (4.8/5, 127 reviews)
- Sample review

### FAQ Schema

Used on `/features` page with 3 Q&A pairs about:

- Manual-map DLL detection
- Memory scanning
- Loader obfuscation

### HowTo Schema

Used on `/docs` page with 6-step installation guide:

1. Download AtomicShield
2. Extract Files
3. Configure License
4. Update server.cfg
5. Start Server
6. Test Protection

### Article Schema

Generator function `createArticleSchema()` for blog/news posts with author, publisher, and date metadata.

### Breadcrumb Schema

Generator function `createBreadcrumbSchema()` for navigation breadcrumbs.

### LocalBusiness Schema

Pre-configured for physical business presence with address, coordinates, hours, and price range.

## Meta Tags

Implemented via `react-helmet-async` in `components/SEO.tsx`:

| Tag                                   | Source                                         |
| ------------------------------------- | ---------------------------------------------- |
| `<title>`                             | Route config or site default                   |
| `<meta name="description">`           | Route config or site default                   |
| `<meta name="keywords">`              | Route config keywords array                    |
| `<meta name="robots">`                | Route config (dashboard is `noindex,follow`)   |
| `<meta property="og:title">`          | Route config title                             |
| `<meta property="og:description">`    | Route config description                       |
| `<meta property="og:image">`          | Route config OG image                          |
| `<meta property="og:type">`           | Route config (`website`, `article`, `product`) |
| `<meta name="twitter:card">`          | Site default (`summary_large_image`)           |
| `<link rel="canonical">`              | Route config canonical URL                     |
| `<script type="application/ld+json">` | Route config schema data                       |
| `<html lang="...">`                   | Current language from LanguageProvider         |

## Site Configuration

Defined in `lib/seo-config.ts`:

```typescript
interface SiteConfig {
  name: string; // "AtomicShield"
  domain: string; // "atomicshield.com"
  url: string; // "https://atomicshield.com"
  title: string; // Default page title
  description: string; // Default meta description
  author: string; // "AtomicShield Team"
  keywords: string[]; // 12 primary keywords
  social: { twitter; github; discord; youtube };
  images: { logo; ogDefault; favicons };
  theme: { color; backgroundColor };
  pricing: { starter; pro; locked };
}
```

## Routes with Structured Data

| Route       | Schema(s)                          |
| ----------- | ---------------------------------- |
| `/`         | `[Organization, Website, Product]` |
| `/features` | `[FAQPage]`                        |
| `/pricing`  | `[Product]`                        |
| `/docs`     | `[HowTo]`                          |
| `/blog`     | `[Article]` per post               |

## Robots & Crawling

`public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://atomicshield.com/sitemap.xml
```

The dashboard route is set to `noindex,follow` to prevent admin pages from appearing in search results.

## Images & Icons

| Asset              | Path/URL                          |
| ------------------ | --------------------------------- |
| Default OG Image   | `/og/og-atomicshield-default.png` |
| Logo               | Builder.io CDN URL                |
| Favicon 16×16      | Builder.io CDN (16px)             |
| Favicon 32×32      | Builder.io CDN (32px)             |
| Apple Touch Icon   | Builder.io CDN (180px)            |
| Android Chrome 192 | Builder.io CDN (192px)            |
| Android Chrome 512 | Builder.io CDN (512px)            |

## Key SEO Keywords

Primary keyword targets (from `siteConfig.keywords`):

- FiveM anti cheat
- fivem anti-cheat
- gta v roleplay anti cheat
- manual map dll detection
- memory scanner fivem
- loader obfuscation
- fingerprint anti cheat
- exploit trap
- shared ban network
- best fivem anti cheat
- stop fivem cheaters
- protect fivem server
