import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronDown,
  Users,
  Camera,
  UserMinus,
  Copy,
  Eye,
  MessageSquare,
  Shield,
  MapPin,
  Clock,
  Wifi,
  User,
  AlertTriangle,
  Monitor,
  TrendingUp,
  Activity,
  Globe,
  Zap,
} from "lucide-react";
import {
  Pagination,
  PageSizeSelector,
  PaginationInfo,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";
import { createCopyHandler } from "@/lib/copy-utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { usePaginatedApi, useApiMutation, useApi } from "@/hooks/use-api";
import { api } from "@/lib/api-client";
import { PlayerRecord } from "@shared/api";

// The PlayerRecord interface is now imported from @shared/api

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  className?: string;
}

function StatsCard({
  title,
  value,
  change,
  changeType,
  icon,
  className,
}: StatsCardProps) {
  const changeColor = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <Card
      className={`bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-2xl font-bold">{value}</div>
              <span className={`text-sm font-medium ${changeColor}`}>
                {change}
              </span>
            </div>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlayersPage() {
  const { serverId } = useParams<{ serverId: string }>();
  usePageTitle("Players");
  const { toast } = useToast();
  const { t } = useLanguage();

  // Ensure serverId is available
  if (!serverId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Server ID Required</h2>
          <p className="text-muted-foreground">
            Unable to load players without server ID.
          </p>
        </div>
      </div>
    );
  }

  // Scroll animations
  const breadcrumbAnimation = useScrollAnimation({
    threshold: 0.1,
    rootMargin: "200px",
  });
  const headerAnimation = useScrollAnimation({
    threshold: 0.1,
    rootMargin: "150px",
  });
  const filtersAnimation = useScrollAnimation({
    threshold: 0.1,
    rootMargin: "100px",
  });
  const tableAnimation = useScrollAnimation({
    threshold: 0.1,
    rootMargin: "50px",
  });
  const detailsAnimation = useScrollAnimation({
    threshold: 0.1,
    rootMargin: "0px",
  });

  // API state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("joinedAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Fetch all players (no server-side filtering)
  const getPlayersCallback = useCallback(
    () => api.players.getPlayers(serverId),
    [serverId],
  );
  const {
    data: playersData,
    loading: playersLoading,
    error: playersError,
    refetch: refetchPlayers,
  } = useApi(getPlayersCallback);

  // Client-side filtering and sorting
  const filteredAndSortedPlayers = useMemo(() => {
    if (!playersData?.players) return [];

    let filtered = [...playersData.players];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (player) =>
          player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.steamId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.discordId?.includes(searchQuery) ||
          player.ip?.includes(searchQuery),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortOrder as keyof typeof a];
      let bValue: any = b[sortOrder as keyof typeof b];

      if (sortOrder === "ping" || sortOrder === "playtime") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortOrder === "joinedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
      }

      // Determine sort direction based on field
      const isDescending = sortOrder === "joinedAt" || sortOrder === "playtime";

      if (isDescending) {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [playersData?.players, searchQuery, sortOrder]);

  // Client-side pagination
  const totalPlayers = filteredAndSortedPlayers.length;
  const totalPages = Math.ceil(totalPlayers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const players = filteredAndSortedPlayers.slice(startIndex, endIndex);

  // Update current players data structure to match expected format
  const currentPlayersData = playersData
    ? {
        ...playersData,
        players: players,
        totalCount: totalPlayers,
        onlineCount: filteredAndSortedPlayers.filter((p) => p.isOnline).length,
      }
    : null;

  // API mutations
  const kickPlayerMutation = useApiMutation((request: PlayerActionRequest) =>
    api.players.kickPlayer(serverId, request),
  );
  const banPlayerMutation = useApiMutation((request: PlayerActionRequest) =>
    api.players.banPlayer(serverId, request),
  );
  const screenshotMutation = useApiMutation((playerId: string) =>
    api.players.takeScreenshot(serverId, playerId),
  );

  // Modal and form state
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerRecord | null>(
    null,
  );
  const [isKickDialogOpen, setIsKickDialogOpen] = useState(false);
  const [isScreenshotViewOpen, setIsScreenshotViewOpen] = useState(false);
  const [kickReason, setKickReason] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [screenshotPlayer, setScreenshotPlayer] = useState<PlayerRecord | null>(
    null,
  );
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("permanent");

  // Get current player data (from filtered results)
  const onlineCount = currentPlayersData?.onlineCount || 0;
  const peakPlayers = currentPlayersData?.peakPlayers || 0;
  const newPlayers = currentPlayersData?.newPlayers || 0;

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortOrder(newSortBy);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedPlayer(null);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleKickPlayer = () => {
    setIsKickDialogOpen(true);
  };

  const handleConfirmKick = async () => {
    if (selectedPlayer && kickReason.trim()) {
      try {
        await kickPlayerMutation.mutate({
          playerId: selectedPlayer.id,
          reason: kickReason,
        });

        toast({
          title: "Player Kicked",
          description: `${selectedPlayer.name} has been kicked from the server.`,
        });

        // Refresh the players list
        refetchPlayers();

        setIsKickDialogOpen(false);
        setKickReason("");
        setSelectedPlayer(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to kick player. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBanPlayer = () => {
    setIsBanDialogOpen(true);
  };

  const handleConfirmBan = async () => {
    if (selectedPlayer && banReason.trim()) {
      try {
        await banPlayerMutation.mutate({
          playerId: selectedPlayer.id,
          reason: banReason,
          duration: banDuration,
        });

        toast({
          title: "Player Banned",
          description: `${selectedPlayer.name} has been banned from the server.`,
        });

        // Refresh the players list
        refetchPlayers();

        setIsBanDialogOpen(false);
        setBanReason("");
        setBanDuration("permanent");
        setSelectedPlayer(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to ban player. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleTakeScreenshot = async (player: PlayerRecord) => {
    try {
      const response = await screenshotMutation.mutate(player.id);

      if (response.success) {
        // Handle the response format: {success: true, message: "", url: "..."}
        let screenshotUrlFromResponse: string | null = null;

        // Check if url is in response.data.url or directly in response.url
        if (response.data?.url) {
          screenshotUrlFromResponse = response.data.url;
        } else if (response.url) {
          screenshotUrlFromResponse = response.url;
        }

        if (screenshotUrlFromResponse) {
          setScreenshotUrl(screenshotUrlFromResponse);
          setScreenshotPlayer(player);
          setIsScreenshotViewOpen(true);

          toast({
            title: "Screenshot Captured",
            description: `Screenshot taken for ${player.name}.`,
          });
        } else {
          // Fallback to default screenshot if no URL in response
          const defaultScreenshotUrl = createDefaultScreenshot(player);
          setScreenshotUrl(defaultScreenshotUrl);
          setScreenshotPlayer(player);
          setIsScreenshotViewOpen(true);

          toast({
            title: "Screenshot Captured",
            description: `Screenshot taken for ${player.name} (using default - no URL in response).`,
          });
        }
      } else {
        // Fallback to default screenshot
        const defaultScreenshotUrl = createDefaultScreenshot(player);
        setScreenshotUrl(defaultScreenshotUrl);
        setScreenshotPlayer(player);
        setIsScreenshotViewOpen(true);

        toast({
          title: "Screenshot Captured",
          description: `Screenshot taken for ${player.name} (using default - API error).`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Screenshot error:", error);
      // Fallback to default screenshot on error
      const defaultScreenshotUrl = createDefaultScreenshot(player);
      setScreenshotUrl(defaultScreenshotUrl);
      setScreenshotPlayer(player);
      setIsScreenshotViewOpen(true);

      toast({
        title: "Screenshot Error",
        description: `Failed to take screenshot for ${player.name}. Using default.`,
        variant: "destructive",
      });
    }
  };

  const createDefaultScreenshot = (player: PlayerRecord) => {
    // Create a default screenshot that looks like a GTA V desktop/loading screen
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Dark background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, 1920, 1080);

      // Add some gradient
      const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
      gradient.addColorStop(0, "rgba(41, 112, 255, 0.1)");
      gradient.addColorStop(1, "rgba(139, 69, 19, 0.1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1920, 1080);

      // Add text indicating no screenshot available
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Screenshot Not Available", 960, 480);

      ctx.fillStyle = "#888888";
      ctx.font = "32px Arial";
      ctx.fillText(`Player: ${player.name}`, 960, 540);
      ctx.fillText(`Server ID: #${player.id}`, 960, 580);
      ctx.fillText("AtomicShield Dashboard", 960, 640);

      // Add some decorative elements
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 3;
      ctx.strokeRect(460, 400, 1000, 300);

      return canvas.toDataURL("image/png");
    }

    // Fallback if canvas doesn't work
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSIjMGEwYTBhIi8+CjxyZWN0IHg9IjQ2MCIgeT0iNDAwIiB3aWR0aD0iMTAwMCIgaGVpZ2h0PSIzMDAiIHN0cm9rZT0iIzNCODJGNiIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9Ijk2MCIgeT0iNTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZvbnQtd2VpZ2h0PSJib2xkIj5TY3JlZW5zaG90IE5vdCBBdmFpbGFibGU8L3RleHQ+Cjx0ZXh0IHg9Ijk2MCIgeT0iNTYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjODg4ODg4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiPkF0b21pY1NoaWVsZCBEYXNoYm9hcmQ8L3RleHQ+Cjwvc3ZnPgo=";
  };

  const handleDownloadScreenshot = () => {
    if (screenshotUrl && screenshotPlayer) {
      // For actual images, you'd fetch the blob and create a download link
      fetch(screenshotUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `screenshot_${screenshotPlayer.name}_${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        })
        .catch(() => {
          // Fallback for mock URLs
          const link = document.createElement("a");
          link.href = screenshotUrl;
          link.download = `screenshot_${screenshotPlayer.name}_${Date.now()}.png`;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });

      toast({
        title: "Screenshot Downloaded",
        description: `Screenshot for ${screenshotPlayer.name} has been downloaded.`,
      });
    }
  };

  // Professional copy function with enhanced error handling
  const handleCopy = createCopyHandler(toast);

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTimestamp = (timestamp: string) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      " " +
      new Date(timestamp).toLocaleTimeString()
    );
  };

  const getPingColor = (ping: number) => {
    if (ping < 50) return "text-green-500";
    if (ping < 100) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px] animate-pulse" />
      </div>

      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 relative">
        {/* Breadcrumb */}
        <div
          ref={breadcrumbAnimation.elementRef}
          className={`transition-all duration-700 ease-out ${
            breadcrumbAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Players</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div
          ref={headerAnimation.elementRef}
          className={`transition-all duration-700 ease-out ${
            headerAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: headerAnimation.isVisible ? "100ms" : "0ms",
          }}
        >
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {t("playerManagement")}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              {t("monitorAndManage")}
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div
          ref={filtersAnimation.elementRef}
          className={`transition-all duration-700 ease-out ${
            filtersAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: filtersAnimation.isVisible ? "150ms" : "0ms",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StatsCard
              title="Online Players"
              value={playersLoading ? "..." : onlineCount.toString()}
              icon={<Users className="h-6 w-6 text-primary" />}
            />
            <StatsCard
              title="New Joins Today"
              value={newPlayers}
              icon={<Activity className="h-6 w-6 text-primary" />}
            />
            <StatsCard
              title="Peak Today"
              value={peakPlayers}
              icon={<TrendingUp className="h-6 w-6 text-primary" />}
            />
          </div>
        </div>

        {/* Filters & Search */}
        <div
          ref={filtersAnimation.elementRef}
          className={`transition-all duration-700 ease-out ${
            filtersAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: filtersAnimation.isVisible ? "200ms" : "0ms",
          }}
        >
          <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, Steam ID, Discord ID, or IP..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary/40"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-40 border-primary/20 hover:bg-primary/10"
                    >
                      {sortOrder === "name" && "Name A-Z"}
                      {sortOrder === "playtime" && "Most Playtime"}
                      {sortOrder === "ping" && "Best Ping"}
                      {sortOrder === "joinedAt" && "Recently Joined"}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleSortChange("name")}>
                      Name A-Z
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("playtime")}
                    >
                      Most Playtime
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange("ping")}>
                      Best Ping
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("joinedAt")}
                    >
                      Recently Joined
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Records and Details Section */}
        <div
          ref={tableAnimation.elementRef}
          className={`grid grid-cols-1 ${selectedPlayer ? "lg:grid-cols-12" : "lg:grid-cols-1"} gap-4 sm:gap-6 transition-all duration-700 ease-out ${
            tableAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: tableAnimation.isVisible ? "300ms" : "0ms",
          }}
        >
          {/* Player Records */}
          <div className={selectedPlayer ? "lg:col-span-7" : "lg:col-span-12"}>
            <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Player Records
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {playersLoading
                      ? "Loading..."
                      : `${totalPlayers} players found`}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="rounded-md border max-h-[600px] overflow-auto responsive-table">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="w-[140px] sm:w-[160px]">
                          Player
                        </TableHead>
                        <TableHead className="w-[70px] sm:w-[80px] mobile-hidden">
                          Status
                        </TableHead>
                        <TableHead className="w-[60px] sm:w-[80px] mobile-hidden">
                          Ping
                        </TableHead>
                        <TableHead className="w-[80px] sm:w-[100px]">
                          Playtime
                        </TableHead>
                        <TableHead className="w-[100px] sm:w-[120px] mobile-hidden">
                          Joined At
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {playersLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Loading players...
                          </TableCell>
                        </TableRow>
                      ) : playersError ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-red-500"
                          >
                            Error loading players: {playersError}
                          </TableCell>
                        </TableRow>
                      ) : players.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No players found
                          </TableCell>
                        </TableRow>
                      ) : (
                        players.map((player) => (
                          <ContextMenu key={player.id}>
                            <ContextMenuTrigger asChild>
                              <TableRow
                                className={`hover:bg-accent/50 border-border cursor-pointer ${
                                  selectedPlayer?.id === player.id
                                    ? "bg-accent/30"
                                    : ""
                                }`}
                                onClick={() => {
                                  console.log("Player clicked:", player.name);
                                  setSelectedPlayer(player);
                                }}
                                onContextMenu={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <TableCell className="table-cell-mobile">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-medium">
                                        {player.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium truncate text-sm sm:text-base">
                                        {player.name}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        <span className="sm:hidden">
                                          Online • {player.ping}ms •{" "}
                                          {new Date(
                                            player.joinedAt,
                                          ).toLocaleDateString()}
                                        </span>
                                        <span className="hidden sm:inline">
                                          Player ID: {player.id}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="mobile-hidden">
                                  <Badge
                                    variant="default"
                                    className="bg-green-500/20 text-green-400 border-green-500/30"
                                  >
                                    Online
                                  </Badge>
                                </TableCell>

                                <TableCell className="mobile-hidden">
                                  <span
                                    className={`${getPingColor(player.ping)} font-mono font-semibold px-2 py-1 rounded text-xs`}
                                  >
                                    {player.ping}ms
                                  </span>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <div className="font-medium">
                                    {formatPlaytime(player.playtime)}
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm mobile-hidden">
                                  {new Date(
                                    player.joinedAt,
                                  ).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-56">
                              <ContextMenuItem
                                onClick={() => setSelectedPlayer(player)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </ContextMenuItem>
                              {player.isOnline && (
                                <>
                                  <ContextMenuItem
                                    onClick={() => handleTakeScreenshot(player)}
                                    className="flex items-center gap-2 text-blue-600 focus:text-blue-600"
                                  >
                                    <Camera className="h-4 w-4" />
                                    Take Screenshot
                                  </ContextMenuItem>
                                  <ContextMenuItem
                                    onClick={() => {
                                      setSelectedPlayer(player);
                                      handleKickPlayer();
                                    }}
                                    className="flex items-center gap-2 text-orange-600 focus:text-orange-600"
                                  >
                                    <UserMinus className="h-4 w-4" />
                                    Kick Player
                                  </ContextMenuItem>
                                  <ContextMenuItem
                                    onClick={() => {
                                      setSelectedPlayer(player);
                                      handleBanPlayer();
                                    }}
                                    className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                  >
                                    <Shield className="h-4 w-4" />
                                    Ban Player
                                  </ContextMenuItem>
                                </>
                              )}
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                onClick={() =>
                                  handleCopy(player.name, "Player Name")
                                }
                                className="flex items-center gap-2"
                              >
                                <Copy className="h-4 w-4" />
                                Copy Name
                              </ContextMenuItem>
                              {player.steamId && (
                                <ContextMenuItem
                                  onClick={() =>
                                    handleCopy(player.steamId!, "Steam ID")
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy Steam ID
                                </ContextMenuItem>
                              )}
                              {player.discordId && (
                                <ContextMenuItem
                                  onClick={() =>
                                    handleCopy(player.discordId!, "Discord ID")
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy Discord ID
                                </ContextMenuItem>
                              )}
                              {player.ip && (
                                <ContextMenuItem
                                  onClick={() =>
                                    handleCopy(player.ip!, "IP Address")
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy IP Address
                                </ContextMenuItem>
                              )}
                            </ContextMenuContent>
                          </ContextMenu>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                {!playersLoading && totalPlayers > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-primary/20">
                    <div className="flex items-center gap-4">
                      <PaginationInfo
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={totalPlayers}
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

          {/* Player Details Section - Only show when a player is selected */}
          {selectedPlayer && (
            <div className="lg:col-span-5 mt-6 lg:mt-0">
              <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Player Details - {selectedPlayer.name}
                    </CardTitle>
                    <Button
                      onClick={() => setSelectedPlayer(null)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  {/* Action Buttons */}
                  {
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Quick Actions
                        </h4>
                        <div className="h-px bg-gradient-to-r from-primary/20 to-transparent flex-1 ml-4" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button
                          onClick={() => handleTakeScreenshot(selectedPlayer)}
                          variant="ghost"
                          className="h-12 border border-blue-500/30 hover:border-blue-500/50 bg-gradient-to-r from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/20 text-blue-600 hover:text-blue-500 transition-all duration-200 group"
                        >
                          <div className="flex items-center justify-center gap-3">
                            <Camera className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Screenshot</span>
                          </div>
                        </Button>

                        <Button
                          onClick={handleKickPlayer}
                          variant="ghost"
                          className="h-12 border border-orange-500/30 hover:border-orange-500/50 bg-gradient-to-r from-orange-500/5 to-orange-500/10 hover:from-orange-500/10 hover:to-orange-500/20 text-orange-600 hover:text-orange-500 transition-all duration-200 group"
                        >
                          <div className="flex items-center justify-center gap-3">
                            <UserMinus className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Kick</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  }

                  {/* Player Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Player Information</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-lg font-medium">
                          {selectedPlayer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{selectedPlayer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Player ID: {selectedPlayer.id}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Status</div>
                        <Badge
                          variant="default"
                          className="bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          Online
                        </Badge>
                      </div>

                      <div>
                        <div className="text-muted-foreground">Ping</div>
                        <div
                          className={`font-medium ${getPingColor(selectedPlayer.ping)}`}
                        >
                          {selectedPlayer.ping}ms
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Playtime</div>
                        <div className="font-medium">
                          {formatPlaytime(selectedPlayer.playtime)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Identifiers */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Identifiers</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Steam ID</div>
                        <div className="font-mono text-xs">
                          {selectedPlayer.steamId || "Not Available"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Discord ID</div>
                        <div className="font-mono text-xs">
                          {selectedPlayer.discordId || "Not Available"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">License</div>
                        <div className="font-mono text-xs break-all">
                          {selectedPlayer.license || "Not Available"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">IP Address</div>
                        <div className="font-mono text-xs">
                          {selectedPlayer.ip || "Not Available"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Session Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Session Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Joined At</div>
                        <div className="font-medium">
                          {formatTimestamp(selectedPlayer.joinedAt)}
                        </div>
                      </div>
                      {selectedPlayer.position && (
                        <div>
                          <div className="text-muted-foreground">Position</div>
                          <div className="font-mono text-xs">
                            X: {selectedPlayer.position.x.toFixed(1)}, Y:{" "}
                            {selectedPlayer.position.y.toFixed(1)}, Z:{" "}
                            {selectedPlayer.position.z.toFixed(1)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Kick Player Confirmation Modal */}
        <AlertDialog
          open={isKickDialogOpen}
          onOpenChange={(open) => {
            setIsKickDialogOpen(open);
            if (!open) {
              setKickReason("");
              setSelectedPlayer(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kick Player Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to kick{" "}
                <span className="font-semibold text-foreground">
                  {selectedPlayer?.name}
                </span>{" "}
                from the server?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kick-reason">Reason for kick *</Label>
                <Textarea
                  id="kick-reason"
                  placeholder="Enter the reason for kicking this player..."
                  value={kickReason}
                  onChange={(e) => setKickReason(e.target.value)}
                  className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary/40"
                  required
                />
                <div className="text-xs text-muted-foreground">
                  {kickReason.length}/200 characters
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setIsKickDialogOpen(false);
                  setKickReason("");
                  setSelectedPlayer(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmKick}
                disabled={!kickReason.trim()}
                className="bg-destructive hover:bg-destructive/90"
              >
                Kick Player
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Screenshot Viewing Modal */}
        <Dialog
          open={isScreenshotViewOpen}
          onOpenChange={(open) => {
            setIsScreenshotViewOpen(open);
            if (!open) {
              setScreenshotUrl(null);
              setScreenshotPlayer(null);
            }
          }}
        >
          <DialogContent className="max-w-5xl max-h-[90vh] bg-background/95 backdrop-blur-xl border-primary/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-500" />
                Screenshot - {screenshotPlayer?.name}
              </DialogTitle>
              <DialogDescription>
                Player's current screen capture
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Screenshot Display */}
              {screenshotUrl && (
                <div className="relative">
                  <img
                    src={screenshotUrl}
                    alt={`Screenshot of ${screenshotPlayer?.name}`}
                    className="w-full max-h-[60vh] object-contain rounded-lg border border-border"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSIjMTExODI3Ii8+CjxwYXRoIGQ9Ik05NjAgNTQwTDk5MCA1MTBIOTMwTDk2MCA1NDBaIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9Ijk2MCIgeT0iNTYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3Mjg4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPlNjcmVlbnNob3QgVW5hdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=";
                    }}
                  />
                </div>
              )}

              {/* Player Info */}
              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {screenshotPlayer?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{screenshotPlayer?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Player ID: {screenshotPlayer?.id} • Taken at{" "}
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-sm">
                  <Badge
                    variant={
                      screenshotPlayer?.isOnline ? "default" : "secondary"
                    }
                    className={
                      screenshotPlayer?.isOnline
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-muted/50 text-muted-foreground"
                    }
                  >
                    {screenshotPlayer?.isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsScreenshotViewOpen(false);
                  setScreenshotUrl(null);
                  setScreenshotPlayer(null);
                }}
                className="w-full sm:w-auto border-primary/20 hover:bg-primary/10"
              >
                Close
              </Button>
              <Button
                onClick={handleDownloadScreenshot}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                Download Screenshot
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Ban Player Confirmation Modal */}
        <AlertDialog
          open={isBanDialogOpen}
          onOpenChange={(open) => {
            setIsBanDialogOpen(open);
            if (!open) {
              setBanReason("");
              setBanDuration("permanent");
              setSelectedPlayer(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ban Player Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to ban{" "}
                <span className="font-semibold text-foreground">
                  {selectedPlayer?.name}
                </span>{" "}
                from the server?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ban-reason">Reason for ban *</Label>
                <Textarea
                  id="ban-reason"
                  placeholder="Enter the reason for banning this player..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary/40"
                  required
                />
                <div className="text-xs text-muted-foreground">
                  {banReason.length}/300 characters
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ban-duration">Ban Duration</Label>
                <Select value={banDuration} onValueChange={setBanDuration}>
                  <SelectTrigger className="bg-background/50 border-primary/20 focus:border-primary/40">
                    <SelectValue placeholder="Select ban duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hour">1 Hour</SelectItem>
                    <SelectItem value="6hours">6 Hours</SelectItem>
                    <SelectItem value="1day">1 Day</SelectItem>
                    <SelectItem value="3days">3 Days</SelectItem>
                    <SelectItem value="1week">1 Week</SelectItem>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-red-700 dark:text-red-400">
                      Warning
                    </p>
                    <p className="text-red-600 dark:text-red-300 mt-1">
                      This action will remove the player from the server and add
                      them to the ban list.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setIsBanDialogOpen(false);
                  setBanReason("");
                  setBanDuration("permanent");
                  setSelectedPlayer(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmBan}
                disabled={!banReason.trim()}
                className="bg-destructive hover:bg-destructive/90"
              >
                Ban Player
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
