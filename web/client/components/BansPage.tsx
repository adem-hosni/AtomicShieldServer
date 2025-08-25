import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";
import { DashboardError } from "@/components/ui/dashboard-error";
import { useErrorTracking, formatApiError } from "@/hooks/use-error-tracking";
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
  UserX,
  Shield,
  Eye,
  Copy,
  History,
  AlertTriangle,
  Ban,
} from "lucide-react";
import {
  Pagination,
  PageSizeSelector,
  PaginationInfo,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { createCopyHandler } from "@/lib/copy-utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { usePaginatedApi, useApiMutation } from "@/hooks/use-api";
import { api } from "@/lib/api-client";
import { BanRecord } from "@shared/api";
import { BanDetailsModal } from "@/components/BanDetailsModal";
import { cn } from "@/lib/utils";

// Utility function to construct full evidence URLs
const getEvidenceUrl = (
  evidenceUrl: string | null | undefined,
): string | null => {
  if (!evidenceUrl) return null;

  // If it's already a full URL, return as is
  if (evidenceUrl.startsWith("http://") || evidenceUrl.startsWith("https://")) {
    return evidenceUrl;
  }

  // Construct full URL based on environment
  const baseUrl = import.meta.env.PROD
    ? "https://atomicshield.com" // Production URL
    : window.location.origin; // Development URL (http://localhost:8080 etc)

  return `${baseUrl}${evidenceUrl}`;
};

export function BansPage() {
  const { serverId } = useParams<{ serverId: string }>();
  usePageTitle("Bans");
  const { toast } = useToast();

  // Scroll animations with better settings to ensure they work
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [allBans, setAllBans] = useState<BanRecord[]>([]);
  const [filteredBans, setFilteredBans] = useState<BanRecord[]>([]);
  const [selectedBan, setSelectedBan] = useState<BanRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
  const [isBanHistoryOpen, setIsBanHistoryOpen] = useState(false);
  const [selectedPlayerForHistory, setSelectedPlayerForHistory] = useState<
    string | null
  >(null);
  const [isFalsePositiveOpen, setIsFalsePositiveOpen] = useState(false);
  const [selectedBanForReport, setSelectedBanForReport] =
    useState<BanRecord | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [isBanDetailsModalOpen, setIsBanDetailsModalOpen] = useState(false);
  const [selectedBanForDetails, setSelectedBanForDetails] =
    useState<BanRecord | null>(null);
  const [isUnbanLoading, setIsUnbanLoading] = useState<string | null>(null);
  const [isBanLoading, setIsBanLoading] = useState<string | null>(null);

  // Force cleanup of modal overlays on unmount and mount
  useEffect(() => {
    // Clean up on mount in case there are leftover elements
    cleanupModalOverlays();

    // Add global click handler to detect blocked interactions
    const handleGlobalClick = (e: MouseEvent) => {
      // If click is being blocked, force cleanup
      const target = e.target as Element;
      if (
        target &&
        !target.closest("[data-radix-dialog-content]") &&
        !target.closest("[data-radix-alert-dialog-content]")
      ) {
        // This is a click outside of modals, ensure no overlays are blocking
        setTimeout(() => {
          cleanupModalOverlays();
        }, 50);
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
      // Clean up any lingering modal overlays
      cleanupModalOverlays();
    };
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Calculate dynamic height based on page size
  const getTableHeight = () => {
    const baseHeight = 400;
    const rowHeight = 60;
    const headerHeight = 120;
    const paginationHeight = 80;

    return Math.min(
      baseHeight + pageSize * rowHeight * 0.6, // Scale with page size
      800, // Maximum height
    );
  };

  // Fetch bans data from API
  const fetchBans = async () => {
    if (!serverId) {
      setError("Server ID is required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("🔍 Fetching bans for server:", serverId);
      const response = await api.servers.getServerBans(serverId);

      if (response.success && response.data) {
        // Always use API data first, even if empty
        const bansData = response.data.bans || [];
        setAllBans(bansData);
        const sortedBans = applySorting(bansData, sortOrder);
        setFilteredBans(sortedBans);
      } else {
        // No data received from API
        setAllBans([]);
        setFilteredBans([]);
        setError("No ban data available");
      }
    } catch (err) {
      // Handle API error
      setAllBans([]);
      setFilteredBans([]);
      setError("Failed to load ban data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBans();
  }, [serverId]);

  // Apply sorting when sort order changes
  useEffect(() => {
    if (allBans.length > 0) {
      const sortedBans = applySorting(allBans, sortOrder);
      setFilteredBans(sortedBans);
    }
  }, [allBans, sortOrder]);

  const applySorting = (bans: BanRecord[], sortType: string): BanRecord[] => {
    const sorted = [...bans];
    switch (sortType) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.bannedAt).getTime() - new Date(a.bannedAt).getTime(),
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.bannedAt).getTime() - new Date(b.bannedAt).getTime(),
        );
      case "name":
        return sorted.sort((a, b) => a.playerName.localeCompare(b.playerName));
      default:
        return sorted;
    }
  };

  // Get paginated data
  const getPaginatedBans = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBans.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredBans.length / pageSize);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching

    let filtered = allBans;

    if (query.trim() !== "") {
      filtered = allBans.filter(
        (ban) =>
          ban.playerName.toLowerCase().includes(query.toLowerCase()) ||
          ban.banId.toLowerCase().includes(query.toLowerCase()) ||
          ban.reason.toLowerCase().includes(query.toLowerCase()),
      );
    }

    const sortedAndFiltered = applySorting(filtered, sortOrder);
    setFilteredBans(sortedAndFiltered);
  };

  const handleSortChange = (newSortOrder: string) => {
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page when sorting
    const sortedBans = applySorting(filteredBans, newSortOrder);
    setFilteredBans(sortedBans);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedBan(null); // Clear selection when changing pages
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleUnbanClick = () => {
    setIsUnbanDialogOpen(true);
  };

  const handleConfirmUnban = async () => {
    if (selectedBan && serverId) {
      setIsUnbanLoading(selectedBan.id);

      try {
        const response = await api.servers.unbanPlayer(
          serverId,
          selectedBan.banId || selectedBan.id,
        );

        if (response.success) {
          await fetchBans();
          toast({
            title: "Player Unbanned",
            description: `Successfully unbanned ${selectedBan.playerName}`,
          });
        } else {
          toast({
            title: "Unban Failed",
            description: response.error || "Failed to unban player",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Unban Error",
          description: "An error occurred while unbanning the player",
          variant: "destructive",
        });
      } finally {
        setIsUnbanLoading(null);
      }

      // Close dialog first, then clear selection with delay to prevent conflicts
      setIsUnbanDialogOpen(false);
      setTimeout(() => {
        setSelectedBan(null);
        cleanupModalOverlays();
      }, 150);
    }
  };

  const handleCancelUnban = () => {
    setIsUnbanDialogOpen(false);
    // Clear selection with delay to prevent conflicts
    setTimeout(() => {
      setSelectedBan(null);
      // Force cleanup of any remaining overlay elements
      cleanupModalOverlays();
    }, 150);
  };

  const handleBanPlayer = async (ban: BanRecord) => {
    if (!serverId) return;

    setIsBanLoading(ban.id);

    try {
      const response = await api.servers.banPlayer(serverId, ban.banId);

      if (response.success) {
        await fetchBans();
        toast({
          title: "Player Banned",
          description: `Successfully banned ${ban.playerName}`,
        });
      } else {
        toast({
          title: "Ban Failed",
          description: response.error || "Failed to ban player",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ban error:", error);
      toast({
        title: "Ban Error",
        description: "An error occurred while banning the player",
        variant: "destructive",
      });
    } finally {
      setIsBanLoading(null);
    }
  };

  // Helper function to check if a ban is currently active
  const isBanActive = (ban: BanRecord) => {
    return ban.isActive;
  };

  // Utility function to clean up modal overlays
  const cleanupModalOverlays = () => {
    // Remove any lingering Radix overlays that might block interactions
    const overlaySelectors = [
      "[data-radix-overlay]",
      "[data-overlay]",
      ".radix-overlay",
      "[data-radix-dialog-overlay]",
      "[data-radix-alert-dialog-overlay]",
      "[data-radix-context-menu-content]",
      '[role="dialog"][style*="position: fixed"]',
      '[role="alertdialog"][style*="position: fixed"]',
    ];

    overlaySelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const style = window.getComputedStyle(element);
        // Remove if it's a modal overlay (fixed position with backdrop)
        if (
          style.position === "fixed" &&
          (style.backgroundColor.includes("rgba(0, 0, 0") ||
            style.backgroundColor.includes("rgb(0, 0, 0") ||
            element.getAttribute("data-state") === "closed")
        ) {
          try {
            element.remove();
          } catch (e) {
            // Fallback removal
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          }
        }
      });
    });

    // Check for any invisible blocking elements
    const allFixed = document.querySelectorAll(
      '[style*="position: fixed"], [style*="position:fixed"]',
    );
    allFixed.forEach((element) => {
      const style = window.getComputedStyle(element);
      const zIndex = parseInt(style.zIndex) || 0;

      // Remove high z-index invisible or semi-transparent blocking elements
      if (zIndex >= 50 && style.position === "fixed") {
        const opacity = parseFloat(style.opacity) || 1;
        const isInvisible = opacity === 0 || style.visibility === "hidden";
        const isBackdrop =
          style.backgroundColor.includes("rgba(0, 0, 0") ||
          style.backgroundColor.includes("rgb(0, 0, 0");

        if (isInvisible || (isBackdrop && opacity < 0.9)) {
          try {
            element.remove();
          } catch (e) {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          }
        }
      }
    });

    // Force re-enable pointer events on body
    document.body.style.pointerEvents = "";
    document.documentElement.style.pointerEvents = "";

    // Remove any data attributes that might be blocking
    document.body.removeAttribute("data-radix-prevent-auto-focus");
    document.body.removeAttribute("data-scroll-locked");
  };

  const handleViewBanHistory = (playerName: string, playerId?: string) => {
    setSelectedPlayerForHistory(playerName);
    setIsBanHistoryOpen(true);
  };

  // Generate ban history data from real API data
  const generateBanHistory = (playerName: string) => {
    // Find the selected player's ID for more accurate matching
    const selectedPlayer = allBans.find((ban) => ban.playerName === playerName);
    const playerId = selectedPlayer?.playerId || selectedPlayer?.steamId;

    // Find all bans for this player from the real data using both name and ID
    const playerBans = allBans.filter(
      (ban) =>
        ban.playerName === playerName ||
        (playerId && (ban.playerId === playerId || ban.steamId === playerId)),
    );

    // Map real ban data to history format
    const historyEntries = playerBans.map((ban, index) => ({
      id: ban.id,
      banId: ban.banId || ban.id,
      reason: ban.reason,
      bannedAt: ban.bannedAt,
      unbannedAt: ban.status === "Permanent" ? "-" : "Unknown",
      duration: ban.status === "Permanent" ? "Permanent" : "Unknown",
      admin: "System", // Default to System since admin info isn't in the current API
      status: ban.status === "Permanent" ? "Active" : ban.status,
    }));

    return historyEntries;
  };

  // Professional copy function with enhanced error handling
  const handleCopy = createCopyHandler(toast);

  const handleReportFalsePositive = (ban: BanRecord) => {
    setSelectedBanForReport(ban);
    setIsFalsePositiveOpen(true);
  };

  const handleViewDetails = (ban: BanRecord) => {
    setSelectedBanForDetails(ban);
    setIsBanDetailsModalOpen(true);
  };

  const handleSubmitFalsePositiveReport = async () => {
    if (selectedBanForReport && reportReason.trim() && serverId) {
      try {
        console.log(selectedBanForReport.id.substring(1));
        const response = await api.servers.reportFalsePositive(
          serverId,
          selectedBanForReport.id.substring(1),
          reportReason.trim(),
        );

        if (response.success) {
          toast({
            title: "Report Submitted Successfully",
            description: `False positive report for Ban ID ${selectedBanForReport.banId || selectedBanForReport.id} has been submitted for review.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Report Failed",
            description:
              response.error || "Failed to submit false positive report",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("False positive report error:", error);
        toast({
          title: "Report Error",
          description: "An error occurred while submitting the report",
          variant: "destructive",
        });
      } finally {
        setIsFalsePositiveOpen(false);
        setTimeout(() => {
          setSelectedBanForReport(null);
          setReportReason("");
          cleanupModalOverlays();
        }, 150);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.05)_75%,rgba(59,130,246,0.05)_76%,transparent_77%)] bg-[length:60px_60px] animate-pulse" />
      </div>

      <div className="p-4 space-y-4 relative">
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
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {serverId && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/server/${serverId}`}>
                      Server {serverId}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>Bans</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div
          ref={headerAnimation.elementRef}
          className={`flex items-center justify-between transition-all duration-700 ease-out ${
            headerAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: headerAnimation.isVisible ? "100ms" : "0ms",
          }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Server Bans
            </h1>
            <p className="text-muted-foreground text-lg">
              Review ban records and manage banned players on this server.
            </p>
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
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for Ban ID, reason, or player name..."
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
                      {sortOrder === "newest" && "Newest First"}
                      {sortOrder === "oldest" && "Oldest First"}
                      {sortOrder === "name" && "Player Name"}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("newest")}
                    >
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("oldest")}
                    >
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange("name")}>
                      Player Name
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ban Records and Details Section */}
        <div
          ref={tableAnimation.elementRef}
          className={`grid grid-cols-1 ${selectedBan ? "xl:grid-cols-12" : "xl:grid-cols-1"} gap-4 sm:gap-6 xl:gap-8 transition-all duration-700 ease-out ${
            tableAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: tableAnimation.isVisible ? "300ms" : "0ms",
          }}
        >
          {/* Ban Records */}
          <div className={selectedBan ? "xl:col-span-7" : "xl:col-span-12"}>
            <Card
              className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 flex flex-col"
              style={{ height: `${getTableHeight()}px` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserX className="h-5 w-5 text-primary" />
                    Ban Records
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {filteredBans.length} total bans found{" "}
                    {serverId && `(Server: ${serverId})`}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">
                        Loading bans for server {serverId}...
                      </p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center space-y-4">
                      <div className="text-red-500 text-2xl">❌</div>
                      <p className="text-muted-foreground">Error: {error}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {false && (
                      <div className="mb-4 p-3 bg-muted/30 rounded-lg text-xs font-mono">
                        <div>����� Debug Info:</div>
                      </div>
                    )}

                    <div className="rounded-md border h-full overflow-x-auto">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="w-[80px] sm:w-[100px] min-w-[80px]">
                              Ban ID
                            </TableHead>
                            <TableHead className="w-[120px] sm:w-[180px] min-w-[120px]">
                              Player
                            </TableHead>
                            <TableHead className="w-[100px] sm:w-[180px] min-w-[100px] hidden sm:table-cell">
                              Reason
                            </TableHead>
                            <TableHead className="w-[80px] sm:w-[100px] min-w-[80px]">
                              Status
                            </TableHead>
                            <TableHead className="w-[90px] sm:w-[100px] min-w-[90px] hidden md:table-cell">
                              Banned At
                            </TableHead>
                            <TableHead className="w-[90px] sm:w-[100px] min-w-[90px] hidden lg:table-cell">
                              First Join
                            </TableHead>
                            <TableHead className="w-[80px] sm:w-[100px] min-w-[80px]">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getPaginatedBans().map((ban, index) => (
                            <ContextMenu key={ban.id}>
                              <ContextMenuTrigger asChild>
                                <TableRow
                                  className={`hover:bg-accent/50 border-border cursor-pointer ${
                                    selectedBan?.id === ban.id
                                      ? "bg-accent/30"
                                      : ""
                                  }`}
                                  onClick={(e) => {
                                    // Only trigger selection on left click, not right click
                                    if (e.button === 0) {
                                      setSelectedBan(ban);
                                    }
                                  }}
                                  onContextMenu={(e) => {
                                    // Right-click only shows context menu, doesn't open details
                                    e.stopPropagation();
                                  }}
                                >
                                  <TableCell className="font-mono text-xs sm:text-sm font-medium">
                                    <div className="truncate max-w-[70px] sm:max-w-none">
                                      {ban.banId || ban.id || "NO_ID"}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-medium">
                                          {ban.playerName
                                            .charAt(0)
                                            .toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="font-medium truncate text-sm sm:text-base">
                                          {ban.playerName}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate sm:hidden">
                                          {ban.reason}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate hidden sm:block">
                                          {ban.playerId ||
                                            ban.steamId ||
                                            "No Steam ID"}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    <span className="text-sm truncate max-w-[100px] sm:max-w-none block">
                                      {ban.reason}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        isBanActive(ban)
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={cn(
                                        "text-xs sm:text-sm whitespace-nowrap px-2 py-1",
                                        isBanActive(ban)
                                          ? "bg-green-500/20 text-green-400 border-green-400/30 hover:bg-green-500/30"
                                          : "bg-gray-500/20 text-gray-400 border-gray-400/30 hover:bg-gray-500/30",
                                      )}
                                    >
                                      {isBanActive(ban) ? "Active" : "Inactive"}
                                    </Badge>
                                    <div className="text-xs text-muted-foreground sm:hidden truncate">
                                      {ban.bannedAt}
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    <div className="text-xs sm:text-sm truncate">
                                      {ban.bannedAt}
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden lg:table-cell">
                                    <div className="text-xs sm:text-sm truncate">
                                      {ban.firstJoin}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-9 w-9 sm:h-8 sm:w-8 p-0 touch-manipulation"
                                          disabled={
                                            isUnbanLoading === ban.id ||
                                            isBanLoading === ban.id
                                          }
                                        >
                                          {isUnbanLoading === ban.id ||
                                          isBanLoading === ban.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                          ) : (
                                            <ChevronDown className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                      >
                                        <DropdownMenuItem
                                          onClick={() => handleViewDetails(ban)}
                                          className="flex items-center gap-2"
                                        >
                                          <Eye className="h-4 w-4" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleViewBanHistory(
                                              ban.playerName,
                                              ban.playerId || ban.steamId,
                                            )
                                          }
                                          className="flex items-center gap-2"
                                        >
                                          <History className="h-4 w-4" />
                                          View Ban History
                                        </DropdownMenuItem>
                                        {isBanActive(ban) ? (
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setSelectedBan(ban);
                                              handleUnbanClick();
                                            }}
                                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                            disabled={isUnbanLoading === ban.id}
                                          >
                                            <Shield className="h-4 w-4" />
                                            {isUnbanLoading === ban.id
                                              ? "Unbanning..."
                                              : "Unban Player"}
                                          </DropdownMenuItem>
                                        ) : (
                                          <DropdownMenuItem
                                            onClick={() => handleBanPlayer(ban)}
                                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                            disabled={isBanLoading === ban.id}
                                          >
                                            <Ban className="h-4 w-4" />
                                            {isBanLoading === ban.id
                                              ? "Banning..."
                                              : "Ban Player"}
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              </ContextMenuTrigger>
                              <ContextMenuContent className="w-56">
                                <ContextMenuItem
                                  onClick={() => setSelectedBan(ban)}
                                  className="flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </ContextMenuItem>
                                {isBanActive(ban) ? (
                                  <ContextMenuItem
                                    onClick={() => {
                                      setSelectedBan(ban);
                                      handleUnbanClick();
                                    }}
                                    className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                    disabled={isUnbanLoading === ban.id}
                                  >
                                    <Shield className="h-4 w-4" />
                                    {isUnbanLoading === ban.id
                                      ? "Unbanning..."
                                      : "Unban Player"}
                                  </ContextMenuItem>
                                ) : (
                                  <ContextMenuItem
                                    onClick={() => handleBanPlayer(ban)}
                                    className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                    disabled={isBanLoading === ban.id}
                                  >
                                    <Ban className="h-4 w-4" />
                                    {isBanLoading === ban.id
                                      ? "Banning..."
                                      : "Ban Player"}
                                  </ContextMenuItem>
                                )}
                                <ContextMenuSeparator />
                                <ContextMenuItem
                                  onClick={() =>
                                    handleCopy(ban.banId, "Ban ID")
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy Ban ID
                                </ContextMenuItem>
                                <ContextMenuItem
                                  onClick={() =>
                                    handleCopy(ban.playerName, "Player Name")
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy Player Name
                                </ContextMenuItem>
                                <ContextMenuItem
                                  onClick={() =>
                                    handleCopy(ban.reason, "Ban Reason")
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy Reason
                                </ContextMenuItem>
                                <ContextMenuItem
                                  onClick={() =>
                                    handleCopy(ban.bannedAt, "Ban Date")
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy Banned At
                                </ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem
                                  className="flex items-center gap-2"
                                  onClick={() => {
                                    handleViewBanHistory(
                                      ban.playerName,
                                      ban.playerId || ban.steamId,
                                    );
                                  }}
                                >
                                  <History className="h-4 w-4" />
                                  View Ban History
                                </ContextMenuItem>
                                <ContextMenuItem
                                  className="flex items-center gap-2 text-yellow-600 focus:text-yellow-600"
                                  onClick={() => handleReportFalsePositive(ban)}
                                  disabled={ban.reportedAsFalsePositive}
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                  Report False Positive
                                </ContextMenuItem>
                              </ContextMenuContent>
                            </ContextMenu>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredBans.length > 0 && (
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 pt-6 mt-4 border-t border-primary/20">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                          <PaginationInfo
                            currentPage={currentPage}
                            pageSize={pageSize}
                            totalItems={filteredBans.length}
                          />
                          <PageSizeSelector
                            pageSize={pageSize}
                            onPageSizeChange={handlePageSizeChange}
                            options={[10, 25, 50, 100]}
                          />
                        </div>
                        <div className="flex justify-center sm:justify-end mt-2 sm:mt-0">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ban Details Section - Only show when a ban is selected */}
          {selectedBan && (
            <div
              ref={detailsAnimation.elementRef}
              className={`xl:col-span-5 mt-6 xl:mt-0 transition-all duration-500 ease-out ${
                detailsAnimation.isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4"
              }`}
              style={{
                transitionDelay: detailsAnimation.isVisible ? "100ms" : "0ms",
              }}
            >
              <Card
                className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 flex flex-col"
                style={{ height: `${getTableHeight()}px` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2 min-w-0">
                      <UserX className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="truncate">
                        Ban Details - {selectedBan.banId}
                      </span>
                    </CardTitle>
                    <Button
                      onClick={() => setSelectedBan(null)}
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 sm:h-8 sm:w-8 p-0 touch-manipulation flex-shrink-0 ml-2"
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 overflow-y-auto">
                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Quick Actions
                      </h4>
                      <div className="h-px bg-gradient-to-r from-primary/20 to-transparent flex-1 ml-4" />
                    </div>

                    <div className="space-y-3">
                      {/* Primary Action - Dynamic Ban/Unban */}
                      {isBanActive(selectedBan) ? (
                        <Button
                          onClick={handleUnbanClick}
                          disabled={isUnbanLoading === selectedBan.id}
                          className="w-full h-12 sm:h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group disabled:opacity-50 touch-manipulation"
                        >
                          <div className="flex items-center justify-center gap-3">
                            {isUnbanLoading === selectedBan.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <UserX className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                            )}
                            <span className="text-sm sm:text-base">
                              {isUnbanLoading === selectedBan.id
                                ? "Unbanning..."
                                : "Unban Player"}
                            </span>
                          </div>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleBanPlayer(selectedBan)}
                          disabled={isBanLoading === selectedBan.id}
                          className="w-full h-12 sm:h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group disabled:opacity-50 touch-manipulation"
                        >
                          <div className="flex items-center justify-center gap-3">
                            {isBanLoading === selectedBan.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <Ban className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                            )}
                            <span className="text-sm sm:text-base">
                              {isBanLoading === selectedBan.id
                                ? "Banning..."
                                : "Ban Player"}
                            </span>
                          </div>
                        </Button>
                      )}

                      {/* Secondary Actions */}
                      <div className="grid grid-cols-1 gap-3">
                        <Button
                          onClick={() =>
                            handleViewBanHistory(
                              selectedBan.playerName,
                              selectedBan.playerId || selectedBan.steamId,
                            )
                          }
                          variant="ghost"
                          className="h-11 sm:h-12 border border-primary/20 hover:border-primary/40 bg-gradient-to-r from-background/50 to-background/30 hover:from-primary/5 hover:to-primary/10 transition-all duration-200 group touch-manipulation"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <History className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium text-sm sm:text-base">
                              Ban History
                            </span>
                          </div>
                        </Button>

                        <Button
                          onClick={() => handleReportFalsePositive(selectedBan)}
                          variant="ghost"
                          disabled={selectedBan.reportedAsFalsePositive}
                          className="h-11 sm:h-12 border border-yellow-500/30 hover:border-yellow-500/50 bg-gradient-to-r from-yellow-500/5 to-yellow-500/10 hover:from-yellow-500/10 hover:to-yellow-500/20 text-yellow-600 hover:text-yellow-500 transition-all duration-200 group touch-manipulation"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <AlertTriangle className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium text-sm sm:text-base">
                              Report False Positive
                            </span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Player Information */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm sm:text-base">
                        Player Information
                      </h3>
                      <div className="h-px bg-gradient-to-r from-primary/20 to-transparent flex-1 ml-4" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-base sm:text-lg font-medium">
                          {selectedBan.playerName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base truncate">
                          {selectedBan.playerName}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground truncate">
                          Steam ID:{" "}
                          {selectedBan.playerId ||
                            selectedBan.steamId ||
                            "No Steam ID"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="p-3 bg-accent/30 rounded-lg">
                        <div className="text-muted-foreground mb-1">
                          First Join
                        </div>
                        <div className="font-medium truncate">
                          {selectedBan.firstJoin}
                        </div>
                      </div>
                      <div className="p-3 bg-accent/30 rounded-lg">
                        <div className="text-muted-foreground mb-1">
                          Banned At
                        </div>
                        <div className="font-medium truncate">
                          {selectedBan.bannedAt}
                        </div>
                      </div>
                      <div className="p-3 bg-accent/30 rounded-lg">
                        <div className="text-muted-foreground mb-1">Status</div>
                        <Badge
                          variant={
                            isBanActive(selectedBan) ? "default" : "secondary"
                          }
                          className={cn(
                            "text-xs",
                            isBanActive(selectedBan)
                              ? "bg-green-500/20 text-green-400 border-green-400/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-400/30",
                          )}
                        >
                          {isBanActive(selectedBan) ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="p-3 bg-accent/30 rounded-lg">
                        <div className="text-muted-foreground mb-1">
                          Total Playtime
                        </div>
                        <div className="font-medium truncate">
                          {selectedBan.totalPlaytime || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ban Information */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm sm:text-base">
                        Ban Information
                      </h3>
                      <div className="h-px bg-gradient-to-r from-primary/20 to-transparent flex-1 ml-4" />
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-accent/30 rounded-lg">
                        <div className="text-muted-foreground text-xs sm:text-sm mb-1">
                          Reason
                        </div>
                        <div className="font-medium text-sm sm:text-base break-words">
                          {selectedBan.reason}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-accent/30 rounded-lg">
                          <div className="text-muted-foreground text-xs sm:text-sm mb-1">
                            Ban ID
                          </div>
                          <div className="font-mono text-xs sm:text-sm truncate">
                            {selectedBan.banId}
                          </div>
                        </div>
                        <div className="p-3 bg-accent/30 rounded-lg">
                          <div className="text-muted-foreground text-xs sm:text-sm mb-1">
                            Detection System
                          </div>
                          <div className="font-medium text-xs sm:text-sm">
                            AtomicShield v2.1.3
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Report Information Section */}
                  {selectedBan.report &&
                    Object.keys(selectedBan.report).length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm sm:text-base">
                            Report Information
                          </h3>
                          <div className="h-px bg-gradient-to-r from-yellow-500/20 to-transparent flex-1 ml-4" />
                        </div>

                        <div className="space-y-3">
                          {/* Report Status */}
                          {selectedBan.report["Status"] && (
                            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">
                                  Status
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs border",
                                  selectedBan.report["Status"] === "reviewed"
                                    ? "bg-green-500/20 text-green-400 border-green-400/30"
                                    : selectedBan.report["Status"] === "pending"
                                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                                      : "bg-gray-500/20 text-gray-400 border-gray-400/30",
                                )}
                              >
                                {selectedBan.report["Status"]?.toUpperCase()}
                              </Badge>
                            </div>
                          )}

                          {/* Dynamic Report Fields */}
                          <div className="grid grid-cols-1 gap-3">
                            {Object.entries(selectedBan.report)
                              .filter(
                                ([key, value]) =>
                                  key !== "Status" &&
                                  key !== "Screenshot URL" &&
                                  value,
                              )
                              .map(([key, value]) => (
                                <div
                                  key={key}
                                  className="p-3 bg-accent/30 rounded-lg"
                                >
                                  <div className="text-muted-foreground text-xs sm:text-sm mb-1">
                                    {key}
                                  </div>
                                  <div
                                    className={cn(
                                      "text-xs sm:text-sm break-words",
                                      key === "Report ID"
                                        ? "font-mono"
                                        : "font-medium",
                                      key === "Report Date" && value
                                        ? "font-medium"
                                        : "font-medium",
                                    )}
                                  >
                                    {key === "Report Date" && value
                                      ? new Date(value).toLocaleString()
                                      : value}
                                  </div>
                                </div>
                              ))}
                          </div>

                          {/* Report Screenshot */}
                          {selectedBan.report["Screenshot URL"] && (
                            <div className="p-3 bg-accent/30 rounded-lg">
                              <div className="text-muted-foreground text-xs sm:text-sm mb-2">
                                Report Screenshot
                              </div>
                              <div className="bg-secondary/20 border border-border rounded-lg p-3 sm:p-4">
                                <img
                                  src={selectedBan.report["Screenshot URL"]}
                                  alt="Report Screenshot"
                                  className="w-full h-auto max-h-48 sm:max-h-64 object-contain rounded-lg border border-border/50"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.nextElementSibling!.style.display =
                                      "block";
                                  }}
                                />
                                <div className="text-center space-y-1 hidden">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
                                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                                  </div>
                                  <div className="font-medium text-xs sm:text-sm">
                                    Report Screenshot Failed to Load
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Evidence Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm sm:text-base">
                        Evidence & Screenshot
                      </h3>
                      <div className="h-px bg-gradient-to-r from-primary/20 to-transparent flex-1 ml-4" />
                    </div>
                    <div
                      className={`bg-secondary/20 border border-border rounded-lg p-3 sm:p-4 flex items-center justify-center ${
                        selectedBan.evidence && selectedBan.evidenceUrl
                          ? "min-h-32 sm:min-h-48"
                          : "min-h-16 sm:min-h-24"
                      }`}
                    >
                      {selectedBan.evidence && selectedBan.evidenceUrl ? (
                        <div className="w-full space-y-2 sm:space-y-3">
                          <img
                            src={getEvidenceUrl(selectedBan.evidenceUrl) || ""}
                            alt="Ban Evidence"
                            className="w-full h-auto max-h-48 sm:max-h-64 object-contain rounded-lg border border-border/50"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling.style.display =
                                "block";
                            }}
                          />
                          <div className="text-center space-y-1 hidden">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
                              <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div className="font-medium text-xs sm:text-sm">
                              Evidence Image Failed to Load
                            </div>
                          </div>
                        </div>
                      ) : selectedBan.evidence ? (
                        <div className="text-center space-y-2 sm:space-y-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
                            <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
                          </div>
                          <div>
                            <div className="font-medium text-xs sm:text-sm">
                              Screenshot Available
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Evidence captured for this ban (URL not available)
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="text-muted-foreground text-sm">
                            No evidence available
                          </div>
                          <div className="text-xs text-muted-foreground">
                            No screenshot was captured for this ban
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

        {/* Ban Details Section - DISABLED DUPLICATE */}
        {false && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Ban Details - {selectedBan.banId}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewEvidence(selectedBan.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Evidence
                  </Button>
                  <Button
                    onClick={() => handleUnban(selectedBan.id)}
                    variant="outline"
                    size="sm"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Unban Player
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedBan.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Record
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-6">
                {/* Player Information */}
                <div className="col-span-4 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Player Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                          <span className="text-lg font-medium">
                            {selectedBan.playerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {selectedBan.playerName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Steam ID: {selectedBan.playerId}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">
                            First Join
                          </div>
                          <div className="font-medium">
                            {selectedBan.firstJoin}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Banned At</div>
                          <div className="font-medium">
                            {selectedBan.bannedAt}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Status</div>
                          <Badge
                            variant="destructive"
                            className="bg-destructive/20 text-destructive border-destructive/30"
                          >
                            {selectedBan.status}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-muted-foreground">
                            Total Playtime
                          </div>
                          <div className="font-medium">
                            {selectedBan.totalPlaytime || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Ban Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Reason</div>
                        <div className="font-medium">{selectedBan.reason}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Ban ID</div>
                        <div className="font-mono">{selectedBan.banId}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">
                          Detection System
                        </div>
                        <div className="font-medium">AtomicShield v2.1.3</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Section */}
                <div className="col-span-8">
                  <h3 className="font-semibold mb-3">Evidence & Screenshot</h3>
                  <div className="bg-secondary/20 border border-border rounded-lg p-4 h-80 flex items-center justify-center">
                    {selectedBan.evidence ? (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto">
                          <Eye className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="font-medium">
                            Screenshot Available
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Click "View Evidence" to see the full screenshot
                          </div>
                        </div>
                        <Button
                          onClick={() => handleViewEvidence(selectedBan.id)}
                        >
                          View Full Evidence
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="text-muted-foreground">
                          No evidence available
                        </div>
                        <div className="text-sm text-muted-foreground">
                          No screenshot was captured for this ban
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Unban Confirmation Modal */}
        <AlertDialog
          open={isUnbanDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCancelUnban();
            } else {
              setIsUnbanDialogOpen(true);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Player Unban</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to unban{" "}
                <span className="font-semibold text-foreground">
                  {selectedBan?.playerName}
                </span>
                ?
              </AlertDialogDescription>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  This action will:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Remove the ban from AtomicShield</li>
                  <li>Allow the player to rejoin the server</li>
                  <li>Keep the ban record for audit purposes</li>
                </ul>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelUnban}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmUnban}
                className="bg-destructive hover:bg-destructive/90"
              >
                Yes, Unban Player
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Ban History Modal */}
        <Dialog
          open={isBanHistoryOpen}
          onOpenChange={(open) => {
            setIsBanHistoryOpen(open);
            if (!open) {
              setTimeout(() => {
                setSelectedPlayerForHistory(null);
                cleanupModalOverlays();
              }, 150);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-primary/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Ban History - {selectedPlayerForHistory}
              </DialogTitle>
              <DialogDescription>
                Complete ban history for this player
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedPlayerForHistory && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="w-[100px]">Ban ID</TableHead>
                        <TableHead className="w-[200px]">Reason</TableHead>
                        <TableHead className="w-[120px]">Banned At</TableHead>
                        <TableHead className="w-[120px]">Unbanned At</TableHead>
                        <TableHead className="w-[100px]">Duration</TableHead>
                        <TableHead className="w-[100px]">Admin</TableHead>
                        <TableHead className="w-[80px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generateBanHistory(selectedPlayerForHistory).map(
                        (historyEntry) => (
                          <TableRow
                            key={historyEntry.id}
                            className="hover:bg-accent/50 border-border"
                          >
                            <TableCell className="font-mono text-sm font-medium">
                              {historyEntry.banId}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {historyEntry.reason}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">
                              {historyEntry.bannedAt}
                            </TableCell>
                            <TableCell className="text-sm">
                              {historyEntry.unbannedAt}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  historyEntry.duration === "Permanent"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className={
                                  historyEntry.duration === "Permanent"
                                    ? "bg-destructive/20 text-destructive border-destructive/30"
                                    : "bg-secondary/20 text-secondary-foreground border-secondary/30"
                                }
                              >
                                {historyEntry.duration}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-primary/5 hover:bg-primary/10"
                              >
                                {historyEntry.admin}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  historyEntry.status === "Active"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className={
                                  historyEntry.status === "Active"
                                    ? "bg-destructive/20 text-destructive border-destructive/30"
                                    : historyEntry.status === "Appealed"
                                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                }
                              >
                                {historyEntry.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-primary/20">
                <div className="text-sm text-muted-foreground">
                  Total bans:{" "}
                  {selectedPlayerForHistory
                    ? generateBanHistory(selectedPlayerForHistory).length
                    : 0}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsBanHistoryOpen(false)}
                  className="border-primary/20 hover:bg-primary/10"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Ban Details Modal */}
        <BanDetailsModal
          ban={selectedBanForDetails}
          isOpen={isBanDetailsModalOpen}
          onClose={() => {
            setIsBanDetailsModalOpen(false);
            setTimeout(() => {
              setSelectedBanForDetails(null);
              cleanupModalOverlays();
            }, 150);
          }}
        />

        {/* False Positive Report Modal */}
        <Dialog
          open={isFalsePositiveOpen}
          onOpenChange={(open) => {
            setIsFalsePositiveOpen(open);
            if (!open) {
              setTimeout(() => {
                setSelectedBanForReport(null);
                setReportReason("");
                cleanupModalOverlays();
              }, 150);
            }
          }}
        >
          <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-primary/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Report False Positive - {selectedBanForReport?.banId}
              </DialogTitle>
              <DialogDescription>
                Report this ban as potentially incorrect. Our team will review
                your submission and investigate the case.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Ban Information Summary */}
              {selectedBanForReport && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="font-medium mb-3">Ban Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Player:</span>
                      <div className="font-medium">
                        {selectedBanForReport.playerName}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ban ID:</span>
                      <div className="font-medium">
                        {selectedBanForReport.banId}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reason:</span>
                      <div className="font-medium">
                        {selectedBanForReport.reason}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Banned At:</span>
                      <div className="font-medium">
                        {selectedBanForReport.bannedAt}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Report Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="report-reason"
                    className="text-sm font-medium"
                  >
                    Reason for False Positive Report *
                  </Label>
                  <Textarea
                    id="report-reason"
                    placeholder="Please provide detailed information about why you believe this ban is incorrect. Include any evidence or context that supports your claim..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary/40"
                    required
                  />
                  <div className="text-xs text-muted-foreground">
                    {reportReason.length}/500 characters
                  </div>
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-700 dark:text-yellow-400">
                        Important Note
                      </p>
                      <p className="text-yellow-600 dark:text-yellow-300 mt-1">
                        False positive reports are taken seriously. Submitting
                        false or misleading reports may result in penalties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-primary/20">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsFalsePositiveOpen(false);
                    setSelectedBanForReport(null);
                    setReportReason("");
                  }}
                  className="w-full sm:w-auto border-primary/20 hover:bg-primary/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitFalsePositiveReport}
                  disabled={!reportReason.trim() || reportReason.length > 500}
                  className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
