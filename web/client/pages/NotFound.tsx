import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Home, ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  usePageTitle("404 - Page Not Found");
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Effects matching HomePage */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full mx-auto text-center space-y-8">
          {/* AtomicShield Logo/Brand */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary" />
              <div className="absolute inset-0 h-12 w-12 bg-primary/20 rounded-full blur-xl animate-pulse" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AtomicShield
            </span>
          </div>

          {/* Error Badge */}
          <Badge
            variant="outline"
            className="text-destructive border-destructive/20 bg-destructive/5 px-4 py-2 text-lg"
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            Page Not Found
          </Badge>

          {/* 404 Display */}
          <div className="space-y-6">
            <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              404
            </h1>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">Page Not Found</h2>
              <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                The page you're looking for doesn't exist or has been moved to a
                different location.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
              asChild
            >
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Return Home
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transform hover:scale-105 transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>

          {/* Help Text */}
          <div className="border-t border-border/50 pt-6">
            <p className="text-muted-foreground">
              If you believe this is an error, please contact support or try
              navigating back to the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
