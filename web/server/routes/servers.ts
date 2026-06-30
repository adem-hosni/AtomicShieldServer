import { RequestHandler } from "express";
import { ApiResponse } from "@shared/api";

interface AddServerRequest {
  serverName: string;
  serverIp: string;
  subscriptionId: string;
  serverType: string;
  serverImage?: string; // Base64 encoded image or URL
}

interface ServerResponse {
  id: string | number;
  name: string;
  ip: string;
  subscriptionId: string;
  serverType: string;
  status: "active" | "pending" | "inactive";
  createdAt: string;
  imageUrl?: string;
}

export const addServer: RequestHandler = async (req, res) => {
  try {
    console.log("[API] Adding new server:", req.body);

    const {
      serverName,
      serverIp,
      subscriptionId,
      serverType,
      serverImage,
    }: AddServerRequest = req.body;

    // Validate required fields
    if (!serverName || !serverIp || !subscriptionId || !serverType) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: serverName, serverIp, subscriptionId, serverType",
      } as ApiResponse);
    }

    // Validate server name length
    if (serverName.length > 64) {
      return res.status(400).json({
        success: false,
        error: "Server name must be 64 characters or less",
      } as ApiResponse);
    }

    // Validate IP address format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipParts = serverIp.split(".");
    const isValidFormat = ipRegex.test(serverIp);
    const isValidRange = ipParts.every((part) => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });

    if (!isValidFormat || !isValidRange) {
      return res.status(400).json({
        success: false,
        error: "Invalid IP address format",
      } as ApiResponse);
    }

    // Check if server IP already exists (simulate database check)
    // In a real implementation, you would check against your database
    const existingServers = ["192.168.1.100", "10.0.0.50"]; // Mock existing IPs
    if (existingServers.includes(serverIp)) {
      return res.status(409).json({
        success: false,
        error: "A server with this IP address already exists",
      } as ApiResponse);
    }

    // Simulate creating server in database
    const newServer: ServerResponse = {
      id: `srv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: serverName,
      ip: serverIp,
      subscriptionId,
      serverType,
      status: "pending",
      createdAt: new Date().toISOString(),
      imageUrl: serverImage
        ? `/uploads/server-images/${Date.now()}.jpg`
        : undefined,
    };

    // In a real implementation, you would:
    // 1. Save to database
    // 2. Validate subscription plan exists and has available slots
    // 3. Set up monitoring for the server
    // 4. Send welcome email or notification
    // 5. Initialize server configuration

    console.log("[API] Server created successfully:", newServer);

    res.status(201).json({
      success: true,
      data: newServer,
      message: "Server added successfully and is being configured",
    } as ApiResponse<ServerResponse>);
  } catch (error) {
    console.error("[API] Error adding server:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } as ApiResponse);
  }
};

export const getServers: RequestHandler = async (req, res) => {
  try {
    console.log("[API] Fetching servers for user");

    // Mock server data with enhanced status information
    const servers: (ServerResponse & {
      statusColor?: string;
      description?: string;
      playerCount?: number;
    })[] = [
      {
        id: "srv_002",
        name: "Test Server",
        ip: "10.0.0.50",
        subscriptionId: "enterprise-001",
        serverType: "minecraft",
        status: "ACTIVE",
        createdAt: "2024-01-20T14:15:00Z",
        imageUrl: "/placeholder.svg",
        statusColor: "text-green-400",
        description: "Development and testing environment",
        playerCount: 89,
      },
    ];

    res.json({
      success: true,
      data: { servers, totalCount: servers.length },
      message: "Servers retrieved successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("[API] Error fetching servers:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } as ApiResponse);
  }
};

export const deleteServer: RequestHandler = async (req, res) => {
  try {
    const { serverId } = req.params;

    console.log("[API] Deleting server:", serverId);

    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: "Server ID is required",
      } as ApiResponse);
    }

    // In a real implementation, you would:
    // 1. Verify the server belongs to the authenticated user
    // 2. Check if server has active bans/data that need to be handled
    // 3. Remove server from database
    // 4. Clean up associated monitoring/configuration
    // 5. Update subscription slot usage

    res.json({
      success: true,
      message: "Server deleted successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("[API] Error deleting server:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } as ApiResponse);
  }
};

export const getServerBans: RequestHandler = async (req, res) => {
  try {
    const { serverId } = req.params;

    console.log("[API] Getting server bans for:", serverId);

    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: "Server ID is required",
      } as ApiResponse);
    }

    // Mock ban data for the specific server
    const mockBans = [
      {
        id: "ban_001",
        playerId: "76561198054183704",
        playerName: "Leanor Clarise Morgan",
        banId: "#67854",
        reason: "Modding (VI)",
        evidence: false,
        status: "Permanent",
        bannedAt: "Jun 10, 2025",
        firstJoin: "Jun 11, 2025",
        adminName: "AdminJohn",
        serverName: "Test Server",
        totalPlaytime: "125h",
        evidenceUrl: "/evidence/ban_001_screenshot.png",
      },
      {
        id: "ban_002",
        playerId: "76561198054183705",
        playerName: "LUNAR + Jay Fernandez",
        banId: "#67843",
        reason: "Modding (VI)",
        evidence: false,
        status: "Permanent",
        bannedAt: "Jun 10, 2025",
        firstJoin: "Jun 18, 2025",
        adminName: "ModSarah",
        serverName: "Test Server",
        totalPlaytime: "87h",
        evidenceUrl: null,
      },
      {
        id: "ban_003",
        playerId: "76561198054183706",
        playerName: "CDM || Paulo Alvez",
        banId: "#55355",
        reason: "Aimbot Detection",
        evidence: true,
        status: "Permanent",
        bannedAt: "Jun 9, 2025",
        firstJoin: "Jun 18, 2025",
        adminName: "System",
        serverName: "Test Server",
        totalPlaytime: "201h",
        evidenceUrl: "/evidence/ban_003_screenshot.png",
      },
      {
        id: "ban_004",
        playerId: "76561198054183707",
        playerName: "joshu2437",
        banId: "#55142",
        reason: "Speed Hacking",
        evidence: true,
        status: "Temporary",
        bannedAt: "Jun 8, 2025",
        firstJoin: "Jun 10, 2025",
        adminName: "AdminMike",
        serverName: "Test Server",
        totalPlaytime: "45h",
        evidenceUrl: null,
        unbannedAt: "Jun 15, 2025",
        duration: "7 days",
      },
      // Generate additional mock data
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `ban_${String(i + 5).padStart(3, "0")}`,
        playerId: `7656119805418${3712 + i}`,
        playerName: `Player${String(i + 5).padStart(3, "0")}`,
        banId: `#${Math.floor(Math.random() * 90000) + 10000}`,
        reason: [
          "Modding (VI)",
          "Aimbot Detection",
          "ESP/Wallhack",
          "Speed Hacking",
          "Teleportation",
          "God Mode",
          "Illegal Resource Usage",
          "Server Event Abuse",
          "Exploit Usage",
          "Griefing",
        ][Math.floor(Math.random() * 10)],
        evidence: Math.random() > 0.6,
        status: Math.random() > 0.8 ? "Temporary" : "Permanent",
        bannedAt: new Date(
          Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
        ).toLocaleDateString(),
        firstJoin: new Date(
          Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000),
        ).toLocaleDateString(),
        adminName: ["AdminJohn", "ModSarah", "System", "AdminMike"][
          Math.floor(Math.random() * 4)
        ],
        serverName: "Test Server",
        totalPlaytime: `${Math.floor(Math.random() * 500) + 10}h`,
        evidenceUrl:
          Math.random() > 0.6
            ? `/evidence/ban_${String(i + 5).padStart(3, "0")}_screenshot.png`
            : null,
      })),
    ];

    console.log(`[API] Server bans retrieved successfully for: ${serverId}`);

    res.json({
      success: true,
      data: {
        bans: mockBans,
        totalCount: mockBans.length,
        serverId: serverId,
      },
      message: "Server bans retrieved successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("[API] Error getting server bans:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } as ApiResponse);
  }
};

export const getServerDashboard: RequestHandler = async (req, res) => {
  try {
    const { serverId } = req.params;

    console.log("[API] Getting server dashboard data for:", serverId);
    console.log("[API] Request headers:", req.headers);
    console.log("[API] Request params:", req.params);

    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: "Server ID is required",
      } as ApiResponse);
    }

    // In a real implementation, you would:
    // 1. Verify the server belongs to the authenticated user
    // 2. Fetch real-time server data from the game server
    // 3. Get performance metrics from monitoring systems
    // 4. Query database for activity logs and statistics
    // 5. Aggregate security events and detections

    // In a real implementation, you would fetch the server info from database
    // For now, get the server info from the mock servers data
    const mockServers = [
      {
        id: "srv_002",
        name: "Test Server",
        ip: "10.0.0.50",
        subscriptionId: "enterprise-001",
        serverType: "minecraft",
        status: "ACTIVE",
        createdAt: "2024-01-20T14:15:00Z",
        imageUrl:
          "https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=800",
      },
    ];

    const serverInfo = mockServers.find((server) => server.id === serverId);

    if (!serverInfo) {
      return res.status(404).json({
        success: false,
        error: "Server not found",
      } as ApiResponse);
    }

    // Calculate license expiration (mock data)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 18); // 18 days from now
    const daysUntilExpiration = Math.ceil(
      (expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );

    // Mock server dashboard data with real server info
    const dashboardData = {
      serverInfo: {
        id: serverId,
        name: serverInfo.name,
        description: "Main FiveM server for testing and development",
        status:
          serverInfo.status === "ACTIVE" || serverInfo.status === "active"
            ? "ACTIVE"
            : serverInfo.status === "pending"
              ? "TESTING"
              : "OFFLINE",
        ip: serverInfo.ip,
        imageUrl: serverInfo.imageUrl,
        playerCount: 42,
        maxPlayers: 64,
        uptime: 86400, // 24 hours in seconds
        licenseKey: `AS-${serverId}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        licenseExpiration: new Date(
          Date.now() + 18 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 18 days from now
        licenseExpirationDays: 18,
      },
      stats: {
        currentPlayers: {
          value: 42,
          trend: { value: "+12%", isPositive: true },
        },
        peakPlayers: {
          value: 58,
          period: "Today",
        },
        totalBans: {
          value: 127,
          trend: { value: "+3", isPositive: false },
        },
      },
      license: {
        key: `AS-${serverId.toUpperCase()}-FK9X-7H2M-QW8R-N4P3`,
        expirationDate: expirationDate.toISOString(),
        daysUntilExpiration: daysUntilExpiration,
        status: daysUntilExpiration <= 7 ? "EXPIRING_SOON" : "ACTIVE",
      },
    };

    console.log(
      "[API] Server dashboard data retrieved successfully for:",
      serverId,
    );

    res.json({
      success: true,
      data: dashboardData,
      message: "Server dashboard data retrieved successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("[API] Error getting server dashboard:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } as ApiResponse);
  }
};

export const getServerConfigurations: RequestHandler = async (req, res) => {
  try {
    const { serverId } = req.params;

    console.log("[API] Getting server configurations for:", serverId);

    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: "Server ID is required",
      } as ApiResponse);
    }

    // Mock configuration data based on the expected format
    const configurationsData = {
      categories: [
        {
          id: "general_settings",
          title: "General Settings",
          sections: [
            {
              id: "system_behavior",
              title: "System Behavior",
              subtitle: "Configure how AtomicShield operates",
              icon: "settings",
              configurations: [
                {
                  id: "screenshot_on_ban",
                  type: "boolean",
                  title: "Enable Screenshot on Ban",
                  subtitle:
                    "Take a screenshot when a player is banned for evidence",
                  tip: "",
                  icon: "camera",
                  value: true,
                },
              ],
            },
            {
              id: "server_info",
              title: "Server Information",
              subtitle: "Basic server configuration and identity",
              icon: "server",
              configurations: [
                {
                  id: "server_name",
                  type: "string",
                  title: "Server Name",
                  subtitle:
                    "Display name for your server in logs and notifications",
                  tip: "This name will appear in Discord embeds and log messages",
                  icon: "type",
                  value: "FiveCity RP Demo Server",
                },
                {
                  id: "webhook_url",
                  type: "string",
                  title: "Discord Webhook URL",
                  subtitle: "All logs and events will be sent to this webhook",
                  tip: "Create a webhook in your Discord channel settings",
                  icon: "link",
                  value:
                    "https://discord.com/api/webhooks/1234567890/abcdef...",
                },
              ],
            },
          ],
        },
        {
          id: "detection_settings",
          title: "Detection Settings",
          sections: [
            {
              id: "memory_scanner",
              title: "Memory Scanner",
              subtitle: "Adjust behavior of memory-based cheat detection",
              icon: "scan",
              configurations: [
                {
                  id: "scan_interval",
                  type: "number",
                  title: "Scan Interval",
                  subtitle: "How frequently the memory scanner runs (ms)",
                  tip: "Lower values may impact performance",
                  icon: "clock",
                  value: 1000,
                },
                {
                  id: "memory_scanning",
                  type: "boolean",
                  title: "Memory Scanning Detection",
                  subtitle: "Log when memory scanning tools are detected",
                  tip: "",
                  icon: "search",
                  value: true,
                },
              ],
            },
            {
              id: "process_detection",
              title: "Process Detection",
              subtitle: "Monitor and detect malicious processes",
              icon: "cpu",
              configurations: [
                {
                  id: "process_injection",
                  type: "boolean",
                  title: "Process Injection Detection",
                  subtitle: "Log when process injection attempts are detected",
                  tip: "",
                  icon: "zap",
                  value: true,
                },
                {
                  id: "blacklisted_dll",
                  type: "boolean",
                  title: "Blacklisted DLL Detection",
                  subtitle: "Log when blacklisted DLLs are detected",
                  tip: "",
                  icon: "shield",
                  value: true,
                },
                {
                  id: "speed_hacks",
                  type: "boolean",
                  title: "Speed Hack Detection",
                  subtitle: "Log when speed modifications are detected",
                  tip: "",
                  icon: "zap",
                  value: true,
                },
              ],
            },
          ],
        },
        {
          id: "punishment_settings",
          title: "Punishment Settings",
          sections: [
            {
              id: "punishment_events",
              title: "Punishment Events",
              subtitle: "Choose which punishment actions to log",
              icon: "gavel",
              configurations: [
                {
                  id: "log_bans",
                  type: "boolean",
                  title: "Log Player Bans",
                  subtitle: "Record all player ban events",
                  tip: "",
                  icon: "user-x",
                  value: true,
                },
                {
                  id: "log_kicks",
                  type: "boolean",
                  title: "Log Player Kicks",
                  subtitle: "Record all player kick events",
                  tip: "",
                  icon: "user-minus",
                  value: true,
                },
                {
                  id: "log_jails",
                  type: "boolean",
                  title: "Log Jail Actions",
                  subtitle: "Record when players are jailed",
                  tip: "",
                  icon: "lock",
                  value: false,
                },
              ],
            },
          ],
        },
        {
          id: "admin_settings",
          title: "Admin Settings",
          sections: [
            {
              id: "admin_actions",
              title: "Admin Actions",
              subtitle: "Log administrative activities and changes",
              icon: "users",
              configurations: [
                {
                  id: "log_config_changes",
                  type: "boolean",
                  title: "Log Configuration Changes",
                  subtitle: "Record when configuration settings are modified",
                  tip: "",
                  icon: "settings",
                  value: true,
                },
                {
                  id: "log_login_attempts",
                  type: "boolean",
                  title: "Log Login Attempts",
                  subtitle: "Record all admin login attempts",
                  tip: "",
                  icon: "log-in",
                  value: true,
                },
                {
                  id: "log_ip_changes",
                  type: "boolean",
                  title: "Log IP Address Changes",
                  subtitle: "Record when admin IP addresses change",
                  tip: "",
                  icon: "globe",
                  value: false,
                },
                {
                  id: "log_whitelist_edits",
                  type: "boolean",
                  title: "Log Whitelist Edits",
                  subtitle: "Record changes to player whitelists",
                  tip: "",
                  icon: "check-circle",
                  value: true,
                },
              ],
            },
          ],
        },
      ],
    };

    console.log(
      `[API] Server configurations retrieved successfully for: ${serverId}`,
    );

    res.json({
      success: true,
      data: configurationsData,
      message: "Server configurations retrieved successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("[API] Error getting server configurations:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    } as ApiResponse);
  }
};
