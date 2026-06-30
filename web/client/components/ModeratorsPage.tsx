import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { Moderator } from "@shared/api";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  UserCheck,
  Shield,
  Settings,
  MoreHorizontal,
  Edit3,
  UserX,
  Pause,
  Mail,
  Activity,
  Eye,
  Clock,
  Server,
  Ban,
  FileText,
  ChevronDown,
  Copy,
  Webhook,
  Info,
  Crown,
  Camera,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Link,
  ExternalLink,
} from "lucide-react";
import {
  useScrollAnimation,
  getScrollAnimationClasses,
} from "@/hooks/use-scroll-animation";

interface Moderator {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  permissions: string[];
  lastLogin: string;
  status: "active" | "suspended" | "pending";
  joinedAt: string;
}

interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const permissionGroups: PermissionGroup[] = [
  {
    id: "dashboard",
    name: "Dashboard Access",
    description: "Basic dashboard viewing permissions",
    permissions: [
      {
        id: "view_dashboard",
        name: "View Dashboard",
        description: "Access to main dashboard and statistics",
        icon: <Eye className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "moderation",
    name: "Player Moderation",
    description: "Player management and enforcement actions",
    permissions: [
      {
        id: "kick_players",
        name: "Kick Players",
        description: "Remove players from the server temporarily",
        icon: <UserX className="h-4 w-4" />,
      },
      {
        id: "ban_players",
        name: "Ban Players",
        description: "Permanently ban players from the server",
        icon: <Ban className="h-4 w-4" />,
      },
      {
        id: "screenshot_players",
        name: "Take Player Screenshots",
        description: "Capture screenshots of player activity",
        icon: <Camera className="h-4 w-4" />,
      },
      {
        id: "view_anticheat_logs",
        name: "View Anticheat Logs",
        description: "Access anticheat detection logs",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "configuration",
    name: "System Configuration",
    description: "Server and system configuration management",
    permissions: [
      {
        id: "manage_config",
        name: "Manage Configuration",
        description: "Modify server and anticheat settings",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "advanced",
    name: "Advanced Features",
    description: "Advanced tools and management features",
    permissions: [
      {
        id: "manage_moderators",
        name: "Manage Moderators",
        description: "Add, edit, and remove other moderators",
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
];

const rolePresets = {
  full_access: {
    name: "Full Access",
    permissions: permissionGroups.flatMap((group) =>
      group.permissions.map((p) => p.id),
    ),
  },
  moderator: {
    name: "Standard Moderator",
    permissions: [
      "view_dashboard",
      "kick_players",
      "ban_players",
      "screenshot_players",
      "view_player_logs",
    ],
  },
  support: {
    name: "Support Staff",
    permissions: ["view_dashboard", "view_analytics", "view_player_logs"],
  },
  readonly: {
    name: "Read Only",
    permissions: ["view_dashboard"],
  },
};

const getStatusBadge = (status: string) => {
  const styles = {
    active: {
      label: "Active",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    suspended: {
      label: "Suspended",
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      icon: <XCircle className="h-3 w-3" />,
    },
    pending: {
      label: "Pending",
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      icon: <Clock className="h-3 w-3" />,
    },
  };
  return styles[status as keyof typeof styles] || styles.pending;
};

export function ModeratorsPage() {
  const { serverId } = useParams<{ serverId: string }>();
  usePageTitle("Moderators");
  const { toast } = useToast();
  const { t } = useLanguage();
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [filteredModerators, setFilteredModerators] = useState<Moderator[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingModerator, setEditingModerator] = useState<Moderator | null>(
    null,
  );
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [confirmAction, setConfirmAction] = useState<{
    type: "suspend" | "remove" | "reactivate";
    id: string;
    username: string;
  } | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Scroll animation hooks for different sections
  const headerAnimation = useScrollAnimation({ threshold: 0.3 });
  const filtersAnimation = useScrollAnimation({ threshold: 0.2 });
  const tableAnimation = useScrollAnimation({ threshold: 0.2 });
  const statsAnimation = useScrollAnimation({ threshold: 0.3 });

  // Mock search results for platform accounts
  const platformaAccounts = [
    {
      id: "p1",
      username: "ShieldMaster",
      email: "shield@atomicshield.com",
      avatar: "",
    },
    {
      id: "p2",
      username: "CyberGuard",
      email: "cyber@atomicshield.com",
      avatar: "",
    },
    {
      id: "p3",
      username: "SecureAdmin",
      email: "secure@atomicshield.com",
      avatar: "",
    },
    {
      id: "p4",
      username: "ProteusX",
      email: "proteus@atomicshield.com",
      avatar: "",
    },
    {
      id: "p5",
      username: "QuantumShield",
      email: "quantum@atomicshield.com",
      avatar: "",
    },
  ];

  // Form states for add/edit modal
  const [formData, setFormData] = useState({
    selectedAccount: null as any,
    permissions: [] as string[],
  });

  useEffect(() => {
    const fetchModerators = async () => {
      if (!serverId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await api.moderators.getModerators(serverId);
        console.log(response);
        if (response.success && response.data) {
          const moderatorsData = (response.data.moderators || []).map(
            (moderator) => ({
              ...moderator,
              permissions: moderator.permissions || [], // Ensure each moderator has permissions array
            }),
          );
          setModerators(moderatorsData);
          const sortedModerators = applySorting(moderatorsData, sortOrder);
          setFilteredModerators(sortedModerators);
        } else {
          const errorMessage =
            response.message || response.error || "Failed to load moderators";
          setModerators([]);
          setFilteredModerators([]);
          setError(errorMessage);
        }
      } catch (err) {
        setModerators([]);
        setFilteredModerators([]);
        setError("Failed to load moderator data");
        console.error("Error fetching moderators:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModerators();
  }, [serverId]);

  useEffect(() => {
    if (moderators.length > 0) {
      const sortedModerators = applySorting(moderators, sortOrder);
      setFilteredModerators(sortedModerators);
    }
  }, [moderators, sortOrder]);

  // Sorting function
  const applySorting = (mods: Moderator[], order: string) => {
    return [...mods].sort((a, b) => {
      switch (order) {
        case "newest":
          return (
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
          );
        case "name":
          return a.username.localeCompare(b.username);
        default:
          return 0;
      }
    });
  };

  // Search handler
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  // Sort handler
  const handleSortChange = (newSortOrder: string) => {
    setSortOrder(newSortOrder);
  };

  // Filter moderators based on search and sort
  useEffect(() => {
    let filtered = moderators;

    if (searchTerm) {
      filtered = filtered.filter(
        (mod) =>
          mod.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mod.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    const sortedAndFiltered = applySorting(filtered, sortOrder);
    setFilteredModerators(sortedAndFiltered);
  }, [moderators, searchTerm, sortOrder]);

  const handleAddModerator = () => {
    setFormData({
      selectedAccount: null,
      permissions: [],
    });
    setEditingModerator(null);
    setSearchQuery("");
    setSearchResults([]);
    setIsAddModalOpen(true);
  };

  const handleEditModerator = (moderator: Moderator) => {
    setFormData({
      selectedAccount: { username: moderator.username, email: moderator.email },
      permissions: moderator.permissions || [], // Ensure permissions array is never undefined
    });
    setEditingModerator(moderator);
    setIsAddModalOpen(true);
  };

  // Professional copy function with enhanced error handling
  const handleCopy = createCopyHandler(toast);

  const handleSaveModerator = async () => {
    if (!formData.selectedAccount) return;

    if (editingModerator) {
      // Update existing moderator
      setModerators(
        moderators.map((mod) =>
          mod.id === editingModerator.id
            ? { ...mod, permissions: formData.permissions }
            : mod,
        ),
      );
      setIsAddModalOpen(false);

      try {
        const response = await api.moderators.updateModerator(
          serverId,
          editingModerator.id,
          formData.permissions,
        );

        if (response.success) {
          toast({
            title: "Moderator Updated",
            description: `Permissions updated for ${editingModerator.username}`,
          });
        } else {
          toast({
            title: "Moderator Update Failed",
            description:
              response.message ||
              response.error ||
              "Failed to update moderator",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Update Error",
          description: "An error occurred while updating the moderator",
          variant: "destructive",
        });
      } finally {
        //setIsUpdatingLoading(null);
      }
    } else {
      console.log("adding moderator");
      // Add new moderator and generate invite
      try {
        const response = await api.moderators.addModerator(
          serverId,
          formData.permissions,
          formData.selectedAccount.id,
        );

        if (response.success) {
          toast({
            title: "Moderator added!",
            description: `Successfuly moderator added`,
          });

          const inviteUrl = `${window.location.origin}/invite?token=${response.data.inviteToken}`;
          setInviteLink(inviteUrl);

          setIsAddModalOpen(false);
          setShowInviteDialog(true);
        } else {
          toast({
            title: "Moderator add Failed",
            description: response.message || "Failed to add moderator",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Add Error",
          description: "An error occurred while adding the moderator",
          variant: "destructive",
        });
        console.log(error);
      } finally {
        //setIsUpdatingLoading(null);
      }
    }
  };

  const handleSuspendModerator = async (id: string) => {
    if (confirmAction && confirmAction.id === id) {
      try {
        const response = await api.moderators.setModeratorAction(
          serverId,
          id,
          "suspend",
        );
        if (response.success) {
          toast({
            title: "Moderator Suspended",
            description: `Successfuly moderator suspended`,
          });
          setModerators(
            moderators.map((mod) =>
              mod.id === id
                ? {
                    ...mod,
                    status:
                      mod.status === "suspended"
                        ? "active"
                        : ("suspended" as any),
                  }
                : mod,
            ),
          );
        } else {
          toast({
            title: "Failed to suspend moderator!",
            description:
              response.message ||
              response.error ||
              "An error occurred while suspending moderator",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Failed to suspend moderator!",
          description: "An error occurred while suspending moderator",
          variant: "destructive",
        });
        console.error("Error suspending moderator:", error);
      }
      setConfirmAction(null);
    }
  };

  const handleRemoveModerator = async (id: string) => {
    if (confirmAction && confirmAction.id === id) {
      try {
        const response = await api.moderators.setModeratorAction(
          serverId,
          id,
          "remove",
        );

        if (response.success) {
          setModerators(moderators.filter((mod) => mod.id !== id));
          toast({
            title: "Moderator Removed",
            description: `Successfuly removed moderator`,
          });
        } else {
          toast({
            title: "Failed to remove moderator!",
            description:
              response.message ||
              response.error ||
              "An error occurred while removing moderator",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Failed to remove moderator!",
          description: "An error occurred while removing moderator",
          variant: "destructive",
        });
        console.error("Error removing moderator:", error);
      }
      setConfirmAction(null);
    }
  };

  const searchPlatformAccounts = async (query: string) => {
    setSearchQuery(query);

    if (query.length > 0) {
      const response = await api.moderators.searchForModerators(query);

      if (response.success && response.data) {
        // Assuming response.data contains the array of moderators
        setSearchResults(response.data || []);
      } else {
        setSearchResults([]);
        const errorMessage =
          response.message || response.error || "Failed to search moderators";
        console.error("Failed to search moderators:", errorMessage);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectAccount = (account: any) => {
    setFormData((prev) => ({ ...prev, selectedAccount: account }));
    setSearchQuery(account.username);
    setSearchResults([]);
  };

  const handleResendInvite = (moderator: Moderator) => {
    // Generate new invite link
    const inviteToken = "abc123def456_" + Date.now(); // In real app, this would be generated by API
    const inviteUrl = `${window.location.origin}/invite?token=${inviteToken}`;
    setInviteLink(inviteUrl);

    // Set selected account for email functionality
    setFormData((prev) => ({
      ...prev,
      selectedAccount: { username: moderator.username, email: moderator.email },
    }));

    setShowInviteDialog(true);
  };

  const applyPreset = (presetKey: string) => {
    const preset = rolePresets[presetKey as keyof typeof rolePresets];
    if (preset) {
      setFormData((prev) => ({ ...prev, permissions: preset.permissions }));
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  // Skeleton loading component for moderators table
  const ModeratorSkeleton = () => (
    <TableRow className="hover:bg-primary/5 transition-all duration-300 border-primary/10">
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );

  const retryFetch = async () => {
    setError(null);
    setIsLoading(true);

    if (!serverId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.moderators.getModerators(serverId);
      console.log(response);
      if (response.success && response.data) {
        const moderatorsData = (response.data.moderators || []).map(
          (moderator) => ({
            ...moderator,
            permissions: moderator.permissions || [],
          }),
        );
        setModerators(moderatorsData);
        const sortedModerators = applySorting(moderatorsData, sortOrder);
        setFilteredModerators(sortedModerators);
      } else {
        const errorMessage =
          response.message || response.error || "Failed to load moderators";
        setModerators([]);
        setFilteredModerators([]);
        setError(errorMessage);
      }
    } catch (err) {
      setModerators([]);
      setFilteredModerators([]);
      setError("Failed to load moderator data");
      console.error("Error fetching moderators:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex-1 overflow-y-auto relative">
        {/* Animated background */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.05)_25%,rgba(59,130,246,0.05)_26%,transparent_27%)] bg-[length:40px_40px] animate-pulse" />
        </div>

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 relative">
          {/* Show full-page error if there's an access error */}
          {error ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="max-w-md mx-auto">
                <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Cannot Access Moderators
                </h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={retryFetch} variant="outline">
                  Try again
                </Button>
              </div>
            </div>
          ) : (
            <>
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
                    <BreadcrumbPage>{t("moderators")}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Header */}
              <div
                className={getScrollAnimationClasses(
                  headerAnimation.isVisible,
                  "slide-in-bottom",
                  "700",
                  "200",
                )}
              >
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-2">
                    {t("moderators")}
                  </h1>
                  <p className="text-muted-foreground mt-2 text-lg">
                    Manage trusted accounts with access to this server
                  </p>
                </div>

                {/* Add Moderator Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddModerator}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Moderator
                  </Button>
                </div>
              </div>

              {/* Filters & Search */}
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
                        placeholder="Search for username or email..."
                        value={searchTerm}
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
                          {sortOrder === "name" && "Username"}
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
                        <DropdownMenuItem
                          onClick={() => handleSortChange("name")}
                        >
                          Username
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              {/* Moderators Table */}
              <Card
                ref={tableAnimation.elementRef}
                className={`
                bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10
                ${getScrollAnimationClasses(tableAnimation.isVisible, "slide-in-bottom", "700")}
              `}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Team Members
                    <Badge className="bg-primary/20 text-primary border-primary/30 ml-auto">
                      {filteredModerators.length} members
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    {isLoading ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-primary/20">
                            <TableHead className="min-w-[250px]">
                              Member
                            </TableHead>
                            <TableHead className="min-w-[200px] hidden lg:table-cell">
                              Permissions
                            </TableHead>
                            <TableHead className="min-w-[150px] hidden md:table-cell">
                              Last Login
                            </TableHead>
                            <TableHead className="min-w-[100px]">
                              Status
                            </TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <ModeratorSkeleton key={index} />
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-primary/20">
                            <TableHead className="min-w-[250px]">
                              Member
                            </TableHead>
                            <TableHead className="min-w-[200px] hidden lg:table-cell">
                              Permissions
                            </TableHead>
                            <TableHead className="min-w-[150px] hidden md:table-cell">
                              Last Login
                            </TableHead>
                            <TableHead className="min-w-[100px]">
                              Status
                            </TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredModerators.map((moderator, index) => {
                            const statusInfo = getStatusBadge(moderator.status);

                            return (
                              <ContextMenu key={moderator.id}>
                                <ContextMenuTrigger asChild>
                                  <TableRow
                                    className={`
                                    hover:bg-primary/5 transition-all duration-300 border-primary/10
                                    animate-in slide-in-from-bottom-2 fade-in-0 cursor-context-menu
                                  `}
                                    style={{
                                      animationDelay: `${index * 50}ms`,
                                    }}
                                  >
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                                          <AvatarImage src={moderator.avatar} />
                                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                                            {moderator.username
                                              .substring(0, 2)
                                              .toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">
                                            {moderator.username}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {moderator.email}
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {moderator.permissions
                                          .slice(0, 2)
                                          .map((permission) => (
                                            <Badge
                                              key={permission}
                                              variant="outline"
                                              className="text-xs bg-primary/10 border-primary/20"
                                            >
                                              {permission.replace("_", " ")}
                                            </Badge>
                                          ))}
                                        {moderator.permissions.length > 2 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-muted/50"
                                          >
                                            +{moderator.permissions.length - 2}{" "}
                                            more
                                          </Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {moderator.lastLogin === "Never"
                                          ? "Never"
                                          : new Date(
                                              moderator.lastLogin,
                                            ).toLocaleDateString()}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        className={`${statusInfo.color} border flex items-center gap-1 w-fit`}
                                      >
                                        {statusInfo.icon}
                                        {statusInfo.label}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-primary/10"
                                          >
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="end"
                                          className="bg-background/95 backdrop-blur-xl border-primary/20"
                                        >
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleEditModerator(moderator)
                                            }
                                            className="hover:bg-primary/10"
                                          >
                                            <Edit3 className="h-4 w-4 mr-2" />
                                            Edit Permissions
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="hover:bg-primary/10">
                                            <Activity className="h-4 w-4 mr-2" />
                                            View Activity
                                          </DropdownMenuItem>
                                          {moderator.status === "pending" && (
                                            <>
                                              <DropdownMenuSeparator className="bg-primary/20" />
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleResendInvite(moderator)
                                                }
                                                className="hover:bg-primary/10 text-primary"
                                              >
                                                <Mail className="h-4 w-4 mr-2" />
                                                Resend Invite
                                              </DropdownMenuItem>
                                            </>
                                          )}
                                          <DropdownMenuSeparator className="bg-primary/20" />
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setConfirmAction({
                                                type:
                                                  moderator.status ===
                                                  "suspended"
                                                    ? "reactivate"
                                                    : "suspend",
                                                id: moderator.id,
                                                username: moderator.username,
                                              })
                                            }
                                            className="hover:bg-yellow-500/10 text-yellow-400"
                                          >
                                            <Pause className="h-4 w-4 mr-2" />
                                            {moderator.status === "suspended"
                                              ? "Reactivate"
                                              : "Suspend"}
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setConfirmAction({
                                                type: "remove",
                                                id: moderator.id,
                                                username: moderator.username,
                                              })
                                            }
                                            className="hover:bg-red-500/10 text-red-400"
                                          >
                                            <UserX className="h-4 w-4 mr-2" />
                                            Remove
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                </ContextMenuTrigger>
                                <ContextMenuContent className="w-56">
                                  <ContextMenuItem
                                    onClick={() =>
                                      handleEditModerator(moderator)
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                    Edit Permissions
                                  </ContextMenuItem>
                                  <ContextMenuItem className="flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    View Activity
                                  </ContextMenuItem>
                                  {moderator.status === "pending" && (
                                    <ContextMenuItem
                                      onClick={() =>
                                        handleResendInvite(moderator)
                                      }
                                      className="flex items-center gap-2 text-primary focus:text-primary"
                                    >
                                      <Mail className="h-4 w-4" />
                                      Resend Invite
                                    </ContextMenuItem>
                                  )}
                                  <ContextMenuSeparator />
                                  <ContextMenuItem
                                    onClick={() =>
                                      handleCopy(moderator.username, "Username")
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    <Copy className="h-4 w-4" />
                                    Copy Username
                                  </ContextMenuItem>
                                  <ContextMenuItem
                                    onClick={() =>
                                      handleCopy(moderator.email, "Email")
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    <Copy className="h-4 w-4" />
                                    Copy Email
                                  </ContextMenuItem>
                                  <ContextMenuItem
                                    onClick={() =>
                                      handleCopy(moderator.id, "Moderator ID")
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    <Copy className="h-4 w-4" />
                                    Copy ID
                                  </ContextMenuItem>
                                </ContextMenuContent>
                              </ContextMenu>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Add/Edit Moderator Modal - Only show when not in error state */}
          {!error && (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-primary/20">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    {editingModerator ? "Edit Moderator" : "Add New Moderator"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingModerator
                      ? "Modify permissions and settings for this moderator."
                      : "Search for an existing platform account and configure their permissions."}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Account Search */}
                  <div className="space-y-2">
                    <Label htmlFor="account-search">
                      Search Platform Account
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="account-search"
                        value={searchQuery}
                        onChange={(e) => searchPlatformAccounts(e.target.value)}
                        placeholder="Search by username or email..."
                        className="pl-10 bg-background/50 border-primary/20"
                      />
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-xl border border-primary/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {searchResults.map((account) => (
                            <div
                              key={account.id}
                              onClick={() => selectAccount(account)}
                              className="p-3 hover:bg-primary/10 cursor-pointer border-b border-primary/10 last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={account.avatar} />
                                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                    {account.username
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">
                                    {account.username}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {account.email}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {formData.selectedAccount && (
                      <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-md">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={formData.selectedAccount.avatar}
                            />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {formData.selectedAccount.username
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {formData.selectedAccount.username}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formData.selectedAccount.email}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                selectedAccount: null,
                              }))
                            }
                            className="ml-auto text-muted-foreground hover:text-foreground"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Permission Presets */}
                  <div className="space-y-3">
                    <Label>Quick Presets</Label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(rolePresets).map(([key, preset]) => (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset(key)}
                          className="border-primary/20 hover:bg-primary/10"
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="space-y-4">
                    <Label>Permissions</Label>
                    <div className="space-y-4">
                      {permissionGroups.map((group) => (
                        <Card
                          key={group.id}
                          className="bg-background/30 border-primary/20"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-base">
                                  {group.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {group.description}
                                </p>
                              </div>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {group.description}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {group.permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/20"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-1 rounded bg-primary/20 text-primary">
                                    {permission.icon}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">
                                      {permission.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {permission.description}
                                    </div>
                                  </div>
                                </div>
                                <Switch
                                  checked={formData.permissions.includes(
                                    permission.id,
                                  )}
                                  onCheckedChange={() =>
                                    togglePermission(permission.id)
                                  }
                                />
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveModerator}
                    disabled={!formData.selectedAccount}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                  >
                    {editingModerator ? "Save Changes" : "Add Moderator"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Confirmation Dialog */}
          <AlertDialog
            open={!!confirmAction}
            onOpenChange={() => setConfirmAction(null)}
          >
            <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-primary/20">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  Confirm{" "}
                  {confirmAction?.type === "remove"
                    ? "Removal"
                    : confirmAction?.type === "suspend"
                      ? "Suspension"
                      : "Reactivation"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmAction?.type === "remove" && (
                    <>
                      Are you sure you want to remove{" "}
                      <strong>{confirmAction.username}</strong> from the
                      moderators team? This action cannot be undone and they
                      will lose all access immediately.
                    </>
                  )}
                  {confirmAction?.type === "suspend" && (
                    <>
                      Are you sure you want to suspend{" "}
                      <strong>{confirmAction.username}</strong>? They will lose
                      access to the dashboard until reactivated.
                    </>
                  )}
                  {confirmAction?.type === "reactivate" && (
                    <>
                      Are you sure you want to reactivate{" "}
                      <strong>{confirmAction.username}</strong>? They will
                      regain their previous access permissions.
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (confirmAction?.type === "remove") {
                      handleRemoveModerator(confirmAction.id);
                    } else {
                      handleSuspendModerator(confirmAction.id);
                    }
                  }}
                  className={`
                    ${
                      confirmAction?.type === "remove"
                        ? "bg-red-500 hover:bg-red-600"
                        : confirmAction?.type === "suspend"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                    } 
                    text-white
                  `}
                >
                  {confirmAction?.type === "remove"
                    ? "Remove"
                    : confirmAction?.type === "suspend"
                      ? "Suspend"
                      : "Reactivate"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Invite Link Dialog */}
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogContent className="max-w-lg bg-background/95 backdrop-blur-xl border-primary/20">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-primary" />
                  Invitation Sent
                </DialogTitle>
                <DialogDescription>
                  Share this invite link with the new moderator. They will need
                  to accept the invitation to gain access.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Invite Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={inviteLink || ""}
                      readOnly
                      className="bg-background/50 border-primary/20 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (inviteLink) {
                          try {
                            console.log(inviteLink);
                            handleCopy(inviteLink, "Invite Link");
                          } catch (err) {
                            // Fallback for older browsers
                            const textArea = document.createElement("textarea");
                            textArea.value = inviteLink;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand("copy");
                            document.body.removeChild(textArea);
                            alert("Invite link copied to clipboard!");
                          }
                        }
                      }}
                      className="border-primary/20 hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-400">Important</p>
                      <p className="text-yellow-400/80 mt-1">
                        This invite link will expire in 7 days. The moderator
                        will have "pending" status until they accept the
                        invitation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>
                    Consider sending this link directly to{" "}
                    {formData.selectedAccount?.email}
                  </span>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  onClick={() => setShowInviteDialog(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
}
