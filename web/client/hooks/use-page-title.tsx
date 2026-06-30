import { useEffect } from "react";

/**
 * Hook to set page title with AtomicShield branding format
 * @param title - The page-specific title (e.g., "Dashboard", "Bans", etc.)
 */
export function usePageTitle(title?: string) {
  useEffect(() => {
    const baseTitle = "AtomicShield";
    const fullTitle = title ? `${baseTitle} | ${title}` : baseTitle;

    document.title = fullTitle;

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
}

/**
 * Hook to set favicon with AtomicShield logo
 */
export function useFavicon() {
  useEffect(() => {
    // Set favicon to AtomicShield logo
    const favicon = document.querySelector(
      "link[rel*='icon']",
    ) as HTMLLinkElement;
    if (favicon) {
      // Use the AtomicShield logo from CDN as favicon
      favicon.href =
        "https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=32";
    } else {
      // Create favicon if it doesn't exist
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.type = "image/webp";
      newFavicon.href =
        "https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=32";
      document.head.appendChild(newFavicon);
    }
  }, []);
}
