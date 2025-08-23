import { RequestHandler } from "express";
import {
  ApiResponse,
  PlayersResponse,
  PlayerRecord,
  PlayerActionRequest,
  SearchParams,
} from "@shared/api";

// Mock data for development - replace with actual database calls
const mockPlayers: PlayerRecord[] = [
  {
    id: "1",
    serverId: 1,
    name: "John_Doe",
    steamId: "steam:110000103fa6c42",
    discordId: "285478945623237632",
    license: "license:d4c94c6e8e1a8b2c3d4e5f6a7b8c9d0e",
    ip: "192.168.1.100",
    ping: 45,
    joinedAt: "2024-01-15T10:30:00Z",
    lastSeen: "2024-01-15T18:45:00Z",
    playtime: 1250,
    isOnline: true,
    position: { x: 1234.5, y: -567.8, z: 45.2 },
    vehicle: "Adder",
    job: "Police Officer",
    money: 125000,
  },
  {
    id: "2",
    serverId: 2,
    name: "Sarah_Wilson",
    steamId: "steam:110000103fa6c43",
    discordId: null,
    license: "license:e5d95d7f9f2b9c3e4f5a6b7c8d9e0f1a",
    ip: "192.168.1.101",
    ping: 32,
    joinedAt: "2024-01-10T14:20:00Z",
    lastSeen: "2024-01-15T19:15:00Z",
    playtime: 2100,
    isOnline: true,
    position: { x: -1045.2, y: 892.1, z: 67.8 },
    vehicle: "Zentorno",
    job: "Mechanic",
    money: 85000,
  },
  // Generate additional mock data
  ...Array.from({ length: 48 }, (_, i) => ({
    id: `${i + 3}`,
    serverId: i + 3,
    name: `Player${String(i + 3).padStart(3, "0")}`,
    steamId:
      Math.random() > 0.2
        ? `steam:110000103fa6c${(45 + i).toString(16)}`
        : undefined,
    discordId: Math.random() > 0.3 ? `${685478945623237635 + i}` : undefined,
    license:
      Math.random() > 0.1
        ? `license:${Math.random().toString(36).substring(2, 34)}`
        : undefined,
    ip: Math.random() > 0.15 ? `192.168.1.${104 + (i % 150)}` : undefined,
    ping: Math.floor(Math.random() * 200) + 15,
    joinedAt: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
    ).toISOString(),
    lastSeen: new Date().toISOString(),
    playtime: Math.floor(Math.random() * 10000),
    isOnline: true,
    position: {
      x: Math.floor(Math.random() * 4000) - 2000,
      y: Math.floor(Math.random() * 4000) - 2000,
      z: Math.floor(Math.random() * 200),
    },
    vehicle:
      Math.random() > 0.4
        ? [
            "Adder",
            "Zentorno",
            "Banshee",
            "T20",
            "Osiris",
            "Turismo",
            "Infernus",
            "Cheetah",
          ][Math.floor(Math.random() * 8)]
        : undefined,
    job: [
      "Police Officer",
      "Mechanic",
      "Doctor",
      "Civilian",
      "Business Owner",
      "Taxi Driver",
    ][Math.floor(Math.random() * 6)],
    money: Math.floor(Math.random() * 1000000),
  })),
];

// Get all players with pagination and filtering
export const getPlayers: RequestHandler = (req, res) => {
  try {
    const {
      page = "1",
      limit = "25",
      search = "",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query as Partial<SearchParams & { [key: string]: string }>;

    let filteredPlayers = [...mockPlayers];

    // Apply search filter
    if (search) {
      filteredPlayers = filteredPlayers.filter(
        (player) =>
          player.name.toLowerCase().includes(search.toLowerCase()) ||
          player.steamId?.toLowerCase().includes(search.toLowerCase()) ||
          player.discordId?.includes(search) ||
          player.ip?.includes(search),
      );
    }

    // Apply sorting
    filteredPlayers.sort((a, b) => {
      let aValue: any = a[sortBy as keyof PlayerRecord];
      let bValue: any = b[sortBy as keyof PlayerRecord];

      if (sortBy === "ping" || sortBy === "playtime" || sortBy === "serverId") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === "joinedAt") {
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
    const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

    // Mock actions taken data
    const mockActionsTaken = {
      "Player Banned": Math.floor(Math.random() * 5),
      "Player Kicked": Math.floor(Math.random() * 10) + 1,
      "Warning Issued": Math.floor(Math.random() * 8) + 1,
      "Cheat Detected": Math.floor(Math.random() * 6),
      "Player Unbanned": Math.floor(Math.random() * 3),
      "Screenshot Taken": Math.floor(Math.random() * 15) + 5,
    };

    const response: ApiResponse<PlayersResponse> = {
      success: true,
      data: {
        players: paginatedPlayers,
        totalCount: filteredPlayers.length,
        onlineCount: filteredPlayers.filter((p) => p.isOnline).length,
        peakPlayers: Math.max(
          filteredPlayers.length + Math.floor(Math.random() * 20),
          filteredPlayers.filter((p) => p.isOnline).length,
        ),
        newPlayers: Math.floor(Math.random() * 8),
        actionsTaken: mockActionsTaken,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch players",
    };
    res.status(500).json(response);
  }
};

// Kick a player
export const kickPlayer: RequestHandler = (req, res) => {
  try {
    const { playerId, reason }: PlayerActionRequest = req.body;

    if (!playerId || !reason) {
      const response: ApiResponse = {
        success: false,
        error: "Player ID and reason are required",
      };
      return res.status(400).json(response);
    }

    // In a real implementation, you would:
    // 1. Validate the player exists
    // 2. Send kick command to the game server
    // 3. Log the action in audit logs
    // 4. Remove player from online list

    console.log(`Kicking player ${playerId} for reason: ${reason}`);

    const response: ApiResponse = {
      success: true,
      message: "Player kicked successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to kick player",
    };
    res.status(500).json(response);
  }
};

// Ban a player
export const banPlayer: RequestHandler = (req, res) => {
  try {
    const { playerId, reason, duration }: PlayerActionRequest = req.body;

    if (!playerId || !reason) {
      const response: ApiResponse = {
        success: false,
        error: "Player ID and reason are required",
      };
      return res.status(400).json(response);
    }

    // In a real implementation, you would:
    // 1. Validate the player exists
    // 2. Add ban to database
    // 3. Send ban command to game server
    // 4. Log the action in audit logs
    // 5. Remove player from online list

    console.log(
      `Banning player ${playerId} for reason: ${reason}, duration: ${duration}`,
    );

    const response: ApiResponse = {
      success: true,
      message: "Player banned successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to ban player",
    };
    res.status(500).json(response);
  }
};

// Take player screenshot
export const takeScreenshot: RequestHandler = (req, res) => {
  try {
    const { playerId } = req.params;

    if (!playerId) {
      const response: ApiResponse = {
        success: false,
        error: "Player ID is required",
      };
      return res.status(400).json(response);
    }

    // In a real implementation, you would:
    // 1. Validate the player exists and is online
    // 2. Send screenshot command to game server
    // 3. Wait for screenshot response
    // 4. Store screenshot temporarily
    // 5. Return screenshot URL

    // Mock screenshot URL (50% chance of actual screenshot vs default)
    const hasActualScreenshot = Math.random() > 0.5;
    const screenshotUrl = hasActualScreenshot
      ? `https://picsum.photos/1920/1080?random=${playerId}`
      : `/api/players/${playerId}/screenshot/default`;

    console.log(`Taking screenshot for player ${playerId}`);

    const response: ApiResponse<{ url: string }> = {
      success: true,
      data: { url: screenshotUrl },
      message: "Screenshot captured successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to take screenshot",
    };
    res.status(500).json(response);
  }
};

// Get player statistics
export const getPlayerStats: RequestHandler = (req, res) => {
  try {
    // Mock player activity data
    const playerStatsData = [
      { time: "00:00", players: 18 },
      { time: "02:00", players: 15 },
      { time: "04:00", players: 12 },
      { time: "06:00", players: 25 },
      { time: "08:00", players: 42 },
      { time: "10:00", players: 68 },
      { time: "12:00", players: 95 },
      { time: "14:00", players: 115 },
      { time: "16:00", players: 132 },
      { time: "18:00", players: 145 },
      { time: "20:00", players: 150 },
      { time: "22:00", players: 140 },
    ];

    const response: ApiResponse = {
      success: true,
      data: playerStatsData,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch player stats",
    };
    res.status(500).json(response);
  }
};
