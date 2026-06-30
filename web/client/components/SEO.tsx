import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { siteConfig, defaultSeoConfig, SeoConfig } from '@/lib/seo-config';

interface SEOProps extends SeoConfig {
  children?: React.ReactNode;
}

export function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = [],
  robots,
  hreflang = [],
  schemaData,
  children
}: SEOProps) {
  const location = useLocation();
  
  // Build full title with suffix
  const titleSuffix = ' | AtomicShield — FiveM Anti‑Cheat';
  const fullTitle = title ? `${title}${titleSuffix}` : siteConfig.title;
  
  // Use provided description or default
  const metaDescription = description || defaultSeoConfig.description;
  
  // Build canonical URL
  const currentUrl = siteConfig.url + location.pathname;
  const canonicalUrl = canonical || currentUrl.endsWith('/') ? currentUrl : currentUrl + '/';
  
  // OG Image - use provided or default
  const ogImageUrl = ogImage || `${siteConfig.url}${siteConfig.images.ogDefault}`;
  
  // Keywords string
  const keywordsString = [...siteConfig.keywords, ...keywords].join(', ');
  
  // Robots directive
  const robotsDirective = robots || defaultSeoConfig.robots;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={siteConfig.author} />
      <meta name="robots" content={robotsDirective} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:site" content={siteConfig.social.twitter} />
      <meta name="twitter:creator" content={siteConfig.social.twitter} />
      
      {/* Favicons and Icons */}
      <link rel="icon" type="image/webp" sizes="16x16" href={siteConfig.images.favicon16} />
      <link rel="icon" type="image/webp" sizes="32x32" href={siteConfig.images.favicon32} />
      <link rel="apple-touch-icon" sizes="180x180" href={siteConfig.images.favicon180} />
      <link rel="icon" type="image/png" sizes="192x192" href={siteConfig.images.androidChrome192} />
      <link rel="icon" type="image/png" sizes="512x512" href={siteConfig.images.androidChrome512} />
      
      {/* Theme and Manifest */}
      <meta name="theme-color" content={siteConfig.theme.color} />
      <meta name="msapplication-TileColor" content={siteConfig.theme.color} />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      {hreflang.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://cdn.builder.io" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* JSON-LD Structured Data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
      
      {/* Custom head elements */}
      {children}
    </Helmet>
  );
}

// Helper component for JSON-LD
export function JsonLd({ data }: { data: any }) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
