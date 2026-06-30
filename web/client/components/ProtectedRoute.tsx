import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth/signin",
}) => {
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const location = useLocation();
  const [isCheckingOAuth, setIsCheckingOAuth] = useState(true);

  // Check for OAuth parameters on mount
  useEffect(() => {
    const checkOAuthParams = () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      const userParam = urlParams.get("user");

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));

          // Sign in with OAuth data
          signIn(token, user);

          // Clear URL parameters
          window.history.replaceState({}, document.title, location.pathname);
        } catch (error) {
          console.error("Failed to parse OAuth callback data:", error);
          // Clear any malformed data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setIsCheckingOAuth(false);
    };

    checkOAuthParams();
  }, [location.search, signIn, location.pathname]);

  // Show enhanced loading spinner while checking authentication or OAuth
  if (isLoading || isCheckingOAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div
            className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px]"
            style={{
              animation: "slide 20s linear infinite",
            }}
          />
        </div>

        <div className="flex flex-col items-center space-y-6 relative z-10">
          {/* Enhanced loading spinner */}
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary/20 border-t-primary"></div>
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10"></div>
            <div className="absolute inset-2 animate-ping rounded-full bg-primary/20"></div>
          </div>

          {/* Loading text with typewriter effect */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              AtomicShield
            </h2>
            <p className="text-sm text-muted-foreground animate-pulse">
              {isCheckingOAuth
                ? "Processing authentication..."
                : "Checking authentication..."}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to sign in page with return URL
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};
