import React from "react";
import { cn } from "@/lib/utils";

interface ServerStatusIndicatorProps {
  status: string | undefined;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function ServerStatusIndicator({
  status,
  size = "md",
  showText = true,
  className,
}: ServerStatusIndicatorProps) {
  const isOnline =
    status === "ACTIVE" ||
    status === "active" ||
    status === "online" ||
    status === "Online"; // Handle display text
  const isTesting =
    status === "TESTING" ||
    status === "testing" ||
    status === "pending" ||
    status === "Testing"; // Handle display text

  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const getStatusColor = () => {
    if (isOnline) return "green";
    if (isTesting) return "yellow";
    return "red";
  };

  const getStatusText = () => {
    if (isOnline) return "Online";
    if (isTesting) return "Testing";
    return "Offline";
  };

  const color = getStatusColor();

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="relative">
        <div
          className={cn(sizeClasses[size], "rounded-full animate-pulse", {
            "bg-green-400 shadow-lg shadow-green-400/60": color === "green",
            "bg-yellow-400 shadow-lg shadow-yellow-400/60": color === "yellow",
            "bg-red-400 shadow-lg shadow-red-400/60": color === "red",
          })}
        />
        <div
          className={cn(
            sizeClasses[size],
            "absolute inset-0 rounded-full animate-ping",
            {
              "bg-green-400/30": color === "green",
              "bg-yellow-400/30": color === "yellow",
              "bg-red-400/30": color === "red",
            },
          )}
        />
      </div>
      {showText && (
        <span
          className={cn("text-xs font-medium", {
            "text-green-400": color === "green",
            "text-yellow-400": color === "yellow",
            "text-red-400": color === "red",
          })}
        >
          {getStatusText()}
        </span>
      )}
    </div>
  );
}
