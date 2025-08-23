import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    triggerOnce = true,
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true); // Always start visible

  // Simplified approach - just return visible state
  return { elementRef, isVisible: true }; // Always return visible for now
}

// Helper function to get animation classes based on visibility
export function getScrollAnimationClasses(
  isVisible: boolean,
  animationType:
    | "fade-in"
    | "slide-in-left"
    | "slide-in-right"
    | "slide-in-bottom"
    | "zoom-in" = "fade-in",
  duration: "300" | "500" | "700" | "1000" = "700",
  delay?: string,
) {
  // Simplified approach - always return visible classes
  const baseClasses = "transition-all";
  const durationClass = `duration-${duration}`;
  const delayClass = delay ? `delay-${delay}` : "";

  // Always ensure elements are fully visible
  return `${baseClasses} ${durationClass} ${delayClass} opacity-100 translate-x-0 translate-y-0 scale-100`;
}
