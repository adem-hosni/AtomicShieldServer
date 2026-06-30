import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Wifi,
  Server,
  Key,
  Clock,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardErrorProps {
  error: string | Error;
  errorCode?: string | number;
  onRetry?: () => void;
  retryLabel?: string;
  showHomeButton?: boolean;
  context?: "dashboard" | "server" | "auth" | "network";
  timestamp?: Date;
  additionalInfo?: string;
}

export const DashboardError: React.FC<DashboardErrorProps> = ({
  error,
  errorCode,
  onRetry,
  retryLabel = "Retry",
  showHomeButton = true,
  context = "dashboard",
  timestamp,
  additionalInfo,
}) => {
  const errorMessage = error instanceof Error ? error.message : error;

  // Determine error type and styling based on context and error message
  const getErrorDetails = () => {
    const lowercaseError = errorMessage.toLowerCase();

    if (
      lowercaseError.includes("authentication") ||
      lowercaseError.includes("unauthorized") ||
      errorCode === 401
    ) {
      return {
        type: "Authentication Error",
        icon: <Key className="h-8 w-8 text-yellow-500" />,
        color: "yellow",
        description: "Your session has expired or authentication is required.",
        suggestions: [
          "Sign in again",
          "Check your credentials",
          "Contact support if issues persist",
        ],
      };
    }

    if (
      lowercaseError.includes("network") ||
      lowercaseError.includes("fetch") ||
      lowercaseError.includes("connection")
    ) {
      return {
        type: "Network Error",
        icon: <Wifi className="h-8 w-8 text-blue-500" />,
        color: "blue",
        description: "Unable to connect to the server.",
        suggestions: [
          "Check your internet connection",
          "Try again in a moment",
          "Verify server status",
        ],
      };
    }

    if (
      lowercaseError.includes("server") ||
      errorCode === 500 ||
      errorCode === 502 ||
      errorCode === 503
    ) {
      return {
        type: "Server Error",
        icon: <Server className="h-8 w-8 text-red-500" />,
        color: "red",
        description: "The server is experiencing issues.",
        suggestions: [
          "Try again in a few moments",
          "Check server status",
          "Contact support if persistent",
        ],
      };
    }

    if (lowercaseError.includes("forbidden") || errorCode === 403) {
      return {
        type: "Access Denied",
        icon: <ShieldAlert className="h-8 w-8 text-orange-500" />,
        color: "orange",
        description: "You don't have permission to access this resource.",
        suggestions: [
          "Check your permissions",
          "Contact your administrator",
          "Verify server access",
        ],
      };
    }

    if (lowercaseError.includes("not found") || errorCode === 404) {
      return {
        type: "Resource Not Found",
        icon: <AlertCircle className="h-8 w-8 text-purple-500" />,
        color: "purple",
        description: "The requested data could not be found.",
        suggestions: [
          "Check if the server exists",
          "Verify the URL",
          "Try refreshing the page",
        ],
      };
    }

    // Default error
    return {
      type: "Unexpected Error",
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      color: "red",
      description: "An unexpected error occurred.",
      suggestions: [
        "Try refreshing the page",
        "Check your connection",
        "Contact support if issues persist",
      ],
    };
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full mx-auto bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-border/50 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              {errorDetails.icon}
              <div
                className={`absolute inset-0 bg-${errorDetails.color}-500/20 rounded-full blur-xl animate-pulse`}
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {errorDetails.type}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {errorDetails.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details */}
          <Card className="bg-muted/30 border-border/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Error Message:
                </span>
                <Badge
                  variant="outline"
                  className="text-destructive border-destructive/20 bg-destructive/5"
                >
                  {errorCode && `${errorCode} - `}Error
                </Badge>
              </div>

              <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                <p className="text-sm font-mono text-foreground break-words">
                  {errorMessage}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Suggested Actions:
            </h4>
            <ul className="space-y-2">
              {errorDetails.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {retryLabel}
              </Button>
            )}

            {showHomeButton && (
              <Button
                variant="outline"
                className="border-border hover:bg-accent transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Return to Dashboard
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="hover:bg-muted"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
          </div>

          {/* Debug Information (only in development) */}
          {import.meta.env.DEV && (
            <details className="mt-6">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Debug Information (Development Only)
              </summary>
              <div className="mt-2 p-3 bg-muted/20 rounded border border-border/30">
                <pre className="text-xs text-muted-foreground overflow-auto">
                  {JSON.stringify(
                    {
                      error: errorMessage,
                      errorCode,
                      context,
                      timestamp: timestamp?.toISOString(),
                      userAgent: navigator.userAgent,
                      url: window.location.href,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardError;
