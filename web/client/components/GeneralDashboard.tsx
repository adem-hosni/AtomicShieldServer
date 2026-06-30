import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardError } from "@/components/ui/dashboard-error";
import { useErrorTracking, formatApiError } from "@/hooks/use-error-tracking";
import { usePageTitle } from "@/hooks/use-page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ServerStatusIndicator } from "@/components/ui/server-status-indicator";
import { ThreatActivityChart } from "@/components/ThreatActivityChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Shield,
  Server,
  Users,
  Calendar,
  Activity,
  Zap,
  Globe,
  AlertTriangle,
  TrendingUp,
  Settings,
  Eye,
  Ban,
  UserX,
  Clock,
  ChevronRight,
  Cpu,
  Network,
  HardDrive,
  Plus,
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Crown,
  Diamond,
  Star,
  Gamepad2,
} from "lucide-react";
// import {
//   useScrollAnimation,
//   getScrollAnimationClasses,
// } from "@/hooks/use-scroll-animation";
import { DashboardData, ServerType } from "@shared/api";
import { api, authManager } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

// Animated Counter Component - DISABLED
// interface AnimatedCounterProps {
//   end: number;
//   duration?: number;
//   prefix?: string;
//   suffix?: string;
//   className?: string;
// }

// function AnimatedCounter({
//   end,
//   duration = 2000,
//   prefix = "",
//   suffix = "",
//   className = "",
// }: AnimatedCounterProps) {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let startTime: number;
//     let animationFrame: number;

//     const animate = (timestamp: number) => {
//       if (!startTime) startTime = timestamp;
//       const progress = Math.min((timestamp - startTime) / duration, 1);

//       // Easing function for smooth animation
//       const easeOutQuart = 1 - Math.pow(1 - progress, 4);
//       setCount(Math.floor(easeOutQuart * end));

//       if (progress < 1) {
//         animationFrame = requestAnimationFrame(animate);
//       }
//     };

//     animationFrame = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(animationFrame);
//   }, [end, duration]);

//   return (
//     <span className={className}>
//       {prefix}
//       {count.toLocaleString()}
//       {suffix}
//     </span>
//   );
// }

// Simplified version without animation
function AnimatedCounter({
  end,
  prefix = "",
  suffix = "",
  className = "",
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {prefix}
      {end.toLocaleString()}
      {suffix}
    </span>
  );
}

// Cyber HUD Stats Card
interface CyberStatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    pulse?: boolean;
  };
  className?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  delay?: number;
  isParentVisible?: boolean;
  index?: number;
}

function CyberStatsCard({
  title,
  value,
  subtitle,
  icon,
  badge,
  className = "",
  trend,
  delay = 0,
  isParentVisible = false,
  index = 0,
}: CyberStatsCardProps) {
  // Animation classes disabled but keeping base classes for structure
  const animationClasses = "opacity-100";

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300
        ${className}
        bg-gradient-to-br from-background/90 to-background/50
        backdrop-blur-xl border-primary/20 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10
        ${animationClasses}
      `}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 relative">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0 relative">
        <div className="flex items-baseline gap-2">
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {value.toLocaleString()}
          </div>
          {badge && (
            <Badge
              variant={badge.variant || "secondary"}
              className={`text-xs flex-shrink-0
                ${badge.pulse ? "animate-pulse" : ""}
                ${badge.variant === "destructive" ? "bg-red-500/20 text-red-400 border-red-500/30" : ""}
                ${badge.variant === "default" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
              `}
            >
              {badge.text}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2 truncate">
            {subtitle}
          </p>
        )}
        {trend && (
          <div
            className={`
            text-xs flex items-center gap-1 mt-2 transition-all duration-300
            ${trend.isPositive ? "text-green-400" : "text-red-400"}
          `}
          >
            <TrendingUp
              className={`h-3 w-3 ${trend.isPositive ? "" : "rotate-180"}`}
            />
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Add Server Modal Component
interface AddServerFormData {
  serverName: string;
  serverIp: string;
  subscriptionId: string;
  serverType: string;
  serverImage: File | null;
}

interface Subscription {
  id: string;
  name: string;
  plan: string;
  status: "active" | "expired";
  period: number; // Period in days
  serversUsed: number;
  serversLimit: number;
}

interface AddServerModalProps {
  availableSubscriptions: Subscription[];
  serverTypes: ServerType[];
}

function AddServerModal({
  availableSubscriptions,
  serverTypes,
}: AddServerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<AddServerFormData>({
    serverName: "",
    serverIp: "",
    subscriptionId: "",
    serverType: "",
    serverImage: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Server name validation
    if (!formData.serverName.trim()) {
      newErrors.serverName = "Server name is required";
    } else if (formData.serverName.length > 64) {
      newErrors.serverName = "Server name must be 64 characters or less";
    }

    // IP validation
    if (!formData.serverIp.trim()) {
      newErrors.serverIp = "Server IP is required";
    } else {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      const ipParts = formData.serverIp.trim().split(".");
      const isValidFormat = ipRegex.test(formData.serverIp.trim());
      const isValidRange = ipParts.every((part) => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
      });

      if (!isValidFormat || !isValidRange) {
        newErrors.serverIp =
          "Please enter a valid IP address (e.g., 192.168.1.1)";
      }
    }

    // Subscription validation
    if (!formData.subscriptionId) {
      newErrors.subscriptionId = "Please select a subscription plan";
    }

    // Server type validation
    if (!formData.serverType) {
      newErrors.serverType = "Please select a server type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
      setErrors((prev) => ({
        ...prev,
        serverImage: "Please upload a PNG, JPG, or JPEG image",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrors((prev) => ({
        ...prev,
        serverImage: "Image must be smaller than 5MB",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, serverImage: file }));
    setErrors((prev) => ({ ...prev, serverImage: "" }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleImageUpload(files[0]);
      }
    },
    [handleImageUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Clear any previous submit errors
    setErrors((prev) => ({ ...prev, submit: "" }));

    try {
      // Convert image to base64 if present
      let serverImage: string | undefined;
      if (formData.serverImage) {
        serverImage = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.serverImage!);
        });
      }

      // Import API client dynamically to avoid circular imports
      const { api } = await import("../lib/api-client");

      // Make API call to create server using the API client
      const result = await api.servers.addServer({
        serverName: formData.serverName,
        serverIp: formData.serverIp,
        subscriptionId: formData.subscriptionId,
        serverType: formData.serverType,
        serverImage,
      });

      if (!result.success) {
        // Use the server response message if available, otherwise use the error message
        const errorMessage =
          result.message || result.error || "Failed to create server";

        console.error("Server creation failed:", {
          success: result.success,
          message: result.message,
          error: result.error,
          finalErrorMessage: errorMessage,
          fullResponse: result,
        });

        setErrors({
          submit: errorMessage,
        });
        return;
      }

      console.log("Server created:", result.data);

      // Reset form and close modal
      setFormData({
        serverName: "",
        serverIp: "",
        subscriptionId: "",
        serverType: "",
        serverImage: null,
      });
      setImagePreview(null);
      setIsOpen(false);

      // Show beautiful success toast
      toast({
        title: (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Server Created Successfully!
            </span>
            <Sparkles className="w-4 h-4 text-green-500 animate-pulse" />
          </div>
        ),
        description: (
          <div className="mt-2 space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {result.data?.name}
              </span>{" "}
              has been added to your AtomicShield network.
            </p>
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-500/10 rounded-lg px-3 py-2 border border-green-500/20">
              <Zap className="w-3 h-3" />
              <span className="font-medium">
                Configuration in progress - You'll be notified when ready
              </span>
            </div>
          </div>
        ),
        duration: 8000,
        className:
          "bg-gradient-to-br from-background/95 to-background/85 backdrop-blur-xl border-2 border-green-500/30 shadow-2xl shadow-green-500/10 rounded-2xl",
      });

      // Optionally trigger a refresh of the server list
      window.location.reload();
    } catch (error) {
      console.error("Error creating server:", error);
      // Handle network errors or other exceptions
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, serverImage: null }));
    setImagePreview(null);
    setErrors((prev) => ({ ...prev, serverImage: "" }));
  };

  const getAvailableSubscriptions = () => {
    return availableSubscriptions; // Show all subscriptions
  };

  // Get subscription icon based on plan type
  const getSubscriptionIcon = (plan: string | undefined | null) => {
    if (!plan || typeof plan !== "string") {
      return <Shield className="h-4 w-4 text-primary" />;
    }

    const planLower = plan.toLowerCase();
    if (planLower.includes("enterprise") || planLower.includes("premium")) {
      return <Crown className="h-4 w-4 text-amber-400" />;
    } else if (
      planLower.includes("pro") ||
      planLower.includes("professional")
    ) {
      return <Diamond className="h-4 w-4 text-purple-400" />;
    } else if (planLower.includes("basic") || planLower.includes("starter")) {
      return <Star className="h-4 w-4 text-blue-400" />;
    }
    return <Shield className="h-4 w-4 text-primary" />;
  };

  // Get server type icon
  const getServerTypeIcon = (
    typeId: string | undefined | null,
    typeName: string | undefined | null,
  ) => {
    if (!typeId || typeof typeId !== "string") {
      return <Gamepad2 className="h-4 w-4 text-primary" />;
    }

    const idLower = typeId.toLowerCase();
    const nameLower =
      typeName && typeof typeName === "string" ? typeName.toLowerCase() : "";

    if (idLower.includes("fivem") || nameLower.includes("fivem")) {
      return (
        <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">
          F
        </div>
      );
    }
    return <Gamepad2 className="h-4 w-4 text-primary" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="p-4 sm:p-6 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors duration-200 cursor-pointer bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl touch-manipulation">
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-6 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-base sm:text-lg">
                Add New Server
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Connect a new FiveM server to AtomicShield
              </p>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Add New Server
          </DialogTitle>
          <DialogDescription>
            Register a new FiveM server to your AtomicShield account and
            associate it with an active subscription.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Server Name */}
          <div className="space-y-2">
            <Label htmlFor="serverName" className="text-sm font-medium">
              Server Name *
            </Label>
            <Input
              id="serverName"
              value={formData.serverName}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  serverName: e.target.value,
                }));
                if (errors.serverName)
                  setErrors((prev) => ({ ...prev, serverName: "" }));
              }}
              placeholder="Enter your server name (max 64 characters)"
              className={`bg-background/50 ${errors.serverName ? "border-red-500" : "border-primary/20"}`}
              maxLength={64}
            />
            <div className="flex justify-between items-center">
              {errors.serverName && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.serverName}
                </p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {formData.serverName.length}/64 characters
              </p>
            </div>
          </div>

          {/* Server IP */}
          <div className="space-y-2">
            <Label htmlFor="serverIp" className="text-sm font-medium">
              Server IP Address *
            </Label>
            <Input
              id="serverIp"
              value={formData.serverIp}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, serverIp: e.target.value }));
                if (errors.serverIp)
                  setErrors((prev) => ({ ...prev, serverIp: "" }));
              }}
              placeholder="192.168.1.1"
              className={`bg-background/50 font-mono ${errors.serverIp ? "border-red-500" : "border-primary/20"}`}
            />
            {errors.serverIp && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.serverIp}
              </p>
            )}
          </div>

          {/* Subscription Plan */}
          <div className="space-y-2">
            <Label htmlFor="subscription" className="text-sm font-medium">
              Subscription Plan *
            </Label>
            <Select
              value={formData.subscriptionId}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, subscriptionId: value }));
                if (errors.subscriptionId)
                  setErrors((prev) => ({ ...prev, subscriptionId: "" }));
              }}
              disabled={getAvailableSubscriptions().length === 0}
            >
              <SelectTrigger
                className={`bg-gradient-to-r from-background/60 to-background/40 backdrop-blur-sm border-2 transition-all duration-300 rounded-xl shadow-lg ${
                  errors.subscriptionId
                    ? "border-red-500/60 ring-4 ring-red-500/20 shadow-red-500/20"
                    : formData.subscriptionId
                      ? "border-primary/80 ring-4 ring-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 shadow-primary/20"
                      : "border-primary/30 hover:border-primary/60 hover:ring-4 hover:ring-primary/20"
                } ${
                  getAvailableSubscriptions().length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gradient-to-r hover:from-background/80 hover:to-background/60 hover:shadow-xl"
                }`}
              >
                <SelectValue
                  placeholder={
                    <div className="flex items-center justify-center gap-2 text-muted-foreground py-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                      <span className="font-medium">
                        {availableSubscriptions.length === 0
                          ? "No subscriptions found"
                          : "Select a subscription plan"}
                      </span>
                    </div>
                  }
                >
                  {formData.subscriptionId &&
                    (() => {
                      const selectedSub = availableSubscriptions.find(
                        (sub) => sub.id === formData.subscriptionId,
                      );
                      return selectedSub ? (
                        <div className="flex items-center justify-center gap-3 py-2">
                          <div className="flex items-center gap-2">
                            {getSubscriptionIcon(selectedSub.plan)}
                            <div
                              className={`w-2 h-2 rounded-full shadow-lg ${selectedSub.status === "active" ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gradient-to-r from-gray-400 to-gray-500"}`}
                            />
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-foreground text-sm">
                              {selectedSub.name}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {selectedSub.plan} • {selectedSub.period} days
                            </div>
                          </div>
                        </div>
                      ) : (
                        formData.subscriptionId
                      );
                    })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-2">
                {availableSubscriptions.length > 0 ? (
                  getAvailableSubscriptions().map((sub, index) => (
                    <SelectItem
                      key={sub.id}
                      value={sub.id}
                      disabled={sub.status !== "active"}
                      className={`cursor-pointer rounded-xl mx-1 my-1 transition-all duration-300 transform hover:scale-[1.02] ${
                        sub.status !== "active"
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10 hover:shadow-lg focus:bg-gradient-to-r focus:from-primary/25 focus:to-primary/15"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3 py-3 px-2">
                        <div className="flex items-center gap-2">
                          {getSubscriptionIcon(sub.plan)}
                          <div
                            className={`w-2 h-2 rounded-full shadow-md ${
                              sub.status === "active"
                                ? "bg-gradient-to-r from-green-400 to-green-500 shadow-green-400/50"
                                : "bg-gradient-to-r from-gray-400 to-gray-500"
                            }`}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-sm text-foreground">
                            {sub.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            {sub.plan} • {sub.period} days •{" "}
                            {sub.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                      <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                      <span className="font-medium">
                        Loading subscriptions...
                      </span>
                    </div>
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.subscriptionId && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.subscriptionId}
              </p>
            )}
          </div>

          {/* Server Type */}
          <div className="space-y-2">
            <Label htmlFor="serverType" className="text-sm font-medium">
              Server Type *
            </Label>
            <Select
              value={formData.serverType}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, serverType: value }));
                if (errors.serverType)
                  setErrors((prev) => ({ ...prev, serverType: "" }));
              }}
              disabled={serverTypes.length === 0}
            >
              <SelectTrigger
                className={`bg-gradient-to-r from-background/60 to-background/40 backdrop-blur-sm border-2 transition-all duration-300 rounded-xl shadow-lg ${
                  errors.serverType
                    ? "border-red-500/60 ring-4 ring-red-500/20 shadow-red-500/20"
                    : formData.serverType
                      ? "border-primary/80 ring-4 ring-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 shadow-primary/20"
                      : "border-primary/30 hover:border-primary/60 hover:ring-4 hover:ring-primary/20"
                } ${
                  serverTypes.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gradient-to-r hover:from-background/80 hover:to-background/60 hover:shadow-xl"
                }`}
              >
                <SelectValue
                  placeholder={
                    <div className="flex items-center justify-center gap-2 text-muted-foreground py-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                      <span className="font-medium">
                        {serverTypes.length === 0
                          ? "No server types available"
                          : "Select a server type"}
                      </span>
                    </div>
                  }
                >
                  {formData.serverType &&
                    (() => {
                      const selectedType = serverTypes.find(
                        (type) => type.id === formData.serverType,
                      );
                      return selectedType ? (
                        <div className="flex items-center justify-center gap-3 py-2">
                          <div className="flex items-center gap-2">
                            {getServerTypeIcon(
                              selectedType.id,
                              selectedType.name,
                            )}
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/30" />
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-foreground text-sm">
                              {selectedType.name}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {selectedType.description}
                            </div>
                          </div>
                        </div>
                      ) : (
                        formData.serverType
                      );
                    })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-2">
                {serverTypes.length > 0 ? (
                  serverTypes.map((type, index) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="cursor-pointer rounded-xl mx-1 my-1 transition-all duration-300 transform hover:scale-[1.02] hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10 hover:shadow-lg focus:bg-gradient-to-r focus:from-primary/25 focus:to-primary/15"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3 py-3 px-2">
                        <div className="flex items-center gap-2">
                          {getServerTypeIcon(type.id, type.name)}
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/30" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-sm text-foreground">
                            {type.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            {type.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                      <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                      <span className="font-medium">
                        Loading server types...
                      </span>
                    </div>
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.serverType && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.serverType}
              </p>
            )}
          </div>

          {/* Server Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Server Image</Label>

            {!imagePreview ? (
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
                  ${isDragOver ? "border-primary bg-primary/10" : "border-primary/30 hover:border-primary/60"}
                  ${errors.serverImage ? "border-red-500" : ""}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Drag and drop your server image here
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Or click to browse files (PNG, JPG, JPEG - Max 5MB)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("imageInput")?.click()
                    }
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
                <input
                  id="imageInput"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="border rounded-lg p-4 bg-background/50 border-primary/20">
                  <div className="flex items-center gap-4">
                    <img
                      src={imagePreview}
                      alt="Server preview"
                      className="w-16 h-16 rounded-lg object-cover border border-primary/20"
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        {formData.serverImage?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.serverImage &&
                          (formData.serverImage.size / 1024 / 1024).toFixed(
                            2,
                          )}{" "}
                        MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {errors.serverImage && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.serverImage}
              </p>
            )}
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-400 mb-1">
                    Error creating server
                  </p>
                  <p className="text-sm text-red-300">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || getAvailableSubscriptions().length === 0}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Creating Server...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Add Server
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Quick Actions Floating Panel
function QuickActionsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: "View Bans",
      icon: <Ban className="h-4 w-4" />,
      path: "/bans",
      color: "text-red-400",
    },
    {
      label: "Audit Logs",
      icon: <Eye className="h-4 w-4" />,
      path: "/logs",
      color: "text-primary",
    },
    {
      label: "Configure",
      icon: <Settings className="h-4 w-4" />,
      path: "/config",
      color: "text-purple-400",
    },
    {
      label: "Players",
      icon: <Users className="h-4 w-4" />,
      path: "/players",
      color: "text-green-400",
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div
        className={`
        transition-all duration-500 ease-in-out origin-bottom-right
        ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}
      `}
      >
        <div className="flex flex-col gap-2 mb-4">
          {actions.map((action, index) => (
            <Button
              key={action.path}
              variant="outline"
              size="sm"
              onClick={() => navigate(action.path)}
              className={`
                bg-background/90 backdrop-blur-xl border-primary/20 hover:border-primary/40
                hover:bg-primary/10 transition-all duration-300 group
                ${action.color}
                // animate-in slide-in-from-right-4 fade-in-0
              `}
              // style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="/* group-hover:scale-110 transition-transform duration-200 */">
                {action.icon}
              </span>
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary/80
          hover:from-primary/90 hover:to-primary/70 shadow-2xl
          transition-all duration-300 group
          ${isOpen ? "rotate-45" : "/* hover:scale-110 */"}
        `}
      >
        <Settings
          className={`h-6 w-6 /* transition-transform duration-300 */ ${isOpen ? "rotate-45" : "/* group-hover:rotate-12 */"}`}
        />
      </Button>
    </div>
  );
}

// Recent Activity Item
interface ActivityItemProps {
  action: string;
  user: string;
  time: string;
  severity: "low" | "medium" | "high" | "critical";
  delay?: number;
  isParentVisible?: boolean;
  index?: number;
}

function ActivityItem({
  action,
  user,
  time,
  severity,
  delay = 0,
  isParentVisible = false,
  index = 0,
}: ActivityItemProps) {
  const severityColors = {
    low: "text-green-400 bg-green-400/10",
    medium: "text-yellow-400 bg-yellow-400/10",
    high: "text-orange-400 bg-orange-400/10",
    critical: "text-red-400 bg-red-400/10",
  };

  return (
    <div
      className={`
      flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-background/30 backdrop-blur-sm
      border border-border/50 hover:border-primary/30 transition-all duration-300
      hover:bg-background/50 group cursor-pointer touch-manipulation
      opacity-100 min-h-14 sm:min-h-auto
    `}
    >
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${severityColors[severity]} /* animate-pulse */`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium truncate">{action}</p>
        <p className="text-xs text-muted-foreground truncate">{user}</p>
      </div>
      <div className="text-xs text-muted-foreground flex-shrink-0">{time}</div>
      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 /* group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 */" />
    </div>
  );
}

export function GeneralDashboard() {
  usePageTitle("General Dashboard");
  const navigate = useNavigate();
  const { error, setError, clearError } = useErrorTracking();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState<
    "initializing" | "stats" | "servers" | "activity" | "complete"
  >("initializing");

  // Scroll animation hooks for different sections - DISABLED
  // const headerAnimation = useScrollAnimation({ threshold: 0.3 });
  // const statsAnimation = useScrollAnimation({ threshold: 0.2 });
  // const chartsAnimation = useScrollAnimation({ threshold: 0.3 });
  // const activityAnimation = useScrollAnimation({ threshold: 0.3 });
  // const serversAnimation = useScrollAnimation({ threshold: 0.2 });
  const headerAnimation = { elementRef: null, isVisible: true };
  const statsAnimation = { elementRef: null, isVisible: true };
  const chartsAnimation = { elementRef: null, isVisible: true };
  const activityAnimation = { elementRef: null, isVisible: true };
  const serversAnimation = { elementRef: null, isVisible: true };

  // Load dashboard data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        clearError();

        console.log("Loading dashboard data from API...");

        // Stage 0: Initializing
        setLoadingStage("initializing");
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Stage 1: Load stats first
        setLoadingStage("stats");
        await new Promise((resolve) => setTimeout(resolve, 250));

        // Stage 2: Load servers
        setLoadingStage("servers");
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Stage 3: Load activity
        setLoadingStage("activity");
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Debug: Check authentication state
        const token = authManager.getToken();
        console.log("Dashboard loading - Auth token present:", !!token);
        console.log(
          "Dashboard loading - Is authenticated:",
          authManager.isAuthenticated(),
        );

        const response = await api.dashboard.getOverview();

        console.log("Dashboard API response:", {
          success: response.success,
          hasData: !!response.data,
          error: response.error,
          dataKeys: response.data ? Object.keys(response.data) : [],
        });

        if (response.success && response.data) {
          console.log("Dashboard data loaded successfully:", {
            serverCount: response.data.servers?.length,
            subscriptionCount: response.data.subscriptions?.length,
            hasStats: !!response.data.stats,
            hasActivity: !!response.data.recentActivity,
          });
          setLoadingStage("complete");
          setDashboardData(response.data);
        } else {
          const errorMessage = formatApiError(
            response,
            "Failed to load dashboard data",
          );
          setError(
            errorMessage,
            "dashboard_overview",
            `API Response: ${JSON.stringify({ success: response.success, status: response.status })}`,
          );
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(
          err instanceof Error ? err : "Failed to load dashboard data",
          "dashboard_overview",
          "Network/Connection Error during dashboard load",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-refresh dashboard data every 60 seconds for real-time updates
  useEffect(() => {
    if (!dashboardData) return;

    const interval = setInterval(async () => {
      try {
        console.log("Auto-refreshing dashboard data...");
        const response = await api.dashboard.getOverview();

        if (response.success && response.data) {
          setDashboardData(response.data);
        }
      } catch (err) {
        console.error("Auto-refresh failed:", err);
        // Don't update error state during auto-refresh to avoid disrupting user
      }
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [dashboardData]);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Use actual data or show loading
  const displayData = dashboardData;

  // Error state
  if (error && !isLoading) {
    return (
      <DashboardError
        error={error.message}
        errorCode={error.code}
        context="dashboard"
        timestamp={error.timestamp}
        additionalInfo={error.additionalInfo}
        onRetry={() => {
          clearError();
          setIsLoading(true);
          // Trigger reload with a timeout
          setTimeout(async () => {
            try {
              console.log("🔄 Retrying dashboard overview fetch...");
              const response = await api.dashboard.getOverview();

              if (response.success && response.data) {
                setLoadingStage("complete");
                setDashboardData(response.data);
              } else {
                const errorMessage = formatApiError(
                  response,
                  "Failed to load dashboard data",
                );
                setError(
                  errorMessage,
                  "dashboard_overview",
                  "Retry attempt failed",
                );
              }
            } catch (retryError) {
              setError(
                retryError instanceof Error ? retryError : "Retry failed",
                "dashboard_overview",
                "Network error during retry",
              );
            } finally {
              setIsLoading(false);
            }
          }, 100);
        }}
        retryLabel="Retry Loading Dashboard"
        showHomeButton={false}
      />
    );
  }

  // Show loading state if no data available
  if (isLoading || !displayData) {
    const loadingMessages = {
      initializing: "Initializing dashboard...",
      stats: "Loading system statistics...",
      servers: "Connecting to servers...",
      activity: "Fetching recent activity...",
      complete: "Almost ready...",
    };

    const progressStages = {
      initializing: 15,
      stats: 35,
      servers: 65,
      activity: 85,
      complete: 100,
    };

    return (
      <div className="flex-1 overflow-y-auto relative">
        {/* Animated background */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div
            className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px]"
            style={{
              animation: "slide 20s linear infinite",
            }}
          />
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 relative z-10">
          {/* Enhanced loading header */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-full px-6 py-3 backdrop-blur-xl">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm font-medium text-primary">
                  {loadingMessages[loadingStage]}
                </span>
              </div>

              {/* Progress bar */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="w-full bg-muted/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${progressStages[loadingStage]}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {progressStages[loadingStage]}% complete
                </p>
              </div>
            </div>

            <div className="h-4 bg-muted/20 rounded w-1/4 animate-pulse mx-auto"></div>
            <div className="h-8 bg-muted/20 rounded w-1/2 animate-pulse mx-auto"></div>
          </div>

          {/* Enhanced Stats cards with stage indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, i) => {
              const cardTitles = [
                "System Status",
                "Total Servers",
                "Network Players",
                "Threat Level",
              ];
              const cardIcons = [Shield, Server, Users, AlertTriangle];
              const CardIcon = cardIcons[i];

              const isCurrentStage = loadingStage === "stats";
              const isCompleted = ["servers", "activity", "complete"].includes(
                loadingStage,
              );
              const isPending = loadingStage === "initializing";

              return (
                <Card
                  key={i}
                  className={`p-6 bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 transition-all duration-700 transform ${
                    isCurrentStage
                      ? "opacity-100 scale-105 border-primary/40 shadow-lg shadow-primary/10"
                      : isCompleted
                        ? "opacity-90 scale-100"
                        : isPending
                          ? "opacity-40 scale-95"
                          : "opacity-100"
                  }`}
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  <div className="flex items-center justify-center h-24">
                    {isPending ? (
                      <div className="text-center space-y-2 opacity-50">
                        <div className="w-8 h-8 rounded-lg bg-muted/20 flex items-center justify-center mx-auto">
                          <CardIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cardTitles[i]}
                        </div>
                      </div>
                    ) : isCurrentStage ? (
                      <div className="text-center space-y-3">
                        <div className="relative">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                          <div className="absolute inset-0 animate-ping h-8 w-8 rounded-full bg-primary/20 mx-auto"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-primary">
                            Loading {cardTitles[i]}
                          </div>
                          <div className="flex space-x-1 justify-center">
                            {[0, 1, 2].map((dot) => (
                              <div
                                key={dot}
                                className="w-1 h-1 rounded-full bg-primary/60 animate-pulse"
                                style={{
                                  animationDelay: `${dot * 0.2}s`,
                                  animationDuration: "1s",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 w-full">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <CardIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="h-3 bg-muted/40 rounded animate-pulse"></div>
                            <div className="h-5 bg-muted/60 rounded w-3/4 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="h-2 bg-muted/30 rounded w-2/3 animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Enhanced Servers and activity sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card
                className={`min-h-80 bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 transition-all duration-700 transform ${
                  loadingStage === "servers"
                    ? "opacity-100 scale-105 border-primary/40 shadow-lg shadow-primary/10"
                    : ["activity", "complete"].includes(loadingStage)
                      ? "opacity-90 scale-100"
                      : "opacity-50 scale-95"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Server Network</h3>
                      <p className="text-sm text-muted-foreground">
                        {loadingStage === "servers"
                          ? "Connecting to servers..."
                          : "Quick server access"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {loadingStage === "servers" ? (
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                          <div className="absolute inset-0 animate-ping h-10 w-10 rounded-full bg-primary/20 mx-auto"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-primary">
                            Establishing server connections
                          </div>
                          <div className="flex space-x-1 justify-center">
                            {[0, 1, 2, 3].map((dot) => (
                              <div
                                key={dot}
                                className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
                                style={{
                                  animationDelay: `${dot * 0.15}s`,
                                  animationDuration: "1.2s",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-3 rounded-lg bg-background/30 backdrop-blur-sm border border-primary/10"
                          >
                            <div className="h-10 w-10 bg-primary/10 rounded-lg animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-muted/40 rounded w-24 animate-pulse"></div>
                              <div className="h-3 bg-muted/30 rounded w-16 animate-pulse"></div>
                            </div>
                            <div className="h-4 w-4 bg-primary/20 rounded-full animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card
                className={`min-h-80 bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 transition-all duration-700 transform ${
                  loadingStage === "activity"
                    ? "opacity-100 scale-105 border-primary/40 shadow-lg shadow-primary/10"
                    : loadingStage === "complete"
                      ? "opacity-90 scale-100"
                      : "opacity-50 scale-95"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Recent Activity</h3>
                      <p className="text-sm text-muted-foreground">
                        {loadingStage === "activity"
                          ? "Fetching latest events..."
                          : "Live security feed"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {loadingStage === "activity" ? (
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                          <div className="absolute inset-0 animate-ping h-10 w-10 rounded-full bg-primary/20 mx-auto"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-primary">
                            Loading recent activity
                          </div>
                          <div className="flex space-x-1 justify-center">
                            {[0, 1, 2].map((dot) => (
                              <div
                                key={dot}
                                className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
                                style={{
                                  animationDelay: `${dot * 0.2}s`,
                                  animationDuration: "1s",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2 rounded-lg bg-background/20"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></div>
                            <div className="flex-1 space-y-1">
                              <div className="h-3 bg-muted/40 rounded w-full animate-pulse"></div>
                              <div className="h-2 bg-muted/30 rounded w-2/3 animate-pulse"></div>
                            </div>
                            <div className="h-2 w-8 bg-muted/30 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Animated background - DISABLED */}
      {/* <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px] animate-pulse" />
      </div> */}

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 relative">
        {/* Breadcrumb */}
        <Breadcrumb className="opacity-100">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header & Stats Cards */}
        <div className="space-y-6">
          <div className="opacity-100">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              AtomicShield Control Center
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Comprehensive anti-cheat monitoring and server network oversight
            </p>
          </div>

          <div className="opacity-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <CyberStatsCard
              title="System Status"
              value={displayData.stats?.systemStatus.value || 0}
              icon={<Shield className="h-5 w-5 text-green-400" />}
              badge={displayData.stats?.systemStatus.badge}
              className="bg-green-500/5 border-green-500/20"
              isParentVisible={statsAnimation.isVisible}
              index={0}
            />

            <CyberStatsCard
              title="Total Servers"
              value={displayData.stats?.totalServers.value || 0}
              subtitle={displayData.stats?.totalServers.subtitle}
              icon={<Server className="h-5 w-5 text-primary" />}
              trend={displayData.stats?.totalServers.trend}
              isParentVisible={statsAnimation.isVisible}
              index={1}
            />

            <CyberStatsCard
              title="Network Players"
              value={displayData.stats?.networkPlayers.value || 0}
              subtitle={displayData.stats?.networkPlayers.subtitle}
              icon={<Users className="h-5 w-5 text-purple-400" />}
              trend={displayData.stats?.networkPlayers.trend}
              isParentVisible={statsAnimation.isVisible}
              index={2}
            />

            <CyberStatsCard
              title="Threat Level"
              value={displayData.stats?.threatLevel.value || 0}
              subtitle={displayData.stats?.threatLevel.subtitle}
              icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
              badge={displayData.stats?.threatLevel.badge}
              className="bg-red-500/5 border-red-500/20"
              isParentVisible={statsAnimation.isVisible}
              index={3}
            />
          </div>
        </div>

        {/* Server Network Status */}
        <div className="space-y-6 opacity-100">
          <div className="opacity-100">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Quick Server Access
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Quickly access and manage your server network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {displayData.servers && displayData.servers.length > 0 ? (
              displayData.servers.map((server) => (
                <Card
                  key={server.id}
                  className="p-4 sm:p-6 hover:bg-accent/30 transition-all duration-500 cursor-pointer group
                             bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl
                             border-primary/20 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
                  onClick={() => navigate(`/dashboard/server/${server.id}`)}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border ${
                          server.status === "ACTIVE" ||
                          server.status === "active"
                            ? "border-green-500/30"
                            : "border-primary/30"
                        } /* group-hover:scale-110 transition-transform duration-300 */`}
                      >
                        <img
                          src={server.imageUrl}
                          alt={server.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback =
                              target.parentElement?.querySelector(
                                ".fallback-icon",
                              );
                            if (fallback) {
                              (fallback as HTMLElement).style.display = "flex";
                            }
                          }}
                        />
                        <div
                          className={`w-full h-full ${
                            server.status === "ACTIVE" ||
                            server.status === "active"
                              ? "bg-green-500/20"
                              : "bg-primary/20"
                          } flex items-center justify-center fallback-icon`}
                          style={{ display: "none" }}
                        >
                          <Server
                            className={`h-6 w-6 ${
                              server.status === "ACTIVE" ||
                              server.status === "active"
                                ? "text-green-400"
                                : "text-primary"
                            }`}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">
                          {server.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {server.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div
                        className={`text-xl sm:text-2xl font-bold ${server.statusColor}`}
                      >
                        <AnimatedCounter end={server.playerCount} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        players online
                      </div>
                      <div className="mt-1">
                        <ServerStatusIndicator
                          status={server.status}
                          size="md"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card className="p-8 text-center bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 border-2 border-dashed">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                      <Server className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        No servers configured
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        You don't have any servers set up yet. Add your first
                        server to start monitoring and protecting it with
                        AtomicShield.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Add Server Card */}
            <AddServerModal
              availableSubscriptions={(() => {
                const subscriptions = (dashboardData?.subscriptions || []).map(
                  (sub) => ({
                    id: sub.id,
                    name: sub.name,
                    plan: sub.plan,
                    status:
                      sub.status === "active"
                        ? ("active" as const)
                        : ("expired" as const),
                    period: sub.period,
                    serversUsed: sub.serversUsed,
                    serversLimit: sub.serversLimit,
                  }),
                );
                return subscriptions;
              })()}
              serverTypes={dashboardData?.serverTypes || []}
            />
          </div>
        </div>

        {/* Threat Activity Chart */}
        <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Threat Activity
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time threat detection and blocked attempts analysis
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
              <TabsContent value="today" className="space-y-4">
                <ThreatActivityChart
                  period="today"
                  data={displayData.threatActivity}
                />
              </TabsContent>
              <TabsContent value="week" className="space-y-4">
                <ThreatActivityChart period="week" />
              </TabsContent>
              <TabsContent value="month" className="space-y-4">
                <ThreatActivityChart period="month" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Enhanced Analytics Grid */}
        <div className="space-y-6">
          {/* Top Row - Threat Assessment and Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Threat Assessment */}
            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Threat Assessment
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time security performance metrics
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-green-400">
                      {displayData.threatAssessment?.detectionRate}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Detection Rate
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      Excellent
                    </Badge>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-blue-400">
                      {displayData.threatAssessment?.responseTime}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Response Time
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      Optimal
                    </Badge>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-orange-400">
                      {displayData.threatAssessment?.falsePositives}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      False Positives
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Very Low
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Global Stats */}
            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Global Statistics
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  24-hour network activity overview
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Bans
                      </span>
                      <span className="text-lg font-bold text-red-400">
                        <AnimatedCounter
                          end={displayData.globalStats?.totalBans24h || 0}
                        />
                      </span>
                    </div>
                    <div className="w-full bg-red-500/10 rounded-full h-1">
                      <div
                        className="bg-red-500 h-1 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(100, Math.max(5, ((displayData.globalStats?.totalBans24h || 0) / 100) * 100))}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Player Kicks
                      </span>
                      <span className="text-lg font-bold text-orange-400">
                        <AnimatedCounter
                          end={displayData.globalStats?.kicks24h || 0}
                        />
                      </span>
                    </div>
                    <div className="w-full bg-orange-500/10 rounded-full h-1">
                      <div
                        className="bg-orange-500 h-1 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(100, Math.max(5, ((displayData.globalStats?.kicks24h || 0) / 200) * 100))}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Recent Activities (Professional Table Layout) */}
          <div className="w-full">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight mb-3 sm:mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activities
            </h2>

            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
              <CardContent className="p-6">
                {displayData.recentActivity?.length > 0 ? (
                  <div className="space-y-3">
                    {displayData.recentActivity
                      .slice(0, 6)
                      .map((activity, index) => (
                        <div
                          key={`${activity.user}-${activity.time}-${index}`}
                          className="flex items-center justify-between p-4 rounded-lg bg-background/30 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                activity.severity === "critical"
                                  ? "bg-red-500 shadow-lg shadow-red-500/50"
                                  : activity.severity === "high"
                                    ? "bg-orange-500 shadow-lg shadow-orange-500/50"
                                    : activity.severity === "medium"
                                      ? "bg-yellow-500 shadow-lg shadow-yellow-500/50"
                                      : "bg-green-500 shadow-lg shadow-green-500/50"
                              } animate-pulse`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {activity.action}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {activity.user}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <Badge
                              variant="outline"
                              className={`text-xs capitalize ${
                                activity.severity === "critical"
                                  ? "border-red-500/30 text-red-400"
                                  : activity.severity === "high"
                                    ? "border-orange-500/30 text-orange-400"
                                    : activity.severity === "medium"
                                      ? "border-yellow-500/30 text-yellow-400"
                                      : "border-green-500/30 text-green-400"
                              }`}
                            >
                              {activity.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground min-w-fit">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                )}

                {displayData.recentActivity?.length > 6 && (
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Activities
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
