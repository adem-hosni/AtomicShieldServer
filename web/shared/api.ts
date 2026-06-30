/**
 * Shared code between client and server
 * API types and interfaces for the AtomicShield dashboard
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Base API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Authentication Types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  provider: "email" | "discord" | "google";
  createdAt: string;
  lastLogin?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    expiresIn: string;
  };
  errors?: Array<{
    path: string[];
    message: string;
  }>;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Player Management Types
 */
export interface PlayerRecord {
  id: string;
  serverId: number;
  name: string;
  steamId?: string;
  discordId?: string;
  license?: string;
  ip?: string;
  ping: number;
  joinedAt: string;
  lastSeen: string;
  playtime: number;
  isOnline: boolean;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  vehicle?: string;
  job?: string;
  money?: number;
}

export interface PlayersResponse {
  players: PlayerRecord[];
  totalCount: number;
  onlineCount: number;
  peakPlayers: number;
  newPlayers: number;
  actionsTaken: Record<string, number>;
}

export interface PlayerStatsData {
  time: string;
  players: number;
}

export interface PlayerActionRequest {
  playerId: string;
  reason: string;
  duration?: string;
}

export interface BansResponse {
  bans: BanRecord[];
  totalCount: number;
  activeCount: number;
}

/**
 * Audit Logs Types
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  target?: string;
  details: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "player" | "server" | "security" | "system" | "moderation";
  serverId?: number;
  ipAddress: string;
  serverName: string;
}

export interface AuditLogsResponse {
  logs: AuditLogEntry[];
  activeModerators: string;
  totalCount: number;
}

/**
 * Moderator Management Types
 */
export interface Moderator {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  permissions: string[];
  lastLogin: string;
  status: "active" | "suspended" | "pending";
  joinedAt: string;
}

export interface ModeratorInviteData {
  id: string;
  inviterName: string;
  inviterAvatar?: string;
  serverName: string;
  permissions: string[];
  inviteToken: string;
  expiresAt: string;
  status: "pending" | "accepted" | "expired" | "declined";
}

export interface ModeratorsResponse {
  moderators: Moderator[];
  totalCount: number;
  onlineCount: number;
}

export interface AddModeratorResponse {
  inviteToken: string;
}

/**
 * News/Changelog Types
 */
export interface NewsPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: "announcement" | "update" | "maintenance" | "event";
  tags: string[];
  isPinned: boolean;
  imageUrl?: string;
}

export interface Changelog {
  id: string;
  version: string;
  title: string;
  description: string;
  changes: {
    type: "added" | "changed" | "deprecated" | "removed" | "fixed" | "security";
    description: string;
  }[];
  releasedAt: string;
  isPrerelease: boolean;
}

export interface NewsResponse {
  posts: NewsPost[];
  totalCount: number;
}

export interface ChangelogsResponse {
  changelogs: Changelog[];
  totalCount: number;
}

/**
 * Server Analytics Types
 */
export interface ServerStats {
  totalPlayers: number;
  onlinePlayers: number;
  peakToday: number;
  totalBans: number;
  activeBans: number;
  totalModerators: number;
  onlineModerators: number;
  serverUptime: number;
  averagePing: number;
}

export interface ChartDataPoint {
  timestamp: string;
  players: number;
  cpu: number;
  memory: number;
  ping: number;
}

export interface ServerAnalyticsResponse {
  stats: ServerStats;
  chartData: ChartDataPoint[];
  playerActivity: PlayerStatsData[];
}

/**
 * Dashboard Types
 */
export interface DashboardStatsData {
  systemStatus: {
    value: number;
    badge: {
      text: string;
      variant: "default" | "secondary" | "destructive" | "outline";
      pulse?: boolean;
    };
  };
  totalServers: {
    value: number;
    subtitle: string;
    trend: { value: string; isPositive: boolean };
  };
  networkPlayers: {
    value: number;
    subtitle: string;
    trend: { value: string; isPositive: boolean };
  };
  threatLevel: {
    value: number;
    subtitle: string;
    badge: {
      text: string;
      variant: "default" | "secondary" | "destructive" | "outline";
      pulse?: boolean;
    };
  };
}

/**
 * Server-specific Dashboard Types
 */
export interface BanReport {
  [key: string]: string | undefined;
}

export interface BanRecord {
  id: string;
  playerId: string;
  playerName: string;
  banId: string;
  reason: string;
  evidence: boolean;
  status: "Permanent" | "Temporary" | "Appealed" | "Expired";
  bannedAt: string;
  firstJoin: string;
  avatar?: string;
  adminName?: string;
  serverName?: string;
  unbannedAt?: string;
  duration?: string;
  totalPlaytime?: string;
  evidenceUrl?: string | null;
  steamId?: string;
  report?: BanReport;
  reportedAsFalsePositive: boolean;
}

export interface ServerChartDataPoint {
  date: string;
  players: number;
  bans: number;
}

export interface ServerDashboardData {
  serverInfo: {
    id: string;
    name: string;
    description: string;
    status: "ACTIVE" | "TESTING" | "MAINTENANCE" | "OFFLINE";
    ip: string;
    imageUrl?: string;
    playerCount: number;
    maxPlayers: number;
    uptime: number;
    lastRestart?: string;
    gameMode?: string;
    map?: string;
    version?: string;
    licenseKey?: string;
    licenseExpiration?: string;
    licenseExpirationDays?: number;
  };
  stats: {
    currentPlayers: {
      value: number;
      trend: { value: string; isPositive: boolean };
    };
    peakPlayers: {
      value: number;
      period: string;
    };
    totalBans: {
      value: number;
      trend: { value: string; isPositive: boolean };
    };
  };
  license: {
    key: string;
    expirationDate: string;
    daysUntilExpiration: number;
    status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";
  };
  chart: {
    today: ChartDataPoint[];
    week: ChartDataPoint[];
    month: ChartDataPoint[];
  };
}

export interface ServerData {
  id: string;
  name: string;
  description: string;
  playerCount: number;
  status: "ACTIVE" | "TESTING" | "MAINTENANCE";
  statusColor: string;
  imageUrl: string;
}

export interface ActivityItem {
  action: string;
  user: string;
  time: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface ThreatAssessmentData {
  detectionRate: string;
  falsePositives: string;
  responseTime: string;
}

export interface ThreatActivityDataPoint {
  time: string;
  threatDetections: number;
  falsePositives: number;
  blockedAttempts: number;
  severity: "low" | "medium" | "high" | "critical";
}

export interface GlobalStatsData {
  totalBans24h: number;
  kicks24h: number;
  warnings24h: number;
  cleanSessions: number;
}

/**
 * Subscription Types
 */
export interface UserSubscription {
  id: string;
  name: string;
  plan: string;
  status: "active" | "paused" | "expired" | "cancelled";
  period: number; // Period in days
  serversUsed: number;
  serversLimit: number;
}

export interface SubscriptionsResponse {
  subscriptions: UserSubscription[];
  totalCount: number;
  activeCount: number;
}

export interface ServerType {
  id: string;
  name: string;
  description: string;
}

export interface DashboardData {
  stats: DashboardStatsData;
  servers: ServerData[];
  recentActivity: ActivityItem[];
  threatAssessment: ThreatAssessmentData;
  threatActivity: ThreatActivityDataPoint[];
  globalStats: GlobalStatsData;
  subscriptions: UserSubscription[];
  serverTypes: ServerType[];
}

/**
 * Server Management Types
 */
export interface AddServerRequest {
  serverName: string;
  serverIp: string;
  subscriptionId: string;
  serverType: string;
  serverImage?: string;
}

export interface ServerResponse {
  id: string;
  name: string;
  ip: string;
  subscriptionPlan: string;
  status: "active" | "pending" | "inactive";
  createdAt: string;
  imageUrl?: string;
}

export interface ServersResponse {
  servers: ServerResponse[];
  totalCount: number;
}

/**
 * Configuration Schema Types
 */
export interface DynamicConfigurations {
  categories: Category[];
}

export interface StaticConfigurations {
  serverName: string;
  serverIp: string;
  imageUrl: string;
  embedSettings: any;
  embedTemplates?: any;
  webhookUrls: {
    ban: string;
    kick: string;
    unban: string;
    warning: string;
    screenshot: string;
    // Audit log event webhooks
    playerQuit: string;
    playerRequestJoin: string;
    serverStart: string;
    antiCheatShutdown: string;
    playerUnbanned: string;
    playerBanned: string;
    playerKicked: string;
    playerWarning: string;
    configChange: string;
  };
}

export interface AntiCheatConfigurations {
  dynamic: DynamicConfigurations;
  static: StaticConfigurations;
}

export interface ConfigurationResponse {
  configs: AntiCheatConfigurations;
  lastUpdated: string;
  updatedBy: string;
}

export interface Category {
  id: string; // Unique category identifier
  label: string;
  description: string;
  icon: string;
  sections: Section[]; // Sections within this category
}

export interface Section {
  id: string; // Unique section identifier
  title: string; // Section display title
  subtitle?: string; // Optional description/subtitle
  icon?: string; // Optional icon name
  tooltip?: string;
  configurations: Configuration[]; // Config entries in this section
}

export type ConfigurationType = "boolean" | "number" | "string" | "select";

export interface Configuration {
  id: string; // Unique config identifier
  type: ConfigurationType; // Type of value
  title: string; // Display name
  subtitle?: string; // Optional description
  tip?: string; // Optional tip/help text
  icon?: string; // Optional icon
  value: boolean | number | string; // Current value
  extra?: any;
}

/**
 * API Query Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchParams extends PaginationParams {
  search?: string;
  filter?: string;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Players
  PLAYERS: "/players",
  PLAYER_KICK: "/players/kick",
  PLAYER_BAN: "/players/ban",
  PLAYER_SCREENSHOT: "/players/screenshot",
  PLAYER_STATS: "/players/stats",

  // Bans
  BANS: "/bans",
  BAN_CREATE: "/bans/create",
  BAN_UPDATE: "/bans/update",
  BAN_DELETE: "/bans/delete",

  // Audit Logs
  AUDIT_LOGS: "/audit-logs",

  // Moderators
  MODERATORS: "/moderators",
  MODERATOR_ADD: "/moderators/add",
  MODERATOR_UPDATE: "/moderators/update",
  MODERATOR_REMOVE: "/moderators/remove",

  // News & Changelogs
  NEWS: "/news",
  CHANGELOGS: "/changelogs",

  // Analytics
  SERVER_STATS: "/analytics/stats",
  SERVER_ANALYTICS: "/analytics/charts",

  // Dashboard
  DASHBOARD: "/dashboard/",

  // Configuration
  CONFIG: "/configuration",
  CONFIG_UPDATE: "/configuration/update",

  // Servers
  SERVERS: "/servers",
  SERVER_ADD: "/servers/add",
  SERVER_DELETE: "/servers",
  SERVER_DASHBOARD: "/server",
  SERVER_BANS: "/server",

  // Authentication
  SIGN_IN: "/auth/signin",
  SIGN_UP: "/auth/signup",
  SOCIAL_AUTH: "/auth/social",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  PROFILE: "/auth/profile",

  // General
  PING: "/ping",
  DEMO: "/demo",
} as const;
