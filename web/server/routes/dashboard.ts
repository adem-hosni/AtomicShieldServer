import { RequestHandler } from "express";
import {
  DashboardData,
  UserSubscription,
  ServerData,
  ActivityItem,
  ServerType,
  ThreatActivityDataPoint,
} from "@shared/api";

// Simulated database layer - in production, this would come from actual database queries
class DashboardDataService {
  private static instance: DashboardDataService;
  private lastUpdate: Date = new Date();
  private cachedData: Partial<DashboardData> | null = null;

  static getInstance(): DashboardDataService {
    if (!DashboardDataService.instance) {
      DashboardDataService.instance = new DashboardDataService();
    }
    return DashboardDataService.instance;
  }

  // Simulate real-time data generation based on current time
  private getTimeBasedVariance(): {
    playerCount: number;
    threats: number;
    bans: number;
  } {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Peak hours simulation (14:00-22:00)
    const isPeakHour = hour >= 14 && hour <= 22;
    const basePlayerMultiplier = isPeakHour ? 1.5 : 0.8;

    // Add some randomness but make it more realistic
    return {
      playerCount: Math.floor(
        (Math.sin(hour * 0.26) * 200 + 300) * basePlayerMultiplier +
          (Math.random() * 50 - 25),
      ),
      threats: Math.floor(Math.random() * 8) + (isPeakHour ? 3 : 1),
      bans: Math.floor(Math.random() * 15) + 5,
    };
  }

  // Get user subscriptions from database (simulated)
  async getUserSubscriptions(userId?: string): Promise<UserSubscription[]> {
    // In production, this would query the database for user's subscriptions
    return [
      {
        id: "premium-001",
        name: "AtomicShield Premium",
        plan: "Pro Shield",
        status: "active",
        period: 30,
        serversUsed: 2,
        serversLimit: 5,
      },
      {
        id: "enterprise-001",
        name: "AtomicShield Enterprise",
        plan: "Enterprise Shield",
        status: "active",
        period: 365,
        serversUsed: 1,
        serversLimit: 20,
      },
    ];
  }

  // Get active servers from database (simulated)
  async getActiveServers(): Promise<ServerData[]> {
    const variance = this.getTimeBasedVariance();

    // In production, this would query the database for user's servers
    return [
      {
        id: "server-2",
        name: "Development Server",
        description: "Testing environment",
        playerCount: Math.max(0, 89 + Math.floor(variance.playerCount * 0.1)),
        status: "TESTING",
        statusColor: "text-primary",
        imageUrl: "/placeholder.svg",
      },
      {
        id: "server-3",
        name: "Public Beta Server",
        description: "Community testing server",
        playerCount: Math.max(0, 156 + Math.floor(variance.playerCount * 0.2)),
        status: "ACTIVE",
        statusColor: "text-green-400",
        imageUrl: "/placeholder.svg",
      },
    ];
  }

  // Get recent security events from audit logs (simulated)
  async getRecentActivity(): Promise<ActivityItem[]> {
    const now = new Date();
    const activities: ActivityItem[] = [];

    // Generate recent activity based on current time
    const activityTypes = [
      { action: "Player Banned", severity: "critical", probability: 0.1 },
      { action: "Aimbot Detection", severity: "critical", probability: 0.05 },
      { action: "Speed Hack Detected", severity: "high", probability: 0.08 },
      { action: "Player Kicked", severity: "medium", probability: 0.15 },
      { action: "Config Updated", severity: "medium", probability: 0.05 },
      { action: "Admin Login", severity: "low", probability: 0.2 },
      { action: "Warning Issued", severity: "low", probability: 0.25 },
      {
        action: "Resource Injection Blocked",
        severity: "high",
        probability: 0.07,
      },
    ];

    const playerNames = [
      "xX_ProGamer_Xx",
      "NoobSlayer2024",
      "SpeedRacer99",
      "L33tHacker",
      "AdminJohn",
      "SuperAdmin",
      "TestPlayer",
      "RandomUser123",
      "CheatDetected",
      "SuspiciousPlayer",
      "NewbieGamer",
      "VeteranPlayer",
    ];

    // Generate 5-8 recent activities
    for (let i = 0; i < 5 + Math.floor(Math.random() * 4); i++) {
      const randomActivity =
        activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const randomPlayer =
        playerNames[Math.floor(Math.random() * playerNames.length)];
      const minutesAgo = Math.floor(Math.random() * 120) + 1; // 1-120 minutes ago

      activities.push({
        action: randomActivity.action,
        user: randomPlayer,
        time: `${minutesAgo}m ago`,
        severity: randomActivity.severity as
          | "low"
          | "medium"
          | "high"
          | "critical",
      });
    }

    // Sort by time (most recent first)
    return activities.sort((a, b) => {
      const aMinutes = parseInt(a.time);
      const bMinutes = parseInt(b.time);
      return aMinutes - bMinutes;
    });
  }

  // Get system statistics
  async getSystemStats() {
    const variance = this.getTimeBasedVariance();
    const servers = await this.getActiveServers();

    const totalServers = servers.length;
    const onlineServers = servers.filter((s) => s.status === "ACTIVE").length;
    const totalPlayers = servers.reduce(
      (sum, server) => sum + server.playerCount,
      0,
    );
    const threatLevel = Math.max(0, variance.threats);

    return {
      systemStatus: {
        value:
          onlineServers === totalServers
            ? 100
            : Math.floor((onlineServers / totalServers) * 100),
        badge: {
          text:
            onlineServers === totalServers
              ? "All Systems Operational"
              : "Some Issues",
          variant:
            onlineServers === totalServers
              ? "default"
              : ("destructive" as const),
        },
      },
      totalServers: {
        value: totalServers,
        subtitle: `${onlineServers} online, ${totalServers - onlineServers} maintenance`,
        trend: { value: "+1 this week", isPositive: true },
      },
      networkPlayers: {
        value: totalPlayers,
        subtitle: "Across all servers",
        trend: {
          value: `${variance.playerCount > 0 ? "+" : ""}${Math.floor(variance.playerCount / 10)} today`,
          isPositive: variance.playerCount > 0,
        },
      },
      threatLevel: {
        value: threatLevel,
        subtitle: "Active threats detected",
        badge: {
          text:
            threatLevel > 10
              ? "ELEVATED"
              : threatLevel > 5
                ? "MODERATE"
                : "LOW",
          variant:
            threatLevel > 10
              ? "destructive"
              : threatLevel > 5
                ? "secondary"
                : ("default" as const),
          pulse: threatLevel > 10,
        },
      },
    };
  }

  // Get threat assessment metrics
  async getThreatAssessment() {
    const variance = this.getTimeBasedVariance();

    // More realistic threat assessment metrics
    const detectionRate = 98.5 + Math.random() * 1.4; // 98.5-99.9%
    const falsePositiveRate = 0.01 + Math.random() * 0.09; // 0.01-0.1%
    const responseTime = 8 + Math.floor(Math.random() * 15); // 8-23ms

    return {
      detectionRate: `${detectionRate.toFixed(1)}%`,
      falsePositives: `${falsePositiveRate.toFixed(2)}%`,
      responseTime: `${responseTime}ms`,
    };
  }

  // Get global statistics for last 24 hours
  async getGlobalStats() {
    const variance = this.getTimeBasedVariance();
    const hour = new Date().getHours();

    // More realistic daily statistics based on server activity
    const baseStats = {
      totalBans24h: 45 + variance.bans + Math.floor(hour * 1.2),
      kicks24h: 120 + Math.floor(variance.bans * 2.5) + Math.floor(hour * 2.8),
      warnings24h: 280 + Math.floor(variance.bans * 4) + Math.floor(hour * 5.2),
      cleanSessions:
        12500 + Math.floor(variance.playerCount * 50) + Math.floor(hour * 120),
    };

    return baseStats;
  }

  // Get threat activity data for the last 24 hours
  async getThreatActivity() {
    const now = new Date();
    const currentHour = now.getHours();

    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const isPeakHour = hour >= 14 && hour <= 22;
      const isCurrentOrPast = hour <= currentHour;

      if (!isCurrentOrPast) {
        return {
          time: `${hour.toString().padStart(2, "0")}:00`,
          threatDetections: 0,
          falsePositives: 0,
          blockedAttempts: 0,
          severity: "low" as const,
        };
      }

      const baseDetections = isPeakHour ? 15 : 8;
      const detections = baseDetections + Math.floor(Math.random() * 10);
      const blocked = detections + Math.floor(Math.random() * 5);
      const falsePos = Math.floor(Math.random() * 2);

      return {
        time: `${hour.toString().padStart(2, "0")}:00`,
        threatDetections: detections,
        falsePositives: falsePos,
        blockedAttempts: blocked,
        severity: (detections > 20
          ? "critical"
          : detections > 15
            ? "high"
            : detections > 10
              ? "medium"
              : "low") as "low" | "medium" | "high" | "critical",
      };
    });
  }

  // Get available server types
  async getServerTypes(): Promise<ServerType[]> {
    return [
      {
        id: "fivem",
        name: "FiveM Server",
        description: "GTA V multiplayer modification",
      },
      {
        id: "minecraft",
        name: "Minecraft Server",
        description: "Minecraft multiplayer server",
      },
      {
        id: "rust",
        name: "Rust Server",
        description: "Rust multiplayer survival",
      },
      {
        id: "csgo",
        name: "CS:GO Server",
        description: "Counter-Strike: Global Offensive",
      },
      {
        id: "tf2",
        name: "Team Fortress 2",
        description: "Team-based multiplayer FPS",
      },
    ];
  }

  // Main method to get all dashboard data
  async getDashboardData(userId?: string): Promise<DashboardData> {
    try {
      // Run all data fetching operations in parallel for better performance
      const [
        subscriptions,
        servers,
        recentActivity,
        stats,
        threatAssessment,
        threatActivity,
        globalStats,
        serverTypes,
      ] = await Promise.all([
        this.getUserSubscriptions(userId),
        this.getActiveServers(),
        this.getRecentActivity(),
        this.getSystemStats(),
        this.getThreatAssessment(),
        this.getThreatActivity(),
        this.getGlobalStats(),
        this.getServerTypes(),
      ]);

      const dashboardData: DashboardData = {
        stats,
        servers,
        recentActivity,
        threatAssessment,
        threatActivity,
        globalStats,
        subscriptions,
        serverTypes,
      };

      // Cache the data for 30 seconds to improve performance
      this.cachedData = dashboardData;
      this.lastUpdate = new Date();

      return dashboardData;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw new Error("Failed to fetch dashboard data");
    }
  }
}

export const getDashboardOverview: RequestHandler = async (req, res) => {
  try {
    console.log(
      "Dashboard overview requested by user:",
      req.user?.email || "anonymous",
    );

    // Get user ID from authenticated request
    const userId = req.user?.userId;

    // Use service to get dashboard data
    const dashboardService = DashboardDataService.getInstance();
    const dashboardData = await dashboardService.getDashboardData(userId);

    console.log("Dashboard data successfully generated:", {
      serverCount: dashboardData.servers.length,
      activityCount: dashboardData.recentActivity.length,
      subscriptionCount: dashboardData.subscriptions.length,
    });

    res.json({
      success: true,
      data: dashboardData,
      message: "Dashboard overview data retrieved successfully",
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load dashboard data",
    });
  }
};
