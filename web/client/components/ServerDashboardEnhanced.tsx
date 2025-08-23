import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  TrendingDown,
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
  Eye,
  Settings,
  Download,
  Bell,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
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

// Enhanced Metric Card with improved styling and animations
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "red" | "purple" | "orange" | "cyan";
  size?: "sm" | "md" | "lg";
  sparklineData?: number[];
  actions?: React.ReactNode;
  isLoading?: boolean;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend = "neutral",
  trendValue,
  color = "blue",
  size = "md",
  sparklineData,
  actions,
  isLoading = false,
}: MetricCardProps) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400",
    green:
      "from-green-500/10 to-green-600/5 border-green-500/20 text-green-400",
    red: "from-red-500/10 to-red-600/5 border-red-500/20 text-red-400",
    purple:
      "from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400",
    orange:
      "from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-400",
    cyan: "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-400",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} hover:shadow-xl hover:shadow-${color}-500/10 metric-card-hover group border-2 glass-effect`}
    >
      <CardContent className={sizeClasses[size]}>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-muted/50 rounded animate-pulse" />
            <div className="h-8 bg-muted/50 rounded animate-pulse" />
            <div className="h-3 bg-muted/50 rounded w-2/3 animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl bg-${color}-500/20 group-hover:scale-110 transition-transform duration-300`}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {title}
                  </p>
                  <p className="text-3xl font-bold text-foreground group-hover:text-foreground/90 transition-colors">
                    {value}
                  </p>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              {actions && (
                <div className="flex items-center gap-2">{actions}</div>
              )}
            </div>

            {(trendValue || sparklineData) && (
              <div className="mt-4 flex items-center justify-between">
                {trendValue && (
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon()}
                    <span
                      className={
                        trend === "up"
                          ? "text-green-500"
                          : trend === "down"
                            ? "text-red-500"
                            : "text-muted-foreground"
                      }
                    >
                      {trendValue}
                    </span>
                  </div>
                )}
                {sparklineData && (
                  <div className="flex items-end gap-px h-8 w-16">
                    {sparklineData.map((value, index) => (
                      <div
                        key={index}
                        className={`flex-1 bg-${color}-500/30 rounded-sm transition-all duration-300 group-hover:bg-${color}-500/50`}
                        style={{
                          height: `${(value / Math.max(...sparklineData)) * 100}%`,
                          minHeight: "2px",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Enhanced Status Card with real-time indicators
function StatusCard({
  status,
  lastSeen,
  serverInfo,
}: {
  status: string;
  lastSeen?: string;
  serverInfo?: any;
}) {
  const isOnline =
    status === "online" || status === "active" || status === "ACTIVE";

  return (
    <Card
      className={`relative overflow-hidden border-2 transition-all duration-500 ${
        isOnline
          ? "border-green-500/40 bg-gradient-to-br from-green-500/10 via-green-600/5 to-background shadow-green-500/20"
          : "border-red-500/40 bg-gradient-to-br from-red-500/10 via-red-600/5 to-background shadow-red-500/20"
      }`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,${isOnline ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"},transparent_50%)]`}
        />
      </div>

      <CardContent className="p-8 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div
                className={`p-4 rounded-2xl ${isOnline ? "bg-green-500/20" : "bg-red-500/20"} transition-all duration-300`}
              >
                <Activity
                  className={`h-8 w-8 ${isOnline ? "text-green-400" : "text-red-400"}`}
                />
              </div>
              {/* Pulse indicator */}
              <div
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full animate-status-pulse ${
                  isOnline ? "bg-green-400" : "bg-red-400"
                }`}
              />
              {isOnline && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 animate-ping" />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-1">Server Status</h3>
              <div className="flex items-center gap-3">
                <p
                  className={`text-4xl font-bold ${isOnline ? "text-green-400" : "text-red-400"}`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
                <Badge
                  variant={isOnline ? "default" : "destructive"}
                  className={`text-sm px-4 py-1 ${
                    isOnline
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  {isOnline ? "Active" : "Down"}
                </Badge>
              </div>
              {lastSeen && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last seen: {lastSeen}
                </p>
              )}
            </div>
          </div>

          {/* Server Info Panel */}
          {serverInfo && (
            <div className="text-right space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>Version 1.20.4</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Cpu className="h-4 w-4" />
                <span>CPU: 45%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HardDrive className="h-4 w-4" />
                <span>RAM: 2.1GB / 8GB</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Actions Panel with enhanced styling
function QuickActionsPanel({
  onRefreshKey,
  isRefreshingKey,
  serverId,
}: {
  onRefreshKey: () => void;
  isRefreshingKey: boolean;
  serverId?: string;
}) {
  const navigate = useNavigate();

  const actions = [
    {
      label: "View Players",
      icon: <Users className="h-4 w-4" />,
      color: "blue",
      onClick: () => navigate(`/dashboard/server/${serverId}/players`),
    },
    {
      label: "Manage Bans",
      icon: <Ban className="h-4 w-4" />,
      color: "red",
      onClick: () => navigate(`/dashboard/server/${serverId}/bans`),
    },
    {
      label: "Configuration",
      icon: <Settings className="h-4 w-4" />,
      color: "purple",
      onClick: () => navigate(`/dashboard/server/${serverId}/config`),
    },
    {
      label: "Restart Server",
      icon: <Power className="h-4 w-4" />,
      color: "orange",
      onClick: () => {},
      variant: "destructive" as const,
    },
    {
      label: "Refresh License",
      icon: isRefreshingKey ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      ),
      color: "green",
      onClick: onRefreshKey,
      disabled: isRefreshingKey,
    },
  ];

  return (
    <Card className="bg-gradient-to-r from-background/95 to-background/80 backdrop-blur-xl border-primary/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled}
              className={`h-auto p-2 md:p-3 flex flex-col items-center gap-1 md:gap-2 transition-all duration-300 hover:scale-105 btn-touch ${
                action.color === "blue"
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                  : action.color === "red"
                    ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                    : action.color === "purple"
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                      : action.color === "orange"
                        ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                        : action.color === "green"
                          ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                          : ""
              }`}
            >
              {action.icon}
              <span className="text-xs font-medium text-center">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ServerDashboardEnhanced() {
  const { serverId } = useParams<{ serverId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  // State management
  const [dashboardData, setDashboardData] =
    useState<ServerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingKey, setIsRefreshingKey] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Animation hooks
  const headerAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });
  const metricsAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });
  const chartsAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Load server data
  useEffect(() => {
    const loadServerData = async () => {
      if (!serverId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await api.servers.getServerDashboard(serverId);

        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError(response.error || "Failed to load server data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadServerData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadServerData, 30000);
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
        setTimeout(() => window.location.reload(), 1000);
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
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
            <div className="h-8 bg-muted rounded w-64 animate-pulse" />
          </div>
          <div className="h-32 bg-muted rounded animate-pulse" />
          <div className="h-48 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <div>
            <h3 className="text-2xl font-semibold">Unable to Load Dashboard</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!serverId || !dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Server className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-2xl font-semibold">No Server Selected</h3>
            <p className="text-muted-foreground">
              Select a server from the sidebar to view its dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { server, onlinePlayers, totalBans, recentBans, analytics, license } =
    dashboardData;
  const serverStatus = (dashboardData as any)?._apiStatus || server?.status;

  // Sample trend data - in real implementation, this would come from API
  const playerTrendData = [12, 15, 18, 22, 19, 25, 30, 28];
  const banTrendData = [2, 1, 3, 0, 1, 2, 1, 0];
  const uptimeData = [98, 99, 97, 100, 99, 98, 100, 99];
  const performanceData = [92, 94, 93, 95, 97, 95, 96, 95];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Enhanced Header */}
        <div ref={headerAnimation.elementRef} className="space-y-6">
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
                <BreadcrumbLink href="/dashboard/overview">
                  Dashboard
                </BreadcrumbLink>
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
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text-primary">
                {server?.name || "Server Dashboard"}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base lg:text-lg">
                Real-time server monitoring and analytics dashboard
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 text-xs md:text-sm"
              >
                <Activity className="h-3 w-3 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Live Updates</span>
                <span className="sm:hidden">Live</span>
              </Badge>
              <Button variant="outline" size="sm" className="mobile-hidden">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
            </div>
          </div>
        </div>

        {/* Server Status - Most Prominent */}
        <StatusCard
          status={serverStatus}
          lastSeen={server?.lastSeen}
          serverInfo={{}}
        />

        {/* Quick Actions Panel */}
        <QuickActionsPanel
          onRefreshKey={handleRefreshKey}
          isRefreshingKey={isRefreshingKey}
          serverId={serverId}
        />

        {/* Key Metrics Grid - Enhanced */}
        <div ref={metricsAnimation.elementRef} className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Server Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <MetricCard
              title="Server Uptime"
              value="99.8%"
              subtitle="Last 30 days"
              icon={<Clock className="h-6 w-6" />}
              trend="up"
              trendValue="+2.1% from last month"
              color="green"
              sparklineData={uptimeData}
            />

            <MetricCard
              title="Active Players"
              value={onlinePlayers?.count || 0}
              subtitle="Currently online"
              icon={<Users className="h-6 w-6" />}
              trend={onlinePlayers?.count > 15 ? "up" : "neutral"}
              trendValue={`${onlinePlayers?.count > 15 ? "+" : ""}${onlinePlayers?.count || 0} from yesterday`}
              color="blue"
              sparklineData={playerTrendData}
              actions={
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              }
            />

            <MetricCard
              title="Security Events"
              value={totalBans?.count || 0}
              subtitle="Last 24 hours"
              icon={<Shield className="h-6 w-6" />}
              trend="down"
              trendValue="-12% from yesterday"
              color="red"
              sparklineData={banTrendData}
            />

            <MetricCard
              title="Performance"
              value="94.2%"
              subtitle="Server efficiency"
              icon={<Cpu className="h-6 w-6" />}
              trend="up"
              trendValue="+3.2% improvement"
              color="purple"
              sparklineData={performanceData}
            />
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <MetricCard
            title="Memory Usage"
            value="68%"
            subtitle="2.1GB / 8GB"
            icon={<HardDrive className="h-5 w-5" />}
            color="orange"
            size="sm"
          />

          <MetricCard
            title="Network I/O"
            value="124 MB/s"
            subtitle="↑ 89MB/s ↓ 35MB/s"
            icon={<Wifi className="h-5 w-5" />}
            color="cyan"
            size="sm"
          />

          <MetricCard
            title="Active Connections"
            value="847"
            subtitle="Peak: 1,205"
            icon={<Globe className="h-5 w-5" />}
            color="blue"
            size="sm"
          />

          <MetricCard
            title="Error Rate"
            value="0.02%"
            subtitle="2 errors/hour"
            icon={<AlertCircle className="h-5 w-5" />}
            color="green"
            size="sm"
          />
        </div>

        {/* Analytics Section with Tabs */}
        <div ref={chartsAnimation.elementRef} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Analytics & Insights
            </h2>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-auto grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="players">Players</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Tabs value={activeTab} className="w-full">
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Server Activity Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ServerAnalyticsChart period="today" />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* License Info */}
                  <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Key className="h-5 w-5 text-primary" />
                        License Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Status
                          </span>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Type
                          </span>
                          <span className="text-sm font-medium">Premium</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Expires
                          </span>
                          <span className="text-sm font-medium">
                            Dec 31, 2024
                          </span>
                        </div>
                        <div className="bg-muted/50 rounded p-2 mt-4">
                          <p className="text-xs font-mono break-all text-muted-foreground">
                            {license?.key ||
                              "••••••••-••••-••••-••••-••••••••••••"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="h-5 w-5 text-primary" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span>Player joined: xXGamerXx</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            2m ago
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <span>Suspicious activity detected</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            5m ago
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span>Server restarted</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            1h ago
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="players">
              <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
                <CardHeader>
                  <CardTitle>Player Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ServerAnalyticsChart period="week" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
                <CardHeader>
                  <CardTitle>Security Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ServerAnalyticsChart period="month" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
