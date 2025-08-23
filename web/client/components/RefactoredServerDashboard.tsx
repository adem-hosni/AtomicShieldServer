import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server,
  Users,
  Ban,
  TrendingUp,
  Loader2,
  AlertCircle,
  Key,
  RefreshCw,
  Power,
  Clock,
  BarChart3,
  Shield,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ServerAnalyticsChart } from "./ServerAnalyticsChart";
import { useLanguage } from "@/hooks/use-language";
import { ServerDashboardData } from "@shared/api";
import { api } from "@/lib/api-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Sample data for the charts
const samplePlayerData = [
  { time: "00:00", players: 150, bans: 2 },
  { time: "02:00", players: 120, bans: 1 },
  { time: "04:00", players: 80, bans: 0 },
  { time: "06:00", players: 60, bans: 0 },
  { time: "08:00", players: 200, bans: 3 },
  { time: "10:00", players: 350, bans: 1 },
  { time: "12:00", players: 420, bans: 2 },
  { time: "14:00", players: 480, bans: 4 },
  { time: "16:00", players: 520, bans: 1 },
  { time: "18:00", players: 580, bans: 2 },
  { time: "20:00", players: 650, bans: 3 },
  { time: "22:00", players: 720, bans: 1 },
];

const sampleThreatData = [
  { time: "00:00", threats: 5, resolved: 4 },
  { time: "02:00", threats: 3, resolved: 3 },
  { time: "04:00", threats: 1, resolved: 1 },
  { time: "06:00", threats: 2, resolved: 2 },
  { time: "08:00", threats: 8, resolved: 6 },
  { time: "10:00", threats: 12, resolved: 10 },
  { time: "12:00", threats: 15, resolved: 13 },
  { time: "14:00", threats: 18, resolved: 16 },
  { time: "16:00", threats: 14, resolved: 12 },
  { time: "18:00", threats: 20, resolved: 18 },
  { time: "20:00", threats: 22, resolved: 20 },
  { time: "22:00", threats: 16, resolved: 15 },
];

// Metric Card Component
function MetricCard({
  title,
  value,
  subtitle,
  icon,
  status,
  className = "",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  status?: "online" | "offline" | "inactive";
  className?: string;
}) {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "text-green-500";
      case "offline":
        return "text-red-500";
      case "inactive":
        return "text-gray-500";
      default:
        return "text-primary";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
            Active
          </Badge>
        );
      case "offline":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
            Offline
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">
            Inactive
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`${getStatusColor()}`}>{icon}</div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardContent>
    </Card>
  );
}

// Server Status Card Component
function ServerStatusCard({
  status,
  lastSeen,
}: {
  status: string;
  lastSeen?: string;
}) {
  const isOnline = status === "online";

  return (
    <Card
      className={`border-2 ${isOnline ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${isOnline ? "bg-green-500/20" : "bg-red-500/20"}`}
              >
                <Power
                  className={`h-5 w-5 ${isOnline ? "text-green-500" : "text-red-500"}`}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Server Status</h3>
                <p className="text-sm text-muted-foreground">
                  {isOnline
                    ? "Server is running normally"
                    : `Last seen: ${lastSeen || "Unknown"}`}
                </p>
              </div>
            </div>
          </div>
          <Badge
            className={`text-lg px-4 py-2 ${
              isOnline
                ? "bg-green-500/20 text-green-500 border-green-500/30"
                : "bg-red-500/20 text-red-500 border-red-500/30"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// License Key Management Component
function LicenseKeyManagement({
  licenseKey,
  onRefresh,
  isRefreshing,
}: {
  licenseKey?: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (licenseKey) {
      navigator.clipboard.writeText(licenseKey);
      toast({
        title: "Copied",
        description: "License key copied to clipboard",
      });
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          License Key Management
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate a new license key for your server. This will refresh your
          server's authentication credentials.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 font-mono text-sm p-3 bg-muted/50 rounded border flex items-center gap-2">
            <span className={isVisible ? "" : "blur-sm select-none"}>
              {licenseKey || "Loading..."}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="px-3"
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!licenseKey}
            className="px-3"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh License Key
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export function RefactoredServerDashboard() {
  const { serverId } = useParams<{ serverId: string }>();
  const [dashboardData, setDashboardData] =
    useState<ServerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingKey, setIsRefreshingKey] = useState(false);
  const { toast } = useToast();

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!serverId) return;

      try {
        setIsLoading(true);
        const response = await api.servers.getServerDashboard(serverId);

        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError(response.error || "Failed to load dashboard data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [serverId]);

  const handleRefreshKey = async () => {
    if (!serverId) return;

    try {
      setIsRefreshingKey(true);
      const response = await api.servers.refreshServerKey(serverId);

      if (response.success) {
        toast({
          title: "Success",
          description: "License key refreshed successfully",
        });

        // Reload dashboard data to get new key
        const dashboardResponse =
          await api.servers.getServerDashboard(serverId);
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        }
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to refresh license key",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingKey(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Loading Dashboard</h3>
            <p className="text-muted-foreground">Fetching server data...</p>
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
            <p className="text-muted-foreground">{error}</p>
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

  const { server, onlinePlayers, totalBans, license } = dashboardData;
  const serverStatus = server?.status || "offline";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {server?.name || "Server Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            Server monitoring and management dashboard
          </p>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Online Players"
            value={onlinePlayers?.count || 0}
            subtitle="Currently online"
            icon={<Users className="h-5 w-5" />}
            status={onlinePlayers?.count > 0 ? "online" : "inactive"}
          />

          <MetricCard
            title="Total Bans"
            value={totalBans?.count || 0}
            subtitle="Active bans"
            icon={<Ban className="h-5 w-5" />}
            status={totalBans?.count > 0 ? "online" : "inactive"}
          />

          <MetricCard
            title="Server Status"
            value={serverStatus === "online" ? "Online" : "Offline"}
            subtitle={
              serverStatus === "online" ? "Server running" : "Server offline"
            }
            icon={<Server className="h-5 w-5" />}
            status={serverStatus as "online" | "offline"}
          />

          <MetricCard
            title="License Key"
            value="Active"
            subtitle="Valid license"
            icon={<Key className="h-5 w-5" />}
            status="online"
          />
        </div>

        {/* Server Status Card */}
        <ServerStatusCard status={serverStatus} lastSeen={server?.lastSeen} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Server Analytics Chart */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Server Analytics
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Player activity and performance metrics
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">Last 7 Days</TabsTrigger>
                  <TabsTrigger value="month">Last 30 Days</TabsTrigger>
                </TabsList>
                <TabsContent value="today" className="space-y-4">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={samplePlayerData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="time"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="players"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="week" className="space-y-4">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={samplePlayerData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="time"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="players"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="month" className="space-y-4">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={samplePlayerData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="time"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="players"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Threat Activity Chart */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Threat Activity
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Security threats and resolution metrics
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleThreatData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="threats"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                      name="Threats Detected"
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                      name="Threats Resolved"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Server Management Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Server Management</h2>
          <div className="max-w-2xl">
            <LicenseKeyManagement
              licenseKey={license?.key}
              onRefresh={handleRefreshKey}
              isRefreshing={isRefreshingKey}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
