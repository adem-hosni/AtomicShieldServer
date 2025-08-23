import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ServerStatusIndicator } from "@/components/ui/server-status-indicator";
import {
  Server,
  Users,
  Ban,
  TrendingUp,
  Eye,
  EyeOff,
  Calendar,
  Activity,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { ServerAnalyticsChart } from "./ServerAnalyticsChart";
import { ThreatActivityChart } from "./ThreatActivityChart";
import {
  useScrollAnimation,
  getScrollAnimationClasses,
} from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/hooks/use-language";
import { usePageTitle } from "@/hooks/use-page-title";
import { api, authManager } from "@/lib/api-client";
import {
  DashboardData,
  DashboardStatsData,
  ServerData,
  ActivityItem,
  ThreatAssessmentData,
  ThreatActivityDataPoint,
  GlobalStatsData,
} from "@shared/api";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    pulse?: boolean;
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
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {badge && (
            <Badge
              variant={badge.variant || "secondary"}
              className={badge.pulse ? "animate-pulse" : ""}
            >
              {badge.text}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricBlockProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

function MetricBlock({ label, value, change, trend }: MetricBlockProps) {
  return (
    <div className="space-y-2">
      <div className="text-2xl font-bold">{value}</div>
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">{label}</div>
        {change && (
          <div
            className={`text-xs flex items-center gap-1 ${
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
  );
}

interface ServerCardProps {
  server: ServerData;
  isParentVisible: boolean;
  index: number;
}

function ServerCard({ server, isParentVisible, index }: ServerCardProps) {
  const animationClasses = getScrollAnimationClasses(
    isParentVisible,
    "slide-in-bottom",
    "500",
    `${index * 150}`,
  );

  return (
    <Card
      className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${animationClasses}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Server className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{server.name}</h3>
              <div className="flex items-center gap-2">
                <ServerStatusIndicator
                  status={server.status}
                  size="md"
                  showText={false}
                />
                <Badge
                  variant={
                    server.status === "ACTIVE" || server.status === "active"
                      ? "default"
                      : server.status === "TESTING"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {server.status === "ACTIVE" || server.status === "active"
                    ? "Online"
                    : server.status === "TESTING"
                      ? "Testing"
                      : "Offline"}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {server.description}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {server.playerCount} players
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityCardProps {
  activity: ActivityItem[];
  isParentVisible: boolean;
}

function ActivityCard({ activity, isParentVisible }: ActivityCardProps) {
  const animationClasses = getScrollAnimationClasses(
    isParentVisible,
    "fade-in",
    "700",
    "300",
  );

  return (
    <Card
      className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 ${animationClasses}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activity.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  item.severity === "critical"
                    ? "bg-red-500"
                    : item.severity === "high"
                      ? "bg-orange-500"
                      : item.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                }`}
              />
              <div>
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.user}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{item.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const { t } = useLanguage();
  usePageTitle("Overview");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    authManager.isAuthenticated(),
  );

  // Scroll animation hooks for different sections - use immediate visibility for dashboard
  const headerAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });
  const statsAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });
  const serversAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });
  const activityAnimation = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Force immediate visibility for dashboard content
  const [forceVisible, setForceVisible] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.dashboard.getOverview();

        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          if (response.error?.includes("Authentication required")) {
            setIsAuthenticated(false);
            setError("Session expired. Please sign in again.");
          } else {
            setError(response.error || "Failed to load dashboard data");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError =
      error.includes("Authentication") || error.includes("Session expired");

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <Card
            className={
              isAuthError
                ? "bg-primary/10 border-primary/20"
                : "bg-destructive/10 border-destructive/20"
            }
          >
            <CardContent className="p-6">
              <div
                className={`flex items-center gap-2 ${isAuthError ? "text-primary" : "text-destructive"}`}
              >
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-semibold">
                  {isAuthError
                    ? "Authentication Required"
                    : "Error Loading Dashboard"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
              {isAuthError && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm">Demo credentials:</p>
                  <p className="text-xs text-muted-foreground">
                    Email: admin@atomicshield.com
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Password: admin123
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => {
                        // Clear all auth data and retry
                        authManager.clearToken();
                        localStorage.clear();
                        window.location.reload();
                      }}
                      variant="outline"
                    >
                      Clear & Retry
                    </Button>
                    <Button
                      onClick={() => (window.location.href = "/auth/signin")}
                    >
                      Go to Sign In
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          ref={headerAnimation.elementRef}
          className={getScrollAnimationClasses(
            headerAnimation.isVisible || forceVisible,
            "fade-in",
            "700",
          )}
        >
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t("dashboard")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header & Stats Cards */}
        <div className="space-y-4">
          <div
            className={getScrollAnimationClasses(
              headerAnimation.isVisible || forceVisible,
              "slide-in-bottom",
              "700",
              "200",
            )}
          >
            <h1 className="text-3xl font-bold tracking-tight">
              AtomicShield Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor your anti-cheat system and server performance
            </p>
          </div>

          <div
            ref={statsAnimation.elementRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatsCard
              title="System Status"
              value={
                dashboardData.stats.systemStatus.value === 100
                  ? "Online"
                  : "Issues"
              }
              icon={<Shield className="h-4 w-4" />}
              badge={dashboardData.stats.systemStatus.badge}
              className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20"
              isParentVisible={statsAnimation.isVisible || forceVisible}
              index={0}
            />

            <StatsCard
              title="Total Servers"
              value={dashboardData.stats.totalServers.value}
              subtitle={dashboardData.stats.totalServers.subtitle}
              icon={<Server className="h-4 w-4" />}
              className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20"
              isParentVisible={statsAnimation.isVisible || forceVisible}
              index={1}
            />

            <StatsCard
              title="Network Players"
              value={dashboardData.stats.networkPlayers.value.toLocaleString()}
              subtitle={dashboardData.stats.networkPlayers.subtitle}
              icon={<Users className="h-4 w-4" />}
              className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20"
              isParentVisible={statsAnimation.isVisible || forceVisible}
              index={2}
            />

            <StatsCard
              title="Threat Level"
              value={dashboardData.stats.threatLevel.value}
              subtitle={dashboardData.stats.threatLevel.subtitle}
              icon={<AlertTriangle className="h-4 w-4" />}
              badge={dashboardData.stats.threatLevel.badge}
              className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20"
              isParentVisible={statsAnimation.isVisible || forceVisible}
              index={3}
            />
          </div>
        </div>

        {/* Servers Grid */}
        <div ref={serversAnimation.elementRef} className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Active Servers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.servers.map((server, index) => (
              <ServerCard
                key={server.id}
                server={server}
                isParentVisible={serversAnimation.isVisible || forceVisible}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Activity and Stats Grid */}
        <div
          ref={activityAnimation.elementRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <ActivityCard
            activity={dashboardData.recentActivity}
            isParentVisible={activityAnimation.isVisible || forceVisible}
          />

          <Card
            className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 ${getScrollAnimationClasses(activityAnimation.isVisible, "fade-in", "700", "300")}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                Global Statistics (24h)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricBlock
                  label="Total Bans"
                  value={dashboardData.globalStats.totalBans24h.toString()}
                />
                <MetricBlock
                  label="Player Kicks"
                  value={dashboardData.globalStats.kicks24h.toString()}
                />
                <MetricBlock
                  label="Warnings"
                  value={dashboardData.globalStats.warnings24h.toString()}
                />
                <MetricBlock
                  label="Clean Sessions"
                  value={dashboardData.globalStats.cleanSessions.toLocaleString()}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Server Analytics Chart */}
        <Card
          className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 ${getScrollAnimationClasses(activityAnimation.isVisible || forceVisible, "slide-in-bottom", "700", "400")}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Server Analytics
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Player activity and ban statistics over time
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
                <ServerAnalyticsChart period="today" data={[]} />
              </TabsContent>
              <TabsContent value="week" className="space-y-4">
                <ServerAnalyticsChart period="week" data={[]} />
              </TabsContent>
              <TabsContent value="month" className="space-y-4">
                <ServerAnalyticsChart period="month" data={[]} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Threat Activity Chart */}
        <Card
          className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 ${getScrollAnimationClasses(activityAnimation.isVisible || forceVisible, "slide-in-bottom", "700", "500")}`}
        >
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
                  data={dashboardData.threatActivity}
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

        {/* Threat Assessment */}
        <Card
          className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 ${getScrollAnimationClasses(activityAnimation.isVisible || forceVisible, "slide-in-bottom", "700", "600")}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Threat Assessment
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Current anti-cheat performance metrics
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricBlock
                label="Detection Rate"
                value={dashboardData.threatAssessment.detectionRate}
                change="Excellent"
                trend="up"
              />
              <MetricBlock
                label="False Positives"
                value={dashboardData.threatAssessment.falsePositives}
                change="Very Low"
                trend="up"
              />
              <MetricBlock
                label="Response Time"
                value={dashboardData.threatAssessment.responseTime}
                change="Optimal"
                trend="up"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
