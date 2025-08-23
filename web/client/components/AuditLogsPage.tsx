import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";
import { api } from "@/lib/api-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { createCopyHandler } from "@/lib/copy-utils";
import {
  Search,
  Filter,
  Eye,
  Shield,
  AlertCircle,
  Ban,
  UserX,
  Settings,
  LogIn,
  Clock,
  User,
  Activity,
  TrendingUp,
  Calendar,
  BarChart3,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Copy,
  Users,
} from "lucide-react";
import {
  Pagination,
  PageSizeSelector,
  PaginationInfo,
} from "@/components/ui/pagination";
import {
  useScrollAnimation,
  getScrollAnimationClasses,
} from "@/hooks/use-scroll-animation";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actionType: "ban" | "kick" | "unban" | "login" | "config" | "warning";
  user: string;
  admin: string;
  ipAddress: string;
  details: string;
  severity: "low" | "medium" | "high" | "critical";
  serverName: string;
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    case "high":
      return <XCircle className="w-4 h-4 text-orange-400" />;
    case "medium":
      return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    case "low":
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    default:
      return <Activity className="w-4 h-4 text-muted-foreground" />;
  }
};

const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case "ban":
      return <Ban className="h-4 w-4 text-red-400" />;
    case "kick":
      return <UserX className="h-4 w-4 text-orange-400" />;
    case "unban":
      return <Shield className="h-4 w-4 text-green-400" />;
    case "login":
      return <LogIn className="h-4 w-4 text-primary" />;
    case "config":
      return <Settings className="h-4 w-4 text-primary" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />;
  }
};

const getSeverityBadge = (severity: string) => {
  const colors = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <Badge
      className={`${colors[severity as keyof typeof colors] || colors.low} border`}
      variant="outline"
    >
      {severity.toUpperCase()}
    </Badge>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  gradient?: string;
}

function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  gradient,
}: StatsCardProps) {
  return (
    <Card
      className={`relative overflow-hidden ${gradient ? `bg-gradient-to-br ${gradient}` : ""}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 lg:p-6">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-background/10 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-4 lg:p-6 pt-0">
        <div className="space-y-1">
          <div className="text-2xl lg:text-3xl font-bold">{value}</div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div
              className={`text-xs flex items-center gap-1 ${
                trend.isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              <TrendingUp className="h-3 w-3" />
              {trend.value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AuditLogsPage() {
  const { serverId } = useParams<{ serverId: string }>();
  usePageTitle("Audit Logs");
  const { toast } = useToast();
  const { t } = useLanguage();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [activeModerators, setActiveModerators] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll animation hooks for different sections
  const headerAnimation = useScrollAnimation({ threshold: 0.3 });
  const filtersAnimation = useScrollAnimation({ threshold: 0.2 });
  const tableAnimation = useScrollAnimation({ threshold: 0.2 });
  const statsAnimation = useScrollAnimation({ threshold: 0.3 });

  useEffect(() => {
    const fetchAuditLogs = async () => {
      if (!serverId) {
        setError("Server ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        // setIsLoading(true);
        // setError(null);

        const response = await api.auditLogs.getLogs(serverId, "");

        if (response.success && response.data) {
          // Always use API data first, even if empty
          const logsData = response.data.logs || [];
          setLogs(logsData);
          setActiveModerators(response.data.activeModerators);
        } else {
          // No data received from API
          setLogs([]);
          setError("No audit log data available");
        }
      } catch (err) {
        // Handle API error
        setLogs([]);
        setError("Failed to load audit log data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditLogs();
  }, [serverId]);

  // Client-side filtering with useMemo for better performance
  const filteredLogs = useMemo(() => {
    if (!logs.length) return [];

    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          (log.user &&
            log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.details &&
            log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.action &&
            log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.target &&
            log.target.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.serverName &&
            log.serverName.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    // Action type filter
    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    // Severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter((log) => log.severity === severityFilter);
    }

    return filtered;
  }, [logs, searchTerm, actionFilter, severityFilter]);

  // Client-side pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage, pageSize]);

  // Update getPaginatedLogs to return memoized result
  const getPaginatedLogs = useCallback(() => paginatedLogs, [paginatedLogs]);

  // Handle search and filter changes - reset to page 1
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleActionFilterChange = useCallback((value: string) => {
    setActionFilter(value);
    setCurrentPage(1);
  }, []);

  const handleSeverityFilterChange = useCallback((value: string) => {
    setSeverityFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedLog(null); // Clear selection when changing pages
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Calculate stats
  const totalLogs = logs.length;
  const criticalCount = logs.filter(
    (log) => log.severity === "critical",
  ).length;
  const todayLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  }).length;

  // Professional copy function with enhanced error handling
  const handleCopy = createCopyHandler(toast);

  // Skeleton loading component for audit logs table
  const AuditLogSkeleton = () => (
    <TableRow className="hover:bg-primary/5 transition-all duration-300 border-primary/10">
      <TableCell>
        <Skeleton className="h-2 w-2 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-4 w-16" />
        </div>
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        <Skeleton className="h-4 w-48" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded" />
      </TableCell>
    </TableRow>
  );

  return (
    <TooltipProvider>
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
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
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("auditLogs")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header with enhanced styling */}
          <div className="space-y-4">
            <div
              className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${getScrollAnimationClasses(headerAnimation.isVisible, "slide-in-bottom", "700", "200")}`}
            >
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {t("auditLogs")}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Monitor server events, security actions, and administrative
                  activities
                </p>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div
              ref={statsAnimation.elementRef}
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${getScrollAnimationClasses(statsAnimation.isVisible, "zoom-in", "500", "300")}`}
            >
              <StatsCard
                title="Total Events"
                value={totalLogs.toLocaleString()}
                subtitle="All time audit entries"
                icon={<BarChart3 className="h-5 w-5 text-primary" />}
                trend={{ value: "+12% from last week", isPositive: true }}
                gradient="from-primary/10 to-primary/5"
              />

              <StatsCard
                title="Critical Alerts"
                value={criticalCount}
                subtitle="High-priority security events"
                icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
                trend={{ value: "+3 today", isPositive: false }}
                gradient="from-red-500/10 to-red-500/5"
              />

              <StatsCard
                title="Today's Activity"
                value={todayLogs}
                subtitle="Events in the last 24h"
                icon={<Clock className="h-5 w-5 text-primary" />}
                trend={{ value: "Normal activity", isPositive: true }}
                gradient="from-primary/10 to-primary/5"
              />

              <StatsCard
                title="Active Moderators"
                value={activeModerators}
                subtitle="Currently monitoring"
                icon={<Users className="h-5 w-5 text-green-400" />}
                gradient="from-green-500/10 to-green-500/5"
              />
            </div>
          </div>

          {/* Enhanced Search & Filters */}
          <Card
            ref={filtersAnimation.elementRef}
            className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${getScrollAnimationClasses(filtersAnimation.isVisible, "slide-in-bottom", "700")}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Advanced Filtering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search across all log data..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>

                {/* Action Type Filter */}
                <Select
                  value={actionFilter}
                  onValueChange={handleActionFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="Player Quit">🚪 Player Quit</SelectItem>
                    <SelectItem value="Player Request Join">
                      🔄 Player Request Join
                    </SelectItem>
                    <SelectItem value="Server Start">
                      🟢 Server Start
                    </SelectItem>
                    <SelectItem value="AntiCheat Shutdown">
                      🔴 AntiCheat Shutdown
                    </SelectItem>
                    <SelectItem value="Player Unbanned">
                      ✅ Player Unbanned
                    </SelectItem>
                    <SelectItem value="Player Banned">
                      🚫 Player Banned
                    </SelectItem>
                    <SelectItem value="Player Kicked">
                      👋 Player Kicked
                    </SelectItem>
                    <SelectItem value="Player Warning">
                      ⚠️ Player Warning
                    </SelectItem>
                    <SelectItem value="Config Change">
                      ⚙️ Config Change
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Severity Filter */}
                <Select
                  value={severityFilter}
                  onValueChange={handleSeverityFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity Levels</SelectItem>
                    <SelectItem value="Low">🟢 Low</SelectItem>
                    <SelectItem value="Medium">🟡 Medium</SelectItem>
                    <SelectItem value="High">🟠 High</SelectItem>
                    <SelectItem value="Critical">🔴 Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stats summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Showing {getPaginatedLogs().length} of {filteredLogs.length}{" "}
                    entries
                  </span>
                  {searchTerm && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Logs Table */}
          <Card
            ref={tableAnimation.elementRef}
            className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${getScrollAnimationClasses(tableAnimation.isVisible, "slide-in-bottom", "700", "400")}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Security Event Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="w-[60px]">Status</TableHead>
                      <TableHead className="min-w-[180px]">Timestamp</TableHead>
                      <TableHead className="min-w-[200px]">Action</TableHead>
                      <TableHead className="min-w-[150px]">
                        User/Player
                      </TableHead>
                      <TableHead className="min-w-[250px] hidden xl:table-cell">
                        Details
                      </TableHead>
                      <TableHead className="min-w-[100px]">Severity</TableHead>
                      <TableHead className="w-[80px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPaginatedLogs().map((log) => (
                      <ContextMenu key={log.id}>
                        <ContextMenuTrigger asChild>
                          <TableRow className="hover:bg-accent/30 transition-colors border-border/30 cursor-context-menu">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getSeverityIcon(log.severity)}
                                {getActionIcon(log.actionType)}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs lg:text-sm">
                              <div className="space-y-1">
                                <div>{log.timestamp}</div>
                                <div className="text-xs text-muted-foreground lg:hidden">
                                  ID: {log.id}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-sm lg:text-base">
                                  {log.action}
                                </div>
                                <div className="lg:hidden text-xs text-muted-foreground">
                                  {log.details.substring(0, 50)}...
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">
                                  {log.user === "-" ? (
                                    <span className="text-muted-foreground italic">
                                      System
                                    </span>
                                  ) : (
                                    log.user
                                  )}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[250px] truncate hidden xl:table-cell">
                              <span className="text-sm">{log.details}</span>
                            </TableCell>
                            <TableCell>
                              {getSeverityBadge(log.severity)}
                            </TableCell>
                            <TableCell>
                              <Dialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-primary/10"
                                    onClick={() => {
                                      setSelectedLog(log);
                                      setIsDialogOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-primary/20">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      {getActionIcon(
                                        selectedLog?.actionType || "",
                                      )}
                                      Audit Log Details
                                    </DialogTitle>
                                    <DialogDescription>
                                      Complete information for audit log entry #
                                      {selectedLog?.id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedLog && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-muted-foreground">
                                            Timestamp
                                          </label>
                                          <p className="font-mono text-sm bg-muted/30 p-2 rounded">
                                            {selectedLog.timestamp}
                                          </p>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-muted-foreground">
                                            Action Type
                                          </label>
                                          <div className="flex items-center gap-2">
                                            {getActionIcon(
                                              selectedLog.actionType,
                                            )}
                                            <span className="font-medium">
                                              {selectedLog.action}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-muted-foreground">
                                            User/Player
                                          </label>
                                          <p className="bg-muted/30 p-2 rounded">
                                            {selectedLog.user}
                                          </p>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-muted-foreground">
                                            Severity Level
                                          </label>
                                          <div className="flex items-center gap-2">
                                            {getSeverityIcon(
                                              selectedLog.severity,
                                            )}
                                            {getSeverityBadge(
                                              selectedLog.severity,
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Event Details
                                        </label>
                                        <p className="text-sm p-3 bg-muted/30 rounded-lg leading-relaxed">
                                          {selectedLog.details}
                                        </p>
                                      </div>
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-muted-foreground">
                                            Server Instance
                                          </label>
                                          <p className="bg-muted/30 p-2 rounded">
                                            {selectedLog.serverName}
                                          </p>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-muted-foreground">
                                            Log Entry ID
                                          </label>
                                          <p className="font-mono text-sm bg-muted/30 p-2 rounded">
                                            {selectedLog.id}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-56">
                          <ContextMenuItem
                            onClick={() => {
                              setSelectedLog(log);
                              setIsDialogOpen(true);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            onClick={() => handleCopy(log.id, "Log ID")}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Copy Log ID
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => handleCopy(log.user, "User")}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Copy User
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => handleCopy(log.action, "Action")}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Copy Action
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => handleCopy(log.details, "Details")}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Copy Details
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() =>
                              handleCopy(log.timestamp, "Timestamp")
                            }
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Copy Timestamp
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Enhanced Pagination */}
              {filteredLogs.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-primary/20">
                  <div className="flex items-center gap-4">
                    <PaginationInfo
                      currentPage={currentPage}
                      pageSize={pageSize}
                      totalItems={filteredLogs.length}
                    />
                    <PageSizeSelector
                      pageSize={pageSize}
                      onPageSizeChange={handlePageSizeChange}
                      options={[10, 25, 50, 100]}
                    />
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
