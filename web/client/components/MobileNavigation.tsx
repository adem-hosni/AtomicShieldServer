import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { useLanguage } from "@/hooks/use-language";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import {
  Menu,
  X,
  LayoutDashboard,
  Download,
  Database,
  Server,
  CreditCard,
  ChevronDown,
  Users,
  Ban,
  Wrench,
  UserCheck,
  FileText,
  Video,
  Search,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Shield,
  Newspaper,
  History,
  Gift,
  Loader2,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { ServerStatusIndicator } from "@/components/ui/server-status-indicator";

interface ServerData {
  id: string;
  name: string;
  status: "active" | "pending" | "inactive";
}

interface MobileNavigationProps {
  servers?: ServerData[];
  isLoadingServers?: boolean;
  serverError?: string | null;
}

export function MobileNavigation({
  servers: propServers,
  isLoadingServers: propIsLoadingServers,
  serverError: propServerError,
}: MobileNavigationProps = {}) {
  // Internal server state management
  const [internalServers, setInternalServers] = useState<ServerData[]>([]);
  const [internalIsLoadingServers, setInternalIsLoadingServers] =
    useState(true);
  const [internalServerError, setInternalServerError] = useState<string | null>(
    null,
  );
  const { toast } = useToast();

  // Use props if provided, otherwise use internal state
  const servers = propServers || internalServers;
  const isLoadingServers =
    propIsLoadingServers !== undefined
      ? propIsLoadingServers
      : internalIsLoadingServers;
  const serverError =
    propServerError !== undefined ? propServerError : internalServerError;

  // Fetch servers if not provided via props
  useEffect(() => {
    if (propServers === undefined) {
      fetchServers();
    }
  }, [propServers]);

  const fetchServers = async () => {
    try {
      setInternalIsLoadingServers(true);
      setInternalServerError(null);

      const response = await api.servers.getServers();

      if (response.success && response.data) {
        const serversData = response.data?.servers.map((server: any) => ({
          id: server.id?.toString() || "unknown",
          name: server.name || `Server ${server.id}`,
          status: server.isActive
            ? "active"
            : ("inactive" as "active" | "pending" | "inactive"),
        }));
        setInternalServers(serversData);
      } else {
        setInternalServerError("Failed to fetch servers");
      }
    } catch (error) {
      setInternalServerError("Network error fetching servers");
    } finally {
      setInternalIsLoadingServers(false);
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [expandedServers, setExpandedServers] = useState<
    Record<string, boolean>
  >({});
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const handleServerToggle = (serverId: string) => {
    setExpandedServers((prev) => ({
      ...prev,
      [serverId]: !prev[serverId],
    }));
  };

  const closeMenu = () => setIsOpen(false);

  const isCurrentPath = (path: string) => location.pathname === path;

  const mainNavItems = [
    {
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: t("dashboard"),
      to: "/dashboard/overview",
    },
    {
      icon: <Newspaper className="h-4 w-4" />,
      label: t("news"),
      to: "/dashboard/news",
    },
    {
      icon: <History className="h-4 w-4" />,
      label: t("changelogs"),
      to: "/dashboard/changelogs",
    },
    {
      icon: <Download className="h-4 w-4" />,
      label: t("download"),
      to: "/dashboard/download",
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      label: "Subscriptions",
      to: "/dashboard/subscriptions",
    },
    {
      icon: <Shield className="h-4 w-4" />,
      label: "Redeem License",
      to: "/dashboard/redeem",
    },
  ];

  const footerNavItems = [
    {
      icon: <HelpCircle className="h-4 w-4" />,
      label: t("support"),
      to: "/dashboard/support",
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: t("documentation"),
      to: "/dashboard/docs",
    },
  ];

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent/50 h-10 w-10 touch-manipulation transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-80 sm:w-96 p-0 bg-sidebar border-sidebar-border"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="px-6 py-4 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=800"
                    alt="AtomicShield Logo"
                    className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse group-hover:bg-cyan-400/40 transition-all duration-300" />
                </div>
                <SheetTitle className="text-lg font-semibold bg-gradient-to-r from-sidebar-foreground to-cyan-400 bg-clip-text text-transparent">
                  AtomicShield
                </SheetTitle>
              </div>
            </SheetHeader>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-6">
                {/* Main Navigation */}
                <div className="space-y-1">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground touch-manipulation min-h-[48px] ${
                        isCurrentPath(item.to)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }`}
                    >
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  ))}
                </div>

                <Separator className="bg-sidebar-border" />

                {/* Servers Section */}
                <div className="space-y-3">
                  <h3
                    className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    role="heading"
                    aria-level={3}
                  >
                    SERVERS
                  </h3>

                  <div
                    className="space-y-1"
                    role="group"
                    aria-label="Server list"
                  >
                    {isLoadingServers ? (
                      <div className="space-y-2">
                        <div
                          className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground"
                          role="status"
                          aria-live="polite"
                        >
                          <div className="relative">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <div className="absolute inset-0 animate-ping h-4 w-4 rounded-full bg-primary/20"></div>
                          </div>
                          <span className="animate-pulse">
                            Loading servers...
                          </span>
                        </div>

                        {/* Server loading skeletons */}
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <div className="h-4 w-4 bg-muted/30 rounded"></div>
                            <div className="flex-1 space-y-1">
                              <div className="h-3 bg-muted/40 rounded w-20"></div>
                              <div className="h-2 bg-muted/30 rounded w-16"></div>
                            </div>
                            <div className="h-2 w-2 bg-muted/30 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                    ) : serverError ? (
                      <div
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-400"
                        role="alert"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>Failed to load servers</span>
                      </div>
                    ) : servers.length === 0 ? (
                      <div className="px-3 py-3 text-sm text-muted-foreground">
                        <span>No servers found</span>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Add a server from the dashboard
                        </p>
                      </div>
                    ) : (
                      servers.map((server) => {
                        const isServerActive = [
                          `/dashboard/server/${server.id}`,
                          `/dashboard/server/${server.id}/players`,
                          `/dashboard/server/${server.id}/streams`,
                          `/dashboard/server/${server.id}/bans`,
                          `/dashboard/server/${server.id}/config`,
                          `/dashboard/server/${server.id}/moderators`,
                          `/dashboard/server/${server.id}/logs`,
                        ].includes(location.pathname);

                        const isExpanded =
                          expandedServers[server.id] || isServerActive;

                        return (
                          <div key={server.id} className="space-y-1">
                            {/* Server Header */}
                            <button
                              onClick={() => handleServerToggle(server.id)}
                              className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full touch-manipulation min-h-[48px] group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar ${
                                isServerActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : ""
                              }`}
                              role="button"
                              aria-expanded={isExpanded}
                              aria-controls={`server-${server.id}-submenu`}
                              tabIndex={0}
                            >
                              <Server className="h-4 w-4" />
                              <span className="flex-1 text-left truncate">
                                {server.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <ServerStatusIndicator
                                  status={server.status}
                                  size="md"
                                  showText={false}
                                />
                                <ChevronDown
                                  className={`h-4 w-4 transition-all duration-300 ease-in-out ${
                                    isExpanded ? "rotate-180" : ""
                                  } group-hover:text-primary`}
                                />
                              </div>
                            </button>

                            {/* Server Submenu */}
                            <div
                              id={`server-${server.id}-submenu`}
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isExpanded
                                  ? "max-h-96 opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                              role="menu"
                              aria-labelledby={`server-${server.id}-button`}
                            >
                              <div
                                className={`ml-6 space-y-1 transform transition-all duration-300 ${
                                  isExpanded
                                    ? "translate-y-0 scale-100"
                                    : "-translate-y-2 scale-95"
                                }`}
                              >
                                <Link
                                  to={`/dashboard/server/${server.id}`}
                                  onClick={closeMenu}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground touch-manipulation ${
                                    location.pathname ===
                                    `/dashboard/server/${server.id}`
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                      : ""
                                  }`}
                                >
                                  <LayoutDashboard className="h-4 w-4" />
                                  <span>{t("dashboard")}</span>
                                </Link>
                                <Link
                                  to={`/dashboard/server/${server.id}/players`}
                                  onClick={closeMenu}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground touch-manipulation ${
                                    location.pathname ===
                                    `/dashboard/server/${server.id}/players`
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                      : ""
                                  }`}
                                >
                                  <Users className="h-4 w-4" />
                                  <span>{t("players")}</span>
                                </Link>
                                <Link
                                  to={`/dashboard/server/${server.id}/streams`}
                                  onClick={closeMenu}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground touch-manipulation ${
                                    location.pathname ===
                                    `/dashboard/server/${server.id}/streams`
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                      : ""
                                  }`}
                                >
                                  <Video className="h-4 w-4" />
                                  <span>Multi Stream</span>
                                </Link>
                                <Link
                                  to={`/dashboard/server/${server.id}/bans`}
                                  onClick={closeMenu}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground touch-manipulation ${
                                    location.pathname ===
                                    `/dashboard/server/${server.id}/bans`
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                      : ""
                                  }`}
                                >
                                  <Ban className="h-4 w-4" />
                                  <span>{t("bans")}</span>
                                </Link>
                                <Link
                                  to={`/dashboard/server/${server.id}/config`}
                                  onClick={closeMenu}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground touch-manipulation ${
                                    location.pathname ===
                                    `/dashboard/server/${server.id}/config`
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                      : ""
                                  }`}
                                >
                                  <Wrench className="h-4 w-4" />
                                  <span>{t("configuration")}</span>
                                </Link>
                                <Link
                                  to={`/dashboard/server/${server.id}/moderators`}
                                  onClick={closeMenu}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground touch-manipulation ${
                                    location.pathname ===
                                    `/dashboard/server/${server.id}/moderators`
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                      : ""
                                  }`}
                                >
                                  <UserCheck className="h-4 w-4" />
                                  <span>{t("moderators")}</span>
                                </Link>
                                <Link
                                  to={`/dashboard/server/${server.id}/logs`}
                                  onClick={closeMenu}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground touch-manipulation ${
                                    location.pathname ===
                                    `/dashboard/server/${server.id}/logs`
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                      : ""
                                  }`}
                                >
                                  <FileText className="h-4 w-4" />
                                  <span>{t("auditLogs")}</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <Separator className="bg-sidebar-border" />

                {/* Footer Navigation */}
                <div className="space-y-1">
                  {footerNavItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground touch-manipulation min-h-[48px] ${
                        isCurrentPath(item.to)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }`}
                    >
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-sidebar-border p-4 space-y-3">
              {/* Language Selector */}
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("language")}
                </span>
                <LanguageDropdown variant="sidebar" />
              </div>

              {/* User Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatar || "/api/placeholder/32/32"}
                      alt="User avatar"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || "No email"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {user?.provider === "discord" ? "Discord" : "Email"}
                  </Badge>
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="w-full justify-start text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 touch-manipulation"
                >
                  <LogOut className="h-3 w-3 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
