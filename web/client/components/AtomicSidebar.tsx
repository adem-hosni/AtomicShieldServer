import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { ServerStatusIndicator } from "@/components/ui/server-status-indicator";
import { MobileNavigation } from "@/components/MobileNavigation";
import {
  LayoutDashboard,
  Download,
  Database,
  Server,
  CreditCard,
  ChevronDown,
  Users,
  Ban,
  Wrench,
  Search,
  UserCheck,
  FileText,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Shield,
  Newspaper,
  History,
  Menu,
  X,
  Gift,
  Loader2,
  AlertCircle,
  LogOut,
  Video,
} from "lucide-react";

interface ServerData {
  id: string;
  name: string;
  status: "active" | "pending" | "inactive";
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  isActive?: boolean;
  badge?: string;
  className?: string;
  onClick?: () => void;
  onMobileMenuClose?: () => void;
}

function SidebarItem({
  icon,
  label,
  to,
  isActive,
  badge,
  className,
  onClick,
  onMobileMenuClose,
}: SidebarItemProps) {
  const content = (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground group",
        isActive && "bg-accent text-accent-foreground",
        className,
      )}
    >
      <span className="transition-transform duration-200 group-hover:scale-110">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge && (
        <Badge
          variant="secondary"
          className="ml-auto text-xs transition-all duration-200 group-hover:scale-105"
        >
          {badge}
        </Badge>
      )}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar rounded-lg"
        onClick={() => {
          onClick?.();
          onMobileMenuClose?.();
        }}
        role="menuitem"
        tabIndex={0}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar rounded-lg"
      onClick={onClick}
      role="menuitem"
      tabIndex={0}
    >
      {content}
    </button>
  );
}

interface ServerItemProps {
  server: ServerData;
  isActive?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  currentPath: string;
  t: (key: string) => string;
  onMobileMenuClose?: () => void;
}

function ServerItem({
  server,
  isActive,
  isExpanded,
  onToggle,
  currentPath,
  t,
  onMobileMenuClose,
}: ServerItemProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground w-full group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar",
          isActive && "bg-accent text-accent-foreground",
        )}
        role="button"
        aria-expanded={isExpanded}
        aria-controls={`server-${server.id}-submenu`}
        tabIndex={0}
      >
        <span className="transition-transform duration-200 group-hover:scale-110">
          <Server className="h-4 w-4" />
        </span>
        <span className="flex-1 text-left">{server.name}</span>
        <div className="flex items-center gap-2">
          <ServerStatusIndicator
            status={server.status}
            size="md"
            showText={false}
            className="transition-all duration-200"
          />
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-all duration-300 ease-in-out",
              isExpanded && "rotate-180",
              "group-hover:text-primary",
            )}
          />
        </div>
      </button>

      <div
        id={`server-${server.id}-submenu`}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
        role="menu"
        aria-labelledby={`server-${server.id}-button`}
      >
        <div
          className={cn(
            "ml-6 space-y-1 transform transition-all duration-300",
            isExpanded ? "translate-y-0 scale-100" : "-translate-y-2 scale-95",
          )}
        >
          <SidebarItem
            icon={<LayoutDashboard className="h-4 w-4" />}
            label={t("dashboard")}
            to={`/dashboard/server/${server.id}`}
            isActive={currentPath === `/dashboard/server/${server.id}`}
            onMobileMenuClose={onMobileMenuClose}
          />
          <SidebarItem
            icon={<Users className="h-4 w-4" />}
            label={t("players")}
            to={`/dashboard/server/${server.id}/players`}
            isActive={currentPath === `/dashboard/server/${server.id}/players`}
            onMobileMenuClose={onMobileMenuClose}
          />
          <SidebarItem
            icon={<Video className="h-4 w-4" />}
            label="Multi Stream"
            to={`/dashboard/server/${server.id}/streams`}
            isActive={currentPath === `/dashboard/server/${server.id}/streams`}
            onMobileMenuClose={onMobileMenuClose}
          />
          <SidebarItem
            icon={<Ban className="h-4 w-4" />}
            label={t("bans")}
            to={`/dashboard/server/${server.id}/bans`}
            isActive={currentPath === `/dashboard/server/${server.id}/bans`}
            onMobileMenuClose={onMobileMenuClose}
          />
          <SidebarItem
            icon={<Wrench className="h-4 w-4" />}
            label={t("configuration")}
            to={`/dashboard/server/${server.id}/config`}
            isActive={currentPath === `/dashboard/server/${server.id}/config`}
            onMobileMenuClose={onMobileMenuClose}
          />
          <SidebarItem
            icon={<UserCheck className="h-4 w-4" />}
            label={t("moderators")}
            to={`/dashboard/server/${server.id}/moderators`}
            isActive={
              currentPath === `/dashboard/server/${server.id}/moderators`
            }
            onMobileMenuClose={onMobileMenuClose}
          />
          <SidebarItem
            icon={<FileText className="h-4 w-4" />}
            label={t("auditLogs")}
            to={`/dashboard/server/${server.id}/logs`}
            isActive={currentPath === `/dashboard/server/${server.id}/logs`}
            onMobileMenuClose={onMobileMenuClose}
          />
        </div>
      </div>
    </div>
  );
}

export function AtomicSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut: authSignOut } = useAuth();
  const [expandedServers, setExpandedServers] = useState<
    Record<string, boolean>
  >({});
  const [servers, setServers] = useState<ServerData[]>([]);
  const [isLoadingServers, setIsLoadingServers] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  // Auto-expand server if we're on a server page
  useEffect(() => {
    const serverMatch = location.pathname.match(
      /\/dashboard\/server\/([^\/]+)/,
    );
    if (serverMatch) {
      const serverId = serverMatch[1];
      setExpandedServers((prev) => ({
        ...prev,
        [serverId]: true,
      }));
    }
  }, [location.pathname]);

  // Fetch servers on component mount
  useEffect(() => {
    const fetchServers = async () => {
      try {
        setIsLoadingServers(true);
        setServerError(null);
        const response = await api.servers.getServers();

        if (response.success && response.data?.servers) {
          setServers(
            response.data.servers.map((server) => ({
              id: server.id,
              name: server.name,
              status: server.status,
            })),
          );
        } else {
          setServerError("Failed to load servers");
        }
      } catch (error) {
        console.error("Error fetching servers:", error);
        setServerError("Failed to load servers");
      } finally {
        setIsLoadingServers(false);
      }
    };

    fetchServers();
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event: any) => {
      toast({
        title: `${event.detail.flag} ${t("languageChanged")}`,
        description: `${t("switchedTo")} ${event.detail.language}`,
        duration: 2000,
      });
    };

    window.addEventListener("language-changed", handleLanguageChange);
    return () =>
      window.removeEventListener("language-changed", handleLanguageChange);
  }, [toast, t]);

  // Handle server toggle with improved logic
  const handleServerToggle = (serverId: string) => {
    setExpandedServers((prev) => {
      const newState = { ...prev };

      // If clicking on an already expanded server, just collapse it
      if (newState[serverId]) {
        newState[serverId] = false;
      } else {
        // Collapse all other servers and expand this one
        Object.keys(newState).forEach((id) => {
          newState[id] = false;
        });
        newState[serverId] = true;
      }

      return newState;
    });
  };

  // Handle logout
  const handleLogout = () => {
    authSignOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth/signin");
  };

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 xl:w-72 flex-col bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300">
        {/* Header - Desktop Only */}
        <a
          href="/"
          className="hidden lg:flex items-center gap-3 px-6 py-4 border-b border-sidebar-border flex-shrink-0 group hover:bg-sidebar-accent/20 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar"
          role="link"
          tabIndex={0}
        >
          <div className="relative group">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=800"
              alt="AtomicShield Logo"
              className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse group-hover:bg-cyan-400/40 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-sidebar-foreground to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-purple-400 transition-all duration-300">
              AtomicShield
            </h1>
          </div>
        </a>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
          <nav
            className="space-y-2"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Main navigation */}
            <div className="space-y-1" role="menu">
              <SidebarItem
                icon={<LayoutDashboard className="h-4 w-4" />}
                label={t("dashboard")}
                to="/dashboard/overview"
                isActive={location.pathname === "/dashboard/overview"}
                onMobileMenuClose={() => {}}
              />
              <SidebarItem
                icon={<Newspaper className="h-4 w-4" />}
                label={t("news")}
                to="/dashboard/news"
                isActive={location.pathname === "/dashboard/news"}
                onMobileMenuClose={() => {}}
              />
              <SidebarItem
                icon={<History className="h-4 w-4" />}
                label={t("changelogs")}
                to="/dashboard/changelogs"
                isActive={location.pathname === "/dashboard/changelogs"}
                onMobileMenuClose={() => {}}
              />
              <SidebarItem
                icon={<Download className="h-4 w-4" />}
                label={t("download")}
                to="/dashboard/download"
                isActive={location.pathname === "/dashboard/download"}
                onMobileMenuClose={() => {}}
              />
              <SidebarItem
                icon={<CreditCard className="h-4 w-4" />}
                label="Subscriptions"
                to="/dashboard/subscriptions"
                isActive={location.pathname === "/dashboard/subscriptions"}
                onMobileMenuClose={() => {}}
              />
              <SidebarItem
                icon={<Shield className="h-4 w-4" />}
                label="Redeem License"
                to="/dashboard/redeem"
                isActive={location.pathname === "/dashboard/redeem"}
                onMobileMenuClose={() => {}}
              />
            </div>

            {/* Servers section */}
            <div className="pt-4">
              <h3
                className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                role="heading"
                aria-level={3}
              >
                SERVERS
              </h3>
              <div className="space-y-1" role="group" aria-label="Server list">
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
                      <span className="animate-pulse">Loading servers...</span>
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
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    <span>No servers found</span>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Add a server from the dashboard
                    </p>
                  </div>
                ) : (
                  servers.map((server) => (
                    <ServerItem
                      key={server.id}
                      server={server}
                      isActive={[
                        `/dashboard/server/${server.id}`,
                        `/dashboard/server/${server.id}/players`,
                        `/dashboard/server/${server.id}/streams`,
                        `/dashboard/server/${server.id}/bans`,
                        `/dashboard/server/${server.id}/config`,
                        `/dashboard/server/${server.id}/moderators`,
                        `/dashboard/server/${server.id}/logs`,
                      ].includes(location.pathname)}
                      isExpanded={expandedServers[server.id] || false}
                      onToggle={() => handleServerToggle(server.id)}
                      currentPath={location.pathname}
                      t={t}
                      onMobileMenuClose={() => {}}
                    />
                  ))
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-3 flex-shrink-0">
          <div className="space-y-1" role="menu">
            <SidebarItem
              icon={<HelpCircle className="h-4 w-4" />}
              label={t("support")}
              to="/dashboard/support"
              isActive={location.pathname === "/dashboard/support"}
              onMobileMenuClose={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              icon={<BookOpen className="h-4 w-4" />}
              label={t("documentation")}
              to="/dashboard/docs"
              isActive={location.pathname === "/dashboard/docs"}
              onMobileMenuClose={() => setIsMobileMenuOpen(false)}
            />
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-xs font-medium text-muted-foreground">
              {t("language")}
            </span>
            <LanguageDropdown variant="sidebar" />
          </div>

          {/* User info */}
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
              onClick={handleLogout}
              className="w-full justify-start text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-sidebar transition-all duration-200"
              role="button"
              tabIndex={0}
            >
              <LogOut className="h-3 w-3 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
