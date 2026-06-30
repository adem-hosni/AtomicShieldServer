import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/dashboard/overview",
  redirectIfAuthenticated = false,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated and we should redirect authenticated users
  if (isAuthenticated && redirectIfAuthenticated) {
    // Check if there's a return URL from the location state
    const returnUrl = location.state?.from || redirectTo;
    return <Navigate to={returnUrl} replace />;
  }

  // Render the public content
  return <>{children}</>;
};
