import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface GoogleSignInButtonProps {
  redirectPath?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  disabled?: boolean;
  onAuthStart?: () => void;
  onAuthComplete?: (user: any) => void;
  onAuthError?: (error: string) => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  redirectPath = "/dashboard/overview",
  className = "",
  size = "lg",
  variant = "default",
  disabled = false,
  onAuthStart,
  onAuthComplete,
  onAuthError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");
      const state = urlParams.get("state");

      // Only handle callback if we're on the callback route
      if (location.pathname === "/auth/google/callback") {
        if (error) {
          const errorMessage = `Google authentication failed: ${error}`;
          setError(errorMessage);
          onAuthError?.(errorMessage);
          return;
        }

        if (code) {
          try {
            setIsLoading(true);

            // Exchange code for token
            const response = await fetch(`/api/auth/google/callback`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code,
                redirect_uri: `${window.location.origin}/auth/google/callback`,
              }),
            });

            if (!response.ok) {
              throw new Error(`Authentication failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.token) {
              // Store token in localStorage
              localStorage.setItem("token", data.token);
              if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
              }

              // Clear URL parameters
              window.history.replaceState(
                {},
                document.title,
                window.location.pathname,
              );

              // Call completion callback
              onAuthComplete?.(data.user);

              // Get redirect path from state or use prop
              const finalRedirectPath = state
                ? decodeURIComponent(state)
                : redirectPath;

              // Redirect to final destination
              navigate(finalRedirectPath, { replace: true });
            } else {
              throw new Error(data.message || "Authentication failed");
            }
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "Authentication failed";
            setError(errorMessage);
            onAuthError?.(errorMessage);
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    handleCallback();
  }, [location, navigate, redirectPath, onAuthComplete, onAuthError]);

  const handleGoogleSignIn = () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      onAuthStart?.();

      // Construct the Google OAuth URL using relative path
      const redirectUri = encodeURIComponent(
        `${window.location.origin}/auth/google/callback`,
      );
      const state = encodeURIComponent(redirectPath);

      const googleAuthUrl = `/api/auth/google/login?redirect=${redirectUri}&state=${state}`;

      // Redirect to Google OAuth
      window.location.href = googleAuthUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to initiate Google authentication";
      setError(errorMessage);
      onAuthError?.(errorMessage);
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <div className="relative flex items-center justify-center">
          <div className="w-4 h-4 mr-3 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
          <span className="font-medium">Connecting...</span>
        </div>
      );
    }

    return (
      <div className="relative flex items-center justify-center">
        <div className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </div>
        <span className="font-medium">Continue with Google</span>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={disabled || isLoading}
        size={size}
        className={`group w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        {getButtonContent()}
      </Button>

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <div className="flex items-start space-x-2">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;
