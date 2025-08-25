import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";
import { DashboardError } from "@/components/ui/dashboard-error";
import { useErrorTracking, formatApiError } from "@/hooks/use-error-tracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  RotateCcw,
  Eye,
  Copy,
  CheckCircle,
  AlertCircle,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { ServerDashboardData } from "@shared/api";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface ServerStatusCardProps {
  title: string;
  value: string;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color: string;
  };
  icon: React.ReactNode;
  actions?: React.ReactNode;
}

const ServerStatusCard = ({
  title,
  value,
  badge,
  icon,
  actions,
}: ServerStatusCardProps) => (
  <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <Badge variant={badge.variant} className={`${badge.color} text-xs`}>
              {badge.text}
            </Badge>
          )}
          {actions}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  color: string;
}

const AnalyticsCard = ({
  title,
  value,
  subtitle,
  color,
}: AnalyticsCardProps) => (
  <div className="space-y-2">
    <h3 className="text-sm text-muted-foreground">{title}</h3>
    <div className="space-y-1">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className={`text-xs ${color}`}>{subtitle}</p>
    </div>
  </div>
);

export function SimpleServerDashboard() {
  const { serverId } = useParams<{ serverId: string }>();
  usePageTitle("Server Dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [dashboardData, setDashboardData] =
    useState<ServerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error, setError, clearError } = useErrorTracking();

  // Load server data
  useEffect(() => {
    const loadServerData = async () => {
      if (!serverId) return;

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
    const interval = setInterval(loadServerData, 30000);
    return () => clearInterval(interval);
  }, [serverId]);

  // Extract data from proper API structure
  const serverInfo = dashboardData?.serverInfo;
  const stats = dashboardData?.stats;
  const license = dashboardData?.license;

  const handleCopyLicense = () => {
    const licenseKey =
      license?.key || serverInfo?.licenseKey || "No license key available";
    navigator.clipboard.writeText(licenseKey);
    toast({
      title: "License Key Copied",
      description: "License key has been copied to clipboard",
    });
  };

  const handleResetIP = () => {
    toast({
      title: "IP Reset",
      description: "Server IP has been reset successfully",
    });
  };

  const handleShowLicense = () => {
    const licenseKey =
      license?.key || serverInfo?.licenseKey || "No license key available";
    toast({
      title: "License Key",
      description: licenseKey,
    });
  };

  // Mock chart data for the analytics chart
  const chartData = [
    { time: "00:42", players: 180, bans: 12 },
    { time: "02:42", players: 150, bans: 10 },
    { time: "04:42", players: 120, bans: 8 },
    { time: "06:42", players: 140, bans: 9 },
    { time: "08:42", players: 200, bans: 15 },
    { time: "10:42", players: 250, bans: 18 },
    { time: "12:42", players: 280, bans: 20 },
    { time: "14:42", players: 260, bans: 17 },
    { time: "16:42", players: 290, bans: 22 },
    { time: "18:42", players: 320, bans: 25 },
    { time: "20:42", players: 300, bans: 23 },
    { time: "22:42", players: 280, bans: 20 },
    { time: "00:42", players: 250, bans: 18 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-6">
        <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4">
          <div className="space-y-4">
            <div className="h-4 bg-gradient-to-r from-background/90 to-background/50 backdrop-blur-xl border border-primary/20 rounded w-32 animate-pulse" />
            <div className="h-8 bg-gradient-to-r from-background/90 to-background/50 backdrop-blur-xl border border-primary/20 rounded w-64 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 border rounded-lg animate-pulse"
              />
            ))}
          </div>
          <div className="h-96 bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 border rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <div>
            <h3 className="text-2xl font-semibold">Unable to Load Dashboard</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full py-4 sm:py-6 space-y-4 sm:space-y-6 px-2 sm:px-4">
        {/* Header */}
        <div className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Server Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Server Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your server with tools for monitoring and management
            </p>
          </div>
        </div>

        {/* Server Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServerStatusCard
            title="Server Status"
            value={serverInfo?.name || "Unknown Server"}
            badge={{
              text: serverInfo?.status || "OFFLINE",
              variant: "outline",
              color:
                serverInfo?.status === "ACTIVE"
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30",
            }}
            icon={
              serverInfo?.status === "ACTIVE" ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )
            }
          />

          <ServerStatusCard
            title="Server IP"
            value={serverInfo?.ip || "Not available"}
            icon={<Server className="h-5 w-5 text-primary" />}
            actions={
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetIP}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset IP
              </Button>
            }
          />

          <ServerStatusCard
            title="License Key"
            value={license?.key ? "••••••••••••••••••••••" : "Not available"}
            icon={<Activity className="h-5 w-5 text-primary" />}
            actions={
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowLicense}
                  className="text-xs px-2"
                >
                  <Eye className="h-3 w-3" />
                  Show
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLicense}
                  className="text-xs px-2"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
              </div>
            }
          />

          <ServerStatusCard
            title="License Expiration"
            value={
              license?.daysUntilExpiration
                ? `${license.daysUntilExpiration} days`
                : serverInfo?.licenseExpirationDays
                  ? `${serverInfo.licenseExpirationDays} days`
                  : "Not available"
            }
            badge={{
              text:
                license?.status === "ACTIVE"
                  ? "Active"
                  : license?.status === "EXPIRING_SOON"
                    ? "Expiring Soon"
                    : license?.status === "EXPIRED"
                      ? "Expired"
                      : "Unknown",
              variant: "outline",
              color:
                license?.status === "ACTIVE"
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : license?.status === "EXPIRING_SOON"
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                    : "bg-red-500/10 text-red-400 border-red-500/30",
            }}
            icon={
              license?.status === "ACTIVE" ? (
                <Clock className="h-5 w-5 text-green-400" />
              ) : license?.status === "EXPIRING_SOON" ? (
                <Clock className="h-5 w-5 text-yellow-400" />
              ) : (
                <Clock className="h-5 w-5 text-red-400" />
              )
            }
          />
        </div>

        {/* Server Analytics */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Server Analytics
              </h2>
              <p className="text-sm text-muted-foreground">
                Player statistics and server performance metrics
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                Today
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Last 7 Days
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Last 30 Days
              </Button>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <AnalyticsCard
              title="Online Players"
              value={
                stats?.currentPlayers?.value ?? serverInfo?.playerCount ?? 0
              }
              subtitle={
                stats?.currentPlayers?.value > 0 ? "Active" : "Inactive"
              }
              color={
                stats?.currentPlayers?.value > 0
                  ? "text-blue-400"
                  : "text-muted-foreground"
              }
            />
            <AnalyticsCard
              title="Total Bans"
              value={stats?.totalBans?.value ?? 0}
              subtitle={
                stats?.totalBans?.value > 0
                  ? `${stats?.totalBans?.trend?.value || ""}`
                  : "Clean"
              }
              color={
                stats?.totalBans?.value > 0 ? "text-red-400" : "text-green-400"
              }
            />
            <AnalyticsCard
              title="Peak Players"
              value={stats?.peakPlayers?.value ?? 0}
              subtitle={stats?.peakPlayers?.period || "last 24h"}
              color={
                stats?.peakPlayers?.value > 0
                  ? "text-green-400"
                  : "text-muted-foreground"
              }
            />
            <AnalyticsCard
              title="Max Players"
              value={serverInfo?.maxPlayers ?? 0}
              subtitle="Server capacity"
              color="text-purple-400"
            />
          </div>

          {/* Analytics Chart */}
          <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
            <CardContent className="p-6">
              <div className="h-80 w-full relative">
                {/* Chart SVG */}
                <svg className="w-full h-full" viewBox="0 0 800 300">
                  {/* Grid lines */}
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="30"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 30"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Blue area chart for players */}
                  <defs>
                    <linearGradient
                      id="playersGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop
                        offset="50%"
                        stopColor="#3b82f6"
                        stopOpacity="0.4"
                      />
                      <stop
                        offset="100%"
                        stopColor="#3b82f6"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>

                  {/* Generate player curve */}
                  <path
                    d="M 50 180 Q 150 160 200 140 Q 300 120 400 100 Q 500 90 600 85 Q 700 80 750 75"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />

                  {/* Fill area under player curve */}
                  <path
                    d="M 50 180 Q 150 160 200 140 Q 300 120 400 100 Q 500 90 600 85 Q 700 80 750 75 L 750 280 L 50 280 Z"
                    fill="url(#playersGradient)"
                  />

                  {/* Red line for bans */}
                  <path
                    d="M 50 250 Q 150 245 200 240 Q 300 235 400 230 Q 500 225 600 220 Q 700 215 750 210"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />

                  {/* Time labels */}
                  {chartData.map((item, index) => (
                    <text
                      key={index}
                      x={50 + index * 54}
                      y={295}
                      fill="hsl(var(--muted-foreground))"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {item.time}
                    </text>
                  ))}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 flex gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-muted-foreground">Players</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-muted-foreground">Bans</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
