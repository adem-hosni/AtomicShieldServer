import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";
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
  <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-200">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
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

export function UpdatedServerDashboard() {
  const { serverId } = useParams<{ serverId: string }>();
  usePageTitle("Server Dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [dashboardData, setDashboardData] =
    useState<ServerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Extract data
  const { server, onlinePlayers, totalBans } = dashboardData || {};

  const handleCopyLicense = () => {
    navigator.clipboard.writeText("ATC-DEMO-LICENSE-KEY-2024");
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
    toast({
      title: "License Key",
      description: "ATC-DEMO-LICENSE-KEY-2024",
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
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
            <div className="h-8 bg-muted rounded w-64 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded animate-pulse" />
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
            <h1 className="text-3xl font-bold text-foreground">
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
            value={server?.name || "Demo Server"}
            badge={{
              text: "Online",
              variant: "outline",
              color: "bg-green-500/10 text-green-400 border-green-500/30",
            }}
            icon={<CheckCircle className="h-5 w-5 text-green-400" />}
          />

          <ServerStatusCard
            title="Server IP"
            value="8.8.8.8"
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
            value="••••••••••••••••••••••"
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
            value="31 days"
            badge={{
              text: "In about 1 month",
              variant: "outline",
              color: "bg-green-500/10 text-green-400 border-green-500/30",
            }}
            icon={<Clock className="h-5 w-5 text-green-400" />}
          />
        </div>

        {/* Server Analytics */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
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
              title="Current Players"
              value="256"
              subtitle="now"
              color="text-blue-400"
            />
            <AnalyticsCard
              title="Banned Players"
              value="15"
              subtitle=""
              color="text-red-400"
            />
            <AnalyticsCard
              title="Peak Players"
              value="241"
              subtitle="last 24h"
              color="text-green-400"
            />
            <AnalyticsCard
              title="Average Players"
              value="196"
              subtitle="last 24h"
              color="text-purple-400"
            />
          </div>

          {/* Analytics Chart */}
          <Card className="bg-card/50 border-border/50">
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
