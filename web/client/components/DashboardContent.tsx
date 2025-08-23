import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Server,
  Users,
  Ban,
  TrendingUp,
  Calendar,
  Activity,
  Loader2,
  AlertCircle,
  Key,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ServerAnalyticsChart } from "./ServerAnalyticsChart";
import {
  useScrollAnimation,
  getScrollAnimationClasses,
} from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/hooks/use-language";
import { ServerDashboardData } from "@shared/api";
import { api } from "@/lib/api-client";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  className?: string;
  isParentVisible?: boolean;
  index?: number;
}

function StatsCard({
  title,
  value,
  subtitle,
  icon,
  badge,
  className = "",
  isParentVisible = false,
  index = 0,
}: StatsCardProps) {
  const cardAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "50px",
  });

  return (
    <Card
      ref={cardAnimation.elementRef}
      className={`
        relative overflow-hidden border-primary/20 
        hover:border-primary/40 transition-all duration-300 
        hover:shadow-xl hover:shadow-primary/10
        ${getScrollAnimationClasses(
          cardAnimation.isVisible && isParentVisible,
          "fade-in-up",
          "200",
          `${index * 100}`,
        )}
        ${className}
      `}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {value}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
          {badge && (
            <Badge
              variant={badge.variant || "default"}
              className="text-xs flex-shrink-0"
            >
              {badge.text}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardContent() {
  const { serverId } = useParams<{ serverId: string }>();
  usePageTitle("Dashboard");
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] =
    useState<ServerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingKey, setIsRefreshingKey] = useState(false);

  // Track render count for debugging
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  // Stabilize dashboard data to prevent unnecessary re-renders
  const stableDashboardData = useMemo(() => dashboardData, [dashboardData]);

  // Scroll animation hooks for different sections with more forgiving settings
  const headerAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "100px",
  });

  const statsAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "50px",
  });

  const chartsAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "50px",
  });

  const tablesAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "50px",
  });

  // Single auth check effect that doesn't depend on changing values
  useEffect(() => {
    console.log("🔧 DashboardContent mounted, checking auth...");
    console.log("  - ServerId:", serverId);

    // Check authentication
    const hasToken = !!localStorage.getItem("token");
    const hasUser = !!localStorage.getItem("user");
    console.log("  - Token in localStorage:", hasToken);
    console.log("  - User in localStorage:", hasUser);
    console.log("  - Current URL:", window.location.href);

    // Check if user is authenticated
    if (!hasToken || !hasUser) {
      console.log("🚨 User not authenticated, redirecting to signin...");
      navigate("/auth/signin");
      return;
    }

    return () => {
      console.log("🔧 DashboardContent unmounting, serverId:", serverId);
    };
  }, [navigate]);

  useEffect(() => {
    console.log("🔧 ServerId changed, old/new:", serverId);

    const loadServerData = async () => {
      if (!serverId) {
        console.log("No serverId provided, showing general dashboard");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Starting to load server data for serverId:", serverId);
        setIsLoading(true);
        setError(null);

        console.log("🔄 Fetching dashboard data...");
        const response = await api.servers.getServerDashboard(serverId);
        console.log("Dashboard API response:", response);

        if (response.success && response.data) {
          console.log("✅ Successfully loaded dashboard data:", response.data);
          console.log("✅ Full API response:", response);

          // Preserve the root-level status from the API response
          const enhancedData = {
            ...response.data,
            _apiStatus: response.status, // Store the root-level status
          };
          setDashboardData(enhancedData);
        } else {
          console.error("❌ Failed to load dashboard data:", response.error);
          setError(response.error || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("💥 Error loading dashboard data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
      } finally {
        setIsLoading(false);
        console.log("🏁 Dashboard loading completed");
      }
    };

    loadServerData();
  }, [serverId]);

  // Auto-refresh effect that cleans up properly
  useEffect(() => {
    if (!serverId || !stableDashboardData) return;

    console.log("Setting up auto-refresh for serverId:", serverId);
    const interval = setInterval(async () => {
      try {
        console.log("🔄 Auto-refreshing dashboard data...");
        const response = await api.servers.getServerDashboard(serverId);
        if (response.success && response.data) {
          console.log("✅ Auto-refresh successful");
          const enhancedData = {
            ...response.data,
            _apiStatus: response.status,
          };
          setDashboardData(enhancedData);
        }
      } catch (error) {
        console.warn("⚠️ Auto-refresh failed:", error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [serverId]); // Remove dashboardData dependency to prevent recreation

  const handleRefreshKey = async () => {
    if (!serverId) {
      toast({
        title: "Error",
        description: "No server ID available",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshingKey(true);
    try {
      const response = await api.servers.refreshServerKey(serverId);

      if (response.success) {
        toast({
          title: "Key Refreshed",
          description: "Server key has been successfully refreshed.",
        });
        // Refresh the page after successful key refresh
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(response.error || "Failed to refresh key");
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description:
          error instanceof Error ? error.message : "Failed to refresh key",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingKey(false);
    }
  };

  console.log(
    `🔧 Render #${renderCountRef.current} - isLoading:`,
    isLoading,
    "error:",
    error,
    "serverId:",
    serverId,
    "hasData:",
    !!stableDashboardData,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-96 animate-pulse"></div>
            </div>
          </div>

          {/* Stats grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20"
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                    <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                  </div>
                  <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts section skeleton */}
          <div className="h-96 rounded-lg border bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-16 bg-muted rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div className="h-64 bg-muted/20 rounded animate-pulse flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>

          {/* Server management skeleton */}
          <div className="h-48 rounded-lg border bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-40 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
              </div>
              <div className="space-y-3 h-full flex flex-col">
                <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-10 bg-muted rounded w-full animate-pulse mt-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Error Loading Dashboard</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!serverId) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">
              Welcome to your Enhancement Platform
            </h1>
            <p className="text-muted-foreground">
              Select a server from the sidebar to view its dashboard and
              analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!stableDashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No Data Available</h3>
            <p className="text-muted-foreground">
              Unable to load dashboard data for this server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { server, onlinePlayers, totalBans, recentBans, analytics, license } =
    stableDashboardData;

  // Get status from the API response (can be at root level or in serverInfo)
  const serverStatus =
    (stableDashboardData as any)?._apiStatus || server?.status;

  console.log("🎨 Rendering dashboard with data:", {
    serverName: server?.name,
    onlinePlayers,
    totalBans,
    recentBansCount: recentBans?.length,
    hasAnalytics: !!analytics,
    licenseKey: license?.key,
  });

  console.log("🔍 DEBUG - Server Status Detection:", {
    fullDashboardData: stableDashboardData,
    preservedApiStatus: (stableDashboardData as any)?._apiStatus,
    serverInfoStatus: server?.status,
    finalServerStatus: serverStatus,
    serverObject: server,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header with Breadcrumb */}
        <div ref={headerAnimation.elementRef} className="space-y-4">
          <Breadcrumb
            className={getScrollAnimationClasses(
              headerAnimation.isVisible,
              "fade-in-up",
              "300",
              "0",
            )}
          >
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{server?.name || "Server"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div
            className={getScrollAnimationClasses(
              headerAnimation.isVisible,
              "fade-in-up",
              "400",
              "100",
            )}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {server?.name || "Server"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Server analytics and management dashboard
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          ref={statsAnimation.elementRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <StatsCard
            title="Online Players"
            value={onlinePlayers?.count || 0}
            icon={<Users className="h-4 w-4" />}
            badge={{
              text: onlinePlayers?.count > 0 ? "Active" : "Inactive",
              variant: onlinePlayers?.count > 0 ? "default" : "secondary",
            }}
            className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 touch-manipulation"
            isParentVisible={statsAnimation.isVisible}
            index={0}
          />

          <StatsCard
            title="Total Bans"
            value={totalBans?.count || 0}
            icon={<Ban className="h-4 w-4" />}
            badge={{
              text: totalBans?.activeBans > 0 ? "Active" : "Clean",
              variant: totalBans?.activeBans > 0 ? "destructive" : "default",
            }}
            className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20"
            isParentVisible={statsAnimation.isVisible}
            index={1}
          />

          <StatsCard
            title="Server Status"
            value={serverStatus === "active" ? "Online" : "Offline"}
            subtitle={
              server?.lastSeen
                ? `Last seen: ${server.lastSeen}`
                : "Never connected"
            }
            icon={
              <div className="relative">
                <Activity className="h-4 w-4" />
                <div
                  className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                    serverStatus === "online" ||
                    serverStatus === "active" ||
                    serverStatus === "ACTIVE"
                      ? "bg-green-400 shadow-lg shadow-green-400/50 animate-pulse"
                      : "bg-red-400 shadow-lg shadow-red-400/50 animate-pulse"
                  }`}
                />
              </div>
            }
            badge={{
              text:
                serverStatus === "online" ||
                serverStatus === "active" ||
                serverStatus === "ACTIVE"
                  ? "Online"
                  : "Offline",
              variant:
                serverStatus === "online" ||
                serverStatus === "active" ||
                serverStatus === "ACTIVE"
                  ? "default"
                  : "secondary",
            }}
            className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20"
            isParentVisible={statsAnimation.isVisible}
            index={2}
          />

          <StatsCard
            title="License Key"
            value={
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-xs px-2 py-1 blur-sm hover:blur-none transition-all duration-300 cursor-pointer select-all"
                  onClick={() => {
                    if (license?.key) {
                      navigator.clipboard.writeText(license.key);
                      toast({
                        title: "Copied license key",
                        description: "License key has been copied to clipboard",
                        className:
                          "bg-green-600 border-green-500 text-white text-sm max-w-xs",
                      });
                    }
                  }}
                >
                  {license?.key || "Loading..."}
                </span>
              </div>
            }
            icon={<Key className="h-4 w-4" />}
            className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20"
            isParentVisible={statsAnimation.isVisible}
            index={3}
          />
        </div>

        {/* Analytics Section */}
        <div ref={chartsAnimation.elementRef} className="space-y-6">
          <Card
            className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${getScrollAnimationClasses(chartsAnimation.isVisible, "slide-in-right", "600", "300")}`}
          >
            <Tabs defaultValue="today" className="w-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Server Analytics
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Player activity and performance metrics
                    </p>
                  </div>
                  <TabsList className="grid w-auto grid-cols-3">
                    <TabsTrigger value="today">{t("today")}</TabsTrigger>
                    <TabsTrigger value="week">Last 7 Days</TabsTrigger>
                    <TabsTrigger value="month">Last 30 Days</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="today" className="space-y-4">
                  <ServerAnalyticsChart data={dashboardData.chart.today} period="today" />
                </TabsContent>
                <TabsContent value="week" className="space-y-4">
                  <ServerAnalyticsChart data={dashboardData.chart.week} period="week" />
                </TabsContent>
                <TabsContent value="month" className="space-y-4">
                  <ServerAnalyticsChart data={dashboardData.chart.month} period="month" />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Server Management Section */}
        <div ref={tablesAnimation.elementRef} className="space-y-6">
          <Card
            className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${getScrollAnimationClasses(tablesAnimation.isVisible, "slide-in-bottom", "700", "600")}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Server Management
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Administrative actions for this server
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3 h-full flex flex-col">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium">License Key Management</h4>
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">
                    Generate a new license key for your server. This will
                    refresh your server's authentication credentials.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRefreshKey}
                    disabled={isRefreshingKey}
                    className="w-full bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-600 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200 mt-auto"
                  >
                    {isRefreshingKey ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Refreshing Key...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh License Key
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
