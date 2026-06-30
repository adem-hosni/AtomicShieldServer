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
        "https://media.discordapp.net/attachments/1358161868450959550/1416397323122249858/atomic-removebg-preview_2_2.png?ex=68c6b24d&is=68c560cd&hm=4385610f35744f1ce4d7958878852d98c4a3b68df11f9e48ab200f1d8562bc3f&=&format=webp&quality=lossless&width=40&height=40";
    } else {
      // Create favicon if it doesn't exist
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.type = "image/webp";
      newFavicon.href =
        "https://media.discordapp.net/attachments/1358161868450959550/1416397323122249858/atomic-removebg-preview_2_2.png?ex=68c6b24d&is=68c560cd&hm=4385610f35744f1ce4d7958878852d98c4a3b68df11f9e48ab200f1d8562bc3f&=&format=webp&quality=lossless&width=40&height=40";
      document.head.appendChild(newFavicon);
    }
  }, []);
}
