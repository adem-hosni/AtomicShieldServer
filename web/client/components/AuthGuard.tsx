import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/auth/signin",
}) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Re-check auth status when component mounts
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      // Store the current location for redirect after sign in
      navigate(redirectTo, {
        state: { from: location.pathname + location.search },
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, requireAuth, navigate, redirectTo, location]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-lg font-medium">Authenticating...</p>
          <p className="text-sm text-muted-foreground">
            Please wait while we verify your session
          </p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, show nothing
  // (navigation will be handled by useEffect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
