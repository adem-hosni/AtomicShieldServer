import { useState, useCallback } from "react";

interface ErrorDetails {
  message: string;
  code?: string | number;
  context?: string;
  timestamp: Date;
  additionalInfo?: string;
  originalError?: Error;
}

interface UseErrorTrackingReturn {
  error: ErrorDetails | null;
  setError: (
    error: string | Error | null,
    context?: string,
    additionalInfo?: string,
  ) => void;
  clearError: () => void;
  hasError: boolean;
}

/**
 * Enhanced error tracking hook that captures detailed error information
 * for better debugging and user experience
 */
export function useErrorTracking(): UseErrorTrackingReturn {
  const [error, setErrorState] = useState<ErrorDetails | null>(null);

  const setError = useCallback(
    (
      errorInput: string | Error | null,
      context?: string,
      additionalInfo?: string,
    ) => {
      if (!errorInput) {
        setErrorState(null);
        return;
      }

      const timestamp = new Date();

      if (typeof errorInput === "string") {
        // Extract error code from common error patterns
        let code: string | number | undefined;
        const httpMatch = errorInput.match(/HTTP error! status: (\d+)/);
        const statusMatch = errorInput.match(/status: (\d+)/);

        if (httpMatch) {
          code = parseInt(httpMatch[1]);
        } else if (statusMatch) {
          code = parseInt(statusMatch[1]);
        }

        setErrorState({
          message: errorInput,
          code,
          context,
          timestamp,
          additionalInfo,
        });
      } else if (errorInput instanceof Error) {
        // Extract more details from Error objects
        let code: string | number | undefined;

        // Check for HTTP status codes in error messages
        const httpMatch = errorInput.message.match(/HTTP error! status: (\d+)/);
        const statusMatch = errorInput.message.match(/status: (\d+)/);

        if (httpMatch) {
          code = parseInt(httpMatch[1]);
        } else if (statusMatch) {
          code = parseInt(statusMatch[1]);
        }

        // Check for specific error types
        if (
          errorInput.name === "TypeError" &&
          errorInput.message.includes("fetch")
        ) {
          code = "NETWORK_ERROR";
          additionalInfo =
            additionalInfo ||
            "Network request failed - check your internet connection";
        }

        setErrorState({
          message: errorInput.message,
          code,
          context,
          timestamp,
          additionalInfo,
          originalError: errorInput,
        });
      }

      // Log error for debugging (only in development)
      if (import.meta.env.DEV) {
        console.error("Error tracked:", {
          error: errorInput,
          context,
          additionalInfo,
          timestamp,
          stack: errorInput instanceof Error ? errorInput.stack : undefined,
        });
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  return {
    error,
    setError,
    clearError,
    hasError: error !== null,
  };
}

/**
 * Helper function to extract user-friendly error messages from API responses
 */
export function formatApiError(
  response: any,
  fallbackMessage = "An unexpected error occurred",
): string {
  if (response?.error) {
    return response.error;
  }

  if (response?.message) {
    return response.message;
  }

  if (typeof response === "string") {
    return response;
  }

  return fallbackMessage;
}

/**
 * Helper function to determine if an error is network-related
 */
export function isNetworkError(error: string | Error): boolean {
  const message = error instanceof Error ? error.message : error;
  const lowercaseMessage = message.toLowerCase();

  return (
    lowercaseMessage.includes("fetch") ||
    lowercaseMessage.includes("network") ||
    lowercaseMessage.includes("connection") ||
    lowercaseMessage.includes("cors") ||
    lowercaseMessage.includes("timeout")
  );
}

/**
 * Helper function to determine if an error is authentication-related
 */
export function isAuthError(error: string | Error): boolean {
  const message = error instanceof Error ? error.message : error;
  const lowercaseMessage = message.toLowerCase();

  return (
    lowercaseMessage.includes("authentication") ||
    lowercaseMessage.includes("unauthorized") ||
    lowercaseMessage.includes("401") ||
    lowercaseMessage.includes("login") ||
    lowercaseMessage.includes("sign in")
  );
}

/**
 * Helper function to determine error severity
 */
export function getErrorSeverity(
  error: string | Error,
): "low" | "medium" | "high" | "critical" {
  const message = error instanceof Error ? error.message : error;
  const lowercaseMessage = message.toLowerCase();

  if (
    lowercaseMessage.includes("authentication") ||
    lowercaseMessage.includes("unauthorized")
  ) {
    return "high";
  }

  if (lowercaseMessage.includes("server") || lowercaseMessage.includes("500")) {
    return "critical";
  }

  if (
    lowercaseMessage.includes("network") ||
    lowercaseMessage.includes("connection")
  ) {
    return "medium";
  }

  if (
    lowercaseMessage.includes("not found") ||
    lowercaseMessage.includes("404")
  ) {
    return "medium";
  }

  return "low";
}
