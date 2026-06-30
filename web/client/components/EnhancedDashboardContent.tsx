import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";
import { DashboardError } from "@/components/ui/dashboard-error";
import { useErrorTracking, formatApiError } from "@/hooks/use-error-tracking";
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
  Power,
  List,
  Menu,
  X,
  Clock,
  BarChart3,
  Shield,
  Zap,
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

// Mini sparkline component
function MiniSparkline({
  data,
  color = "primary",
}: {
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-px h-8 w-16">
      {data.map((value, index) => (
        <div
          key={index}
          className={`flex-1 bg-${color}/30 rounded-sm transition-all duration-300`}
          style={{
            height: `${((value - min) / range) * 100}%`,
            minHeight: "2px",
          }}
        />
      ))}
    </div>
  );
}

// Enhanced stats card with sparkline
interface EnhancedStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  className?: string;
  trend?: "up" | "down" | "neutral";
  change?: string;
  sparklineData?: number[];
  sparklineColor?: string;
}

function EnhancedStatsCard({
  title,
  value,
  subtitle,
  icon,
  badge,
  className,
  trend = "neutral",
  change,
  sparklineData,
  sparklineColor = "primary",
}: EnhancedStatsCardProps) {
  return (
    <Card
      className={`p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {change && (
              <div
                className={`flex items-center gap-1 text-xs mt-1 ${
                  trend === "up"
                    ? "text-green-500"
                    : trend === "down"
                      ? "text-red-500"
                      : "text-muted-foreground"
                }`}
              >
                <TrendingUp className="h-3 w-3" />
                {change}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {badge && (
            <Badge variant={badge.variant} className="text-xs">
              {badge.text}
            </Badge>
          )}
          {sparklineData && (
            <MiniSparkline data={sparklineData} color={sparklineColor} />
          )}
        </div>
      </div>
    </Card>
  );
}

// Prominent server status card
function ServerStatusCard({
  serverStatus,
  lastSeen,
}: {
  serverStatus: string;
  lastSeen?: string;
}) {
  const isOnline =
    serverStatus === "online" ||
    serverStatus === "active" ||
    serverStatus === "ACTIVE";

  return (
    <Card
      className={`p-6 border-2 transition-all duration-300 ${
        isOnline
          ? "border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/5 shadow-green-500/20"
          : "border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5 shadow-red-500/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-full ${isOnline ? "bg-green-500/20" : "bg-red-500/20"}`}
          >
            <Activity
              className={`h-6 w-6 ${isOnline ? "text-green-400" : "text-red-400"}`}
            />
            <div
              className={`absolute w-3 h-3 rounded-full animate-pulse ${
                isOnline ? "bg-green-400" : "bg-red-400"
              }`}
              style={{ marginTop: "-6px", marginLeft: "18px" }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Server Status</h3>
            <p
              className={`text-2xl font-bold ${isOnline ? "text-green-400" : "text-red-400"}`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
            {lastSeen && (
              <p className="text-sm text-muted-foreground">
                Last seen: {lastSeen}
              </p>
            )}
          </div>
        </div>
        <Badge
          variant={isOnline ? "default" : "destructive"}
          className={`text-sm px-3 py-1 ${
            isOnline
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-red-500/20 text-red-400 border-red-500/30"
          }`}
        >
          {isOnline ? "Active" : "Down"}
        </Badge>
      </div>
    </Card>
  );
}

// Quick actions row
function QuickActionsRow({
  onRefreshKey,
  isRefreshingKey,
}: {
  onRefreshKey: () => void;
  isRefreshingKey: boolean;
}) {
  return (
    <Card className="p-4 bg-gradient-to-r from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Quick Actions
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
          >
            <Power className="h-4 w-4 mr-2" />
            Restart Server
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshKey}
            disabled={isRefreshingKey}
            className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50"
          >
            {isRefreshingKey ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh License
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/50"
          >
            <List className="h-4 w-4 mr-2" />
            Ban List
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function EnhancedDashboardContent() {
  const { serverId } = useParams<{ serverId: string }>();
  usePageTitle("Enhanced Dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  // State management
  const [dashboardData, setDashboardData] =
    useState<ServerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error, setError, clearError } = useErrorTracking();
  const [isRefreshingKey, setIsRefreshingKey] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderCountRef = useRef(0);
  renderCountRef.current++;

  // Animation hooks
  const headerAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
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

  // Authentication check
  useEffect(() => {
    const hasToken = !!localStorage.getItem("token");
    const hasUser = !!localStorage.getItem("user");

    if (!hasToken || !hasUser) {
      navigate("/auth/signin");
      return;
    }
  }, [navigate]);

  // Load server data
  useEffect(() => {
    const loadServerData = async () => {
      if (!serverId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        clearError();

        const response = await api.servers.getServerDashboard(serverId);

        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          const errorMessage = formatApiError(response, "Failed to load server data");
          setError(errorMessage, "server_dashboard", `Server ID: ${serverId}`);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : "Unknown error occurred",
          "server_dashboard",
          `Server ID: ${serverId}, Network/Connection Error`
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadServerData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (serverId) {
        loadServerData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [serverId]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
            <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-muted rounded animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardError
        error={error.message}
        errorCode={error.code}
        context="server"
        onRetry={() => {
          clearError();
          setIsLoading(true);
          setTimeout(async () => {
            try {
              const response = await api.servers.getServerDashboard(serverId!);

              if (response.success && response.data) {
                setDashboardData(response.data);
              } else {
                const errorMessage = formatApiError(response, "Failed to load server data");
                setError(errorMessage, "server_dashboard", `Server ID: ${serverId}, Retry attempt`);
              }
            } catch (retryError) {
              setError(
                retryError instanceof Error ? retryError : "Retry failed",
                "server_dashboard",
                `Server ID: ${serverId}, Retry attempt failed`
              );
            } finally {
              setIsLoading(false);
            }
          }, 100);
        }}
        retryLabel="Retry Loading Dashboard"
        showHomeButton={true}
      />
    );
  }

  // No server selected
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

  // No data available
  if (!dashboardData) {
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
    dashboardData;
  const serverStatus = (dashboardData as any)?._apiStatus || server?.status;

  // Sample data for sparklines
  const playerTrendData = [12, 15, 18, 22, 19, 25, 30, 28];
  const banTrendData = [2, 1, 3, 0, 1, 2, 1, 0];
  const uptimeData = [98, 99, 97, 100, 99, 98, 100, 99];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
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

          <div className="flex items-center justify-between">
            <div
              className={getScrollAnimationClasses(
                headerAnimation.isVisible,
                "fade-in-up",
                "400",
                "100",
              )}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {server?.name || "Server Dashboard"}
              </h1>
              <p className="text-muted-foreground mt-1">
                Enhanced server analytics and management dashboard
              </p>
            </div>

            {/* Sidebar toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
            >
              {sidebarCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {sidebarCollapsed ? "Expand" : "Collapse"}
            </Button>
          </div>
        </div>

        {/* Quick Actions Row */}
        <QuickActionsRow
          onRefreshKey={handleRefreshKey}
          isRefreshingKey={isRefreshingKey}
        />

        {/* Prominent Server Status */}
        <ServerStatusCard
          serverStatus={serverStatus}
          lastSeen={server?.lastSeen}
        />

        {/* Enhanced Key Metrics Grid */}
        <div
          ref={statsAnimation.elementRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <EnhancedStatsCard
            title="Uptime"
            value="99.2%"
            subtitle="Last 30 days"
            icon={<Clock className="h-5 w-5" />}
            badge={{ text: "Excellent", variant: "default" }}
            trend="up"
            change="+2.1%"
            sparklineData={uptimeData}
            sparklineColor="green"
            className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20"
          />

          <EnhancedStatsCard
            title="Avg Players"
            value={onlinePlayers?.count || 0}
            subtitle="Current online"
            icon={<Users className="h-5 w-5" />}
            badge={{
              text: onlinePlayers?.count > 0 ? "Active" : "Inactive",
              variant: onlinePlayers?.count > 0 ? "default" : "secondary",
            }}
            trend="up"
            change="+12%"
            sparklineData={playerTrendData}
            sparklineColor="blue"
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20"
          />

          <EnhancedStatsCard
            title="Recent Bans"
            value={totalBans?.count || 0}
            subtitle="Last 24 hours"
            icon={<Ban className="h-5 w-5" />}
            badge={{
              text: totalBans?.activeBans > 0 ? "Active" : "Clean",
              variant: totalBans?.activeBans > 0 ? "destructive" : "default",
            }}
            trend="down"
            change="-5%"
            sparklineData={banTrendData}
            sparklineColor="red"
            className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20"
          />

          <EnhancedStatsCard
            title="Performance"
            value="95%"
            subtitle="Server efficiency"
            icon={<BarChart3 className="h-5 w-5" />}
            badge={{ text: "Optimal", variant: "default" }}
            trend="up"
            change="+3%"
            sparklineData={[92, 94, 93, 95, 97, 95, 96, 95]}
            sparklineColor="purple"
            className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20"
          />
        </div>

        {/* Enhanced Analytics Section */}
        <div
          ref={chartsAnimation.elementRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300">
              <Tabs defaultValue="combined" className="w-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Player Activity vs Security Events
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Combined analysis of player peaks and security activity
                      </p>
                    </div>
                    <TabsList className="grid w-auto grid-cols-3">
                      <TabsTrigger value="combined">Combined</TabsTrigger>
                      <TabsTrigger value="week">7 Days</TabsTrigger>
                      <TabsTrigger value="month">30 Days</TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                <CardContent>
                  <TabsContent value="combined" className="space-y-4">
                    <ServerAnalyticsChart period="today" />
                  </TabsContent>
                  <TabsContent value="week" className="space-y-4">
                    <ServerAnalyticsChart period="week" />
                  </TabsContent>
                  <TabsContent value="month" className="space-y-4">
                    <ServerAnalyticsChart period="month" />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div
            className={`space-y-6 transition-all duration-300 ${sidebarCollapsed ? "opacity-50 pointer-events-none" : ""}`}
          >
            {/* License Key - Smaller Card */}
            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Key className="h-4 w-4 text-primary" />
                  License Key
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div
                  className="font-mono text-xs p-2 bg-muted/50 rounded border cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => {
                    if (license?.key) {
                      navigator.clipboard.writeText(license.key);
                      toast({
                        title: "Copied",
                        description: "License key copied to clipboard",
                      });
                    }
                  }}
                >
                  {license?.key || "Loading..."}
                </div>
              </CardContent>
            </Card>

            {/* Server Health */}
            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  Server Health
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CPU Usage</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="font-medium">62%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "62%" }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">23%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "23%" }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">Player joined</span>
                    <span className="ml-auto">2m ago</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-muted-foreground">
                      Security alert
                    </span>
                    <span className="ml-auto">5m ago</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-muted-foreground">
                      Config updated
                    </span>
                    <span className="ml-auto">12m ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
