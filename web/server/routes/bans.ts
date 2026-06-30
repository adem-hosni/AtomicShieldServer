import { RequestHandler } from "express";
import {
  ApiResponse,
  BansResponse,
  BanRecord,
  SearchParams,
} from "@shared/api";

// Mock data for development - replace with actual database calls
const mockBans: BanRecord[] = [
  {
    id: "ban_001",
    steamId: "steam:110000103fa6c42",
    playerName: "John_Doe",
    reason: "Cheating with speed hacks",
    adminName: "Admin_Mike",
    bannedAt: "2024-01-15T14:30:00Z",
    expiresAt: null, // Permanent ban
    isActive: true,
    serverId: 1,
    evidence: ["screenshot_001.png", "video_001.mp4"],
    appealStatus: null,
    report: {
      "Report ID": "RPT-001",
      "Reported By": "PlayerWitness42",
      "Report Reason": "Suspicious movement speed and impossible acceleration",
      "Report Date": "2024-01-15T14:25:00Z",
      "Report Notes":
        "Player was moving at impossible speeds across the map. Witnessed teleporting and flying behavior that is clearly not normal gameplay.",
      "Screenshot URL":
        "https://evidence.example.com/reports/rpt-001-screenshot.png",
      Status: "reviewed",
    },
  },
  {
    id: "ban_002",
    steamId: "steam:110000103fa6c43",
    playerName: "BadPlayer123",
    reason: "Toxic behavior and harassment",
    adminName: "Admin_Sarah",
    bannedAt: "2024-01-14T16:45:00Z",
    expiresAt: "2024-01-21T16:45:00Z", // 7 day ban
    isActive: true,
    serverId: 1,
    evidence: ["chat_log_001.txt"],
    appealStatus: "pending",
    report: {
      "Report ID": "RPT-002",
      "Reported By": "CommunityModerator",
      "Report Reason": "Repeated harassment and discriminatory language",
      "Report Date": "2024-01-14T16:30:00Z",
      "Report Notes":
        "Player was targeting specific individuals with hate speech and threats. Chat logs show consistent pattern over multiple gaming sessions.",
      Status: "reviewed",
    },
  },
  {
    id: "ban_003",
    steamId: "steam:110000103fa6c44",
    playerName: "GrieferKid",
    reason: "Exploiting game mechanics",
    adminName: "Admin_Tom",
    bannedAt: "2024-01-13T20:15:00Z",
    expiresAt: "2024-01-20T20:15:00Z",
    isActive: true,
    serverId: 2,
    evidence: [],
    appealStatus: null,
  },
  {
    id: "ban_004",
    steamId: "steam:110000103fa6c45",
    playerName: "ReformedPlayer",
    reason: "RDM (Random Death Match)",
    adminName: "Admin_Lisa",
    bannedAt: "2024-01-10T10:00:00Z",
    expiresAt: "2024-01-12T10:00:00Z",
    isActive: false, // Ban expired
    serverId: 1,
    evidence: ["report_001.txt"],
    appealStatus: "approved",
  },
  // Generate additional mock data
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `ban_${String(i + 5).padStart(3, "0")}`,
    steamId: `steam:110000103fa6c${(50 + i).toString(16)}`,
    playerName: `Player${String(i + 5).padStart(3, "0")}`,
    reason: [
      "Cheating",
      "Exploiting",
      "Toxic behavior",
      "RDM",
      "VDM",
      "Metagaming",
      "Fail RP",
      "Combat logging",
    ][Math.floor(Math.random() * 8)],
    adminName: ["Admin_Mike", "Admin_Sarah", "Admin_Tom", "Admin_Lisa"][
      Math.floor(Math.random() * 4)
    ],
    bannedAt: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
    ).toISOString(),
    expiresAt:
      Math.random() > 0.3
        ? new Date(
            Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
          ).toISOString()
        : null,
    isActive: Math.random() > 0.2,
    serverId: Math.floor(Math.random() * 3) + 1,
    evidence: Math.random() > 0.5 ? [`evidence_${i + 5}.png`] : [],
    appealStatus:
      Math.random() > 0.7
        ? (["pending", "approved", "denied"][
            Math.floor(Math.random() * 3)
          ] as any)
        : null,
  })),
];

// Get all bans with pagination and filtering
export const getBans: RequestHandler = (req, res) => {
  try {
    const {
      page = "1",
      limit = "25",
      search = "",
      filter = "all",
      sortBy = "bannedAt",
      sortOrder = "desc",
    } = req.query as Partial<
      SearchParams & { filter: string; [key: string]: string }
    >;

    let filteredBans = [...mockBans];

    // Apply search filter
    if (search) {
      filteredBans = filteredBans.filter(
        (ban) =>
          ban.playerName.toLowerCase().includes(search.toLowerCase()) ||
          ban.steamId?.toLowerCase().includes(search.toLowerCase()) ||
          ban.reason.toLowerCase().includes(search.toLowerCase()) ||
          ban.adminName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Apply status filter
    if (filter === "active") {
      filteredBans = filteredBans.filter((ban) => ban.isActive);
    } else if (filter === "expired") {
      filteredBans = filteredBans.filter((ban) => !ban.isActive);
    } else if (filter === "permanent") {
      filteredBans = filteredBans.filter((ban) => ban.expiresAt === null);
    } else if (filter === "temporary") {
      filteredBans = filteredBans.filter((ban) => ban.expiresAt !== null);
    }

    // Apply sorting
    filteredBans.sort((a, b) => {
      let aValue: any = a[sortBy as keyof BanRecord];
      let bValue: any = b[sortBy as keyof BanRecord];

      if (sortBy === "bannedAt" || sortBy === "expiresAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
      }

      if (sortOrder === "desc") {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    // Apply pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedBans = filteredBans.slice(startIndex, endIndex);

    const response: ApiResponse<BansResponse> = {
      success: true,
      data: {
        bans: paginatedBans,
        totalCount: filteredBans.length,
        activeCount: mockBans.filter((ban) => ban.isActive).length,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch bans",
    };
    res.status(500).json(response);
  }
};

// Create a new ban
export const createBan: RequestHandler = (req, res) => {
  try {
    const banData = req.body;

    if (
      !banData.steamId ||
      !banData.playerName ||
      !banData.reason ||
      !banData.adminName
    ) {
      const response: ApiResponse = {
        success: false,
        error:
          "Required fields missing: steamId, playerName, reason, adminName",
      };
      return res.status(400).json(response);
    }

    // In a real implementation, you would:
    // 1. Validate the data
    // 2. Save to database
    // 3. Add to game server ban list
    // 4. Log the action in audit logs

    console.log("Creating new ban:", banData);

    const response: ApiResponse = {
      success: true,
      message: "Ban created successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create ban",
    };
    res.status(500).json(response);
  }
};

// Update an existing ban
export const updateBan: RequestHandler = (req, res) => {
  try {
    const { banId } = req.params;
    const updates = req.body;

    if (!banId) {
      const response: ApiResponse = {
        success: false,
        error: "Ban ID is required",
      };
      return res.status(400).json(response);
    }

    // In a real implementation, you would:
    // 1. Validate the ban exists
    // 2. Update in database
    // 3. Update game server ban list if needed
    // 4. Log the action in audit logs

    console.log(`Updating ban ${banId}:`, updates);

    const response: ApiResponse = {
      success: true,
      message: "Ban updated successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update ban",
    };
    res.status(500).json(response);
  }
};

// Delete a ban
export const deleteBan: RequestHandler = (req, res) => {
  try {
    const { banId } = req.params;

    if (!banId) {
      const response: ApiResponse = {
        success: false,
        error: "Ban ID is required",
      };
      return res.status(400).json(response);
    }

    // In a real implementation, you would:
    // 1. Validate the ban exists
    // 2. Remove from database
    // 3. Remove from game server ban list
    // 4. Log the action in audit logs

    console.log(`Deleting ban ${banId}`);

    const response: ApiResponse = {
      success: true,
      message: "Ban deleted successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete ban",
    };
    res.status(500).json(response);
  }
};

// Unban a player (remove active ban)
export const unbanPlayer: RequestHandler = (req, res) => {
  try {
    const { serverId, banId, playerId } = req.body;

    if (!serverId || !banId) {
      const response: ApiResponse = {
        success: false,
        error: "Server ID and Ban ID are required in request body",
      };
      return res.status(400).json(response);
    }

    if (!playerId) {
      const response: ApiResponse = {
        success: false,
        error: "Player ID is required in request body",
      };
      return res.status(400).json(response);
    }

    // Find the ban to validate it exists
    const banIndex = mockBans.findIndex(
      (ban) =>
        (ban.banId === banId || ban.id === banId) &&
        ban.serverId === parseInt(serverId) &&
        (ban.playerId === playerId || ban.steamId === playerId),
    );

    if (banIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Ban not found or player ID mismatch",
      };
      return res.status(404).json(response);
    }

    // In a real implementation, you would:
    // 1. Validate the ban exists and is active
    // 2. Update ban status in database (mark as unbanned)
    // 3. Remove from game server ban list
    // 4. Log the action in audit logs
    // 5. Send notification to relevant admins

    // For mock implementation, we'll mark the ban as inactive
    mockBans[banIndex].isActive = false;

    console.log(
      `Unbanning player ${playerId} - Ban ID: ${banId} on Server: ${serverId}`,
    );

    const response: ApiResponse = {
      success: true,
      message: `Player ${playerId} has been unbanned successfully`,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unban player",
    };
    res.status(500).json(response);
  }
};

// Report false positive for a ban
export const reportFalsePositive: RequestHandler = (req, res) => {
  try {
    const { serverId, banId } = req.params;
    const { reason } = req.body;

    if (!serverId || !banId) {
      const response: ApiResponse = {
        success: false,
        error: "Server ID and Ban ID are required",
      };
      return res.status(400).json(response);
    }

    if (!reason || !reason.trim()) {
      const response: ApiResponse = {
        success: false,
        error: "Reason is required for false positive report",
      };
      return res.status(400).json(response);
    }

    // Log the false positive report for processing
    console.log(
      `False positive report submitted for Ban ID: ${banId} on Server: ${serverId}`,
      {
        banId,
        serverId,
        reason: reason.trim(),
        timestamp: new Date().toISOString(),
      },
    );

    // In a real implementation, you would:
    // 1. Save the report to database
    // 2. Queue for manual review
    // 3. Send notification to administrators
    // 4. Update ban status if needed

    const response: ApiResponse = {
      success: true,
      message: `False positive report for Ban ID ${banId} has been submitted successfully`,
    };
    res.json(response);
  } catch (error) {
    console.error("False positive report error:", error);
    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to submit false positive report",
    };
    res.status(500).json(response);
  }
};
