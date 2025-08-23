import React, { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import {
  useScrollAnimation,
  getScrollAnimationClasses,
} from "@/hooks/use-scroll-animation";
import {
  CreditCard,
  Crown,
  Shield,
  Check,
  Star,
  Zap,
  Users,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Package,
  Download,
  Eye,
  MoreHorizontal,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api-client";

interface UserSubscription {
  id: string;
  name: string;
  plan: string;
  status: "active" | "paused" | "expired" | "cancelled";
  nextBilling: string;
  price: number;
  period: "monthly" | "yearly";
  serverName: string;
  playersUsed: number;
  playersLimit: number;
  features: string[];
  startDate: string;
  autoRenew: boolean;
  // Keep original API data for display
  originalData: ApiSubscription;
}

interface ApiSubscription {
  type: number;
  started_at: string;
  expires_at: string;
  remaining: string;
  name: string;
  status: number;
  key: string;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: "paid" | "pending" | "failed";
  invoice?: string;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  className?: string;
  isParentVisible?: boolean;
  index?: number;
}

function StatsCard({
  title,
  value,
  subtitle,
  icon,
  className,
  isParentVisible = false,
  index = 0,
}: StatsCardProps) {
  const animationClasses = getScrollAnimationClasses(
    isParentVisible,
    "zoom-in",
    "500",
    `${300 + index * 100}`,
  );

  return (
    <Card
      className={`${className} hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 ${animationClasses}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function SubscriptionsPage() {
  usePageTitle("Subscriptions");
  const [selectedSubscription, setSelectedSubscription] = useState<
    string | null
  >(null);
  const [subscriptions, setSubscriptions] = useState<ApiSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Scroll animation hooks
  const headerAnimation = useScrollAnimation({ threshold: 0.3 });
  const statsAnimation = useScrollAnimation({ threshold: 0.2 });
  const subscriptionsAnimation = useScrollAnimation({ threshold: 0.3 });

  // Fetch subscriptions data
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching subscriptions...");

        const response = await api.subscriptions.getSubscriptions();
        console.log("API Response:", response);

        // Support both formats:
        // 1) { success: true, subscriptions: [...] }
        // 2) { success: true, data: { subscriptions: [...] } }
        const subscriptionsList =
          response?.subscriptions || response?.data?.subscriptions || [];

        if (response.success && Array.isArray(subscriptionsList)) {
          console.log("Subscriptions data:", subscriptionsList);
          setSubscriptions(subscriptionsList);
          setError(null);
        } else {
          const errorMessage =
            response?.error || "Failed to fetch subscriptions";
          console.error("API Error:", errorMessage);
          setError(errorMessage);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleManageSubscription = async (
    action: string,
    subscriptionId: string,
  ) => {
    toast({
      title: `Subscription ${action}`,
      description: `Successfully ${action.toLowerCase()}ed subscription`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Active
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Paused
          </Badge>
        );
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSubscriptionType = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("free") && lowerName.includes("3 days")) {
      return "FREE trial";
    } else if (lowerName.includes("basic")) {
      return "Basic";
    } else if (lowerName.includes("pro")) {
      return "Pro";
    } else if (
      lowerName.includes("entreprise") ||
      lowerName.includes("enterprise")
    ) {
      return "Entreprise";
    } else if (lowerName.includes("lifetime")) {
      return "Lifetime";
    }

    return "Standard";
  };

  // Convert API subscription to UI subscription format
  const convertApiSubscription = (
    apiSub: ApiSubscription,
  ): UserSubscription => {
    const isActive =
      apiSub.status === 0 && !apiSub.remaining.includes("Expired");
    const isExpired =
      apiSub.status === 2 || apiSub.remaining.includes("Expired");

    // Map type number to plan name and get pricing from config
    const getPlanDetails = (type: number) => {
      switch (type) {
        case 1:
          return { name: "Basic", price: 45 };
        case 2:
          return { name: "Pro", price: 89 };
        case 3:
          return { name: "Enterprise", price: 199 };
        default:
          return { name: "Unknown", price: 0 };
      }
    };

    const planDetails = getPlanDetails(apiSub.type);

    return {
      id: `${apiSub.name}-${apiSub.type}`,
      name: apiSub.name,
      plan: planDetails.name,
      status: isActive ? "active" : isExpired ? "expired" : "cancelled",
      nextBilling: apiSub.expires_at,
      price: planDetails.price,
      period: "monthly" as const,
      serverName: apiSub.name,
      playersUsed: 0,
      playersLimit: 0,
      features:
        planDetails.name === "Enterprise"
          ? [
              "Quantum-grade enhancement framework",
              "Unlimited active users",
              "24/7 dedicated support",
              "Custom development",
            ]
          : planDetails.name === "Pro"
            ? [
                "AI-driven enhancement platform",
                "Up to 128 active users",
                "Priority support",
                "Advanced analytics dashboard",
              ]
            : [
                "Real-time performance monitoring",
                "Up to 32 active users",
                "Email support",
                "Basic analytics dashboard",
              ],
      startDate: apiSub.started_at,
      autoRenew: isActive,
      originalData: apiSub,
    };
  };

  // Convert API subscriptions to UI format
  const uiSubscriptions = subscriptions.map(convertApiSubscription);
  const activeSubscriptions = uiSubscriptions.filter(
    (sub) => sub.status === "active",
  );
  const inactiveSubscriptions = uiSubscriptions.filter(
    (sub) => sub.status !== "active",
  );

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading subscriptions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
              <p className="text-destructive">
                Error loading subscriptions: {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          ref={headerAnimation.elementRef}
          className={getScrollAnimationClasses(
            headerAnimation.isVisible,
            "fade-in",
            "700",
          )}
        >
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/overview">
                {t("dashboard")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Subscriptions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="space-y-4">
          <div
            className={getScrollAnimationClasses(
              headerAnimation.isVisible,
              "slide-in-bottom",
              "700",
              "200",
            )}
          >
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-primary" />
              My Subscriptions
            </h1>
            <p className="text-muted-foreground">
              Manage your active AtomicShield subscriptions and view billing
              history
            </p>
          </div>

          {/* Current Subscription Stats */}
          <div
            ref={statsAnimation.elementRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <StatsCard
              title="Active Subscriptions"
              value={activeSubscriptions.length}
              subtitle="Currently running"
              icon={<Shield className="h-4 w-4 text-green-400" />}
              className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20"
              isParentVisible={statsAnimation.isVisible}
              index={0}
            />
            <StatsCard
              title="Total Subscriptions"
              value={uiSubscriptions.length}
              subtitle="Active licenses"
              icon={<Users className="h-4 w-4 text-blue-400" />}
              className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20"
              isParentVisible={statsAnimation.isVisible}
              index={1}
            />
          </div>
        </div>

        {/* Active Subscriptions Summary */}
        {activeSubscriptions.length > 0 && (
          <Alert className="border-green-500/30 bg-green-500/10">
            <Shield className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">
              You have {activeSubscriptions.length} active subscription
              {activeSubscriptions.length > 1 ? "s" : ""} protecting your
              servers
            </AlertDescription>
          </Alert>
        )}

        {/* Subscriptions */}
        <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Active Subscriptions */}
              {activeSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-green-500/20 hover:border-green-500/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Shield className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{subscription.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getSubscriptionType(subscription.name)}
                      </p>
                      <p className="text-xs text-green-400">
                        Expires:{" "}
                        {new Date(
                          subscription.nextBilling,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {getStatusBadge(subscription.status)}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{subscription.name}</DialogTitle>
                          <DialogDescription>
                            Subscription details and management options
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          {/* Subscription Configuration */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-background/50">
                              <div className="text-lg font-bold">FiveM</div>
                              <div className="text-sm text-muted-foreground">
                                Platform Type
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-background/50">
                              <div className="text-lg font-bold">
                                {subscription.originalData.status === 0
                                  ? "Active"
                                  : "Inactive"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Status
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-background/50">
                              <div className="text-lg font-bold">
                                {new Date(
                                  subscription.originalData.started_at,
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Started At
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-background/50">
                              <div className="text-lg font-bold">
                                {new Date(
                                  subscription.originalData.expires_at,
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Expires At
                              </div>
                            </div>
                          </div>

                          {/* License Key */}
                          <div className="p-4 rounded-lg bg-background/30 border border-primary/20">
                            <h4 className="font-medium mb-2">License Key</h4>
                            <div className="text-sm font-mono bg-background/50 p-3 rounded border break-all">
                              {subscription.originalData.key}
                            </div>
                          </div>

                          {/* Remaining Time */}
                          <div className="p-4 rounded-lg bg-background/30 border border-primary/20">
                            <h4 className="font-medium mb-2">Time Remaining</h4>
                            <div className="text-lg font-mono text-primary">
                              {subscription.originalData.remaining}
                            </div>
                          </div>

                          {/* Features */}
                          <div>
                            <h4 className="font-medium mb-3">
                              Features Included
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {subscription.features.map((feature, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <Check className="h-4 w-4 text-green-400" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}

              {/* Expired/Inactive Subscriptions */}
              {inactiveSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-primary/10 hover:border-primary/20 transition-all duration-200 opacity-75"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <Shield className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{subscription.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getSubscriptionType(subscription.name)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expired:{" "}
                        {new Date(
                          subscription.nextBilling,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {getStatusBadge(subscription.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
