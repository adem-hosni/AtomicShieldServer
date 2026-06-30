import React from "react";
import {
  Loader2,
  Activity,
  Server,
  Users,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Enhanced loading spinner with better animations
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary";
  label?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  variant = "default",
  label,
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const variantClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div className="relative">
        <Loader2
          className={cn(
            "animate-spin",
            sizeClasses[size],
            variantClasses[variant],
          )}
        />
        {/* Outer glow ring */}
        <div
          className={cn(
            "absolute inset-0 animate-pulse rounded-full opacity-20",
            variant === "primary" && "bg-primary/20",
            variant === "secondary" && "bg-secondary/20",
            variant === "default" && "bg-muted-foreground/20",
          )}
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      </div>

      {label && (
        <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
      )}
    </div>
  );
}

// Progressive loading card with staged content loading
interface ProgressiveLoadingCardProps {
  title: string;
  stage: "initializing" | "loading" | "processing" | "complete";
  icon?: React.ReactNode;
  progress?: number;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressiveLoadingCard({
  title,
  stage,
  icon,
  progress = 0,
  className,
  children,
}: ProgressiveLoadingCardProps) {
  const stageConfig = {
    initializing: {
      label: "Initializing...",
      color: "text-muted-foreground",
      bgColor: "bg-muted/20",
    },
    loading: {
      label: "Loading data...",
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    processing: {
      label: "Processing...",
      color: "text-amber-500",
      bgColor: "bg-amber-500/20",
    },
    complete: {
      label: "Complete",
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
  };

  const config = stageConfig[stage];

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn("p-2 rounded-lg", config.bgColor)}>
              <div className={config.color}>{icon}</div>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className={cn("text-sm", config.color)}>{config.label}</p>
          </div>
          {stage !== "complete" && (
            <LoadingSpinner size="sm" variant="primary" />
          )}
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {stage === "complete" ? children : <LoadingContent />}
      </CardContent>
    </Card>
  );
}

// Enhanced skeleton loading for different content types
function LoadingContent() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 flex-1" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

// Stats card loading skeleton
export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("p-6", className)}>
      <CardContent className="p-0">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard section loading
interface DashboardSectionLoadingProps {
  title: string;
  description?: string;
  stage: "loading" | "error" | "empty";
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export function DashboardSectionLoading({
  title,
  description,
  stage,
  error,
  onRetry,
  className,
}: DashboardSectionLoadingProps) {
  if (stage === "loading") {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" variant="primary" />
          <div>
            <h3 className="font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (stage === "error") {
    return (
      <Card className={cn("p-6 border-destructive/20", className)}>
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold text-destructive">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error || "Failed to load data"}
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="text-center space-y-4">
        <div className="h-12 w-12 rounded-lg bg-muted/20 flex items-center justify-center mx-auto">
          <Server className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {description || "No data available"}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Shimmer effect for loading states
export function ShimmerBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50 bg-[length:200%_100%] rounded",
        className,
      )}
      style={{
        animation: "shimmer 2s ease-in-out infinite",
      }}
    />
  );
}

// Server list loading skeleton
export function ServerListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// Add shimmer animation to global CSS
const shimmerStyles = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;

// Inject shimmer styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = shimmerStyles;
  document.head.appendChild(style);
}
