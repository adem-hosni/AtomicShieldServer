import express from "express";
import cors from "cors";
import session from "express-session";
import { handleDemo } from "./routes/demo";
import {
  getPlayers,
  kickPlayer,
  banPlayer,
  takeScreenshot,
  getPlayerStats,
} from "./routes/players";
import {
  getBans,
  createBan,
  updateBan,
  deleteBan,
  unbanPlayer,
  reportFalsePositive,
} from "./routes/bans";
import {
  signIn,
  signUp,
  socialAuth,
  forgotPassword,
  resetPassword,
  getProfile,
} from "./routes/auth";
import {
  googleAuth,
  googleCallback,
  getGoogleUser,
} from "./routes/google-oauth";
import {
  discordAuth,
  discordCallback,
  getDiscordUser,
} from "./routes/discord-oauth";
import { getDashboardOverview } from "./routes/dashboard";
import {
  addServer,
  getServers,
  deleteServer,
  getServerDashboard,
  getServerBans,
  getServerConfigurations,
} from "./routes/servers";
import {
  getConfiguration,
  updateConfiguration,
  getConfigurationHistory,
} from "./routes/configuration";
import { testWebhook } from "./routes/webhook-test";
import { authenticateToken, optionalAuth } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Session middleware for OAuth state management
  app.use(
    session({
      secret:
        process.env.SESSION_SECRET ||
        "fallback-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  // Debug middleware to log all API requests
  app.use("/api", (req, res, next) => {
    console.log(`[API] ${req.method} ${req.path}`);
    console.log("Query:", req.query);
    console.log("Body:", req.body);
    console.log("Headers:", req.headers);
    next();
  });

  // General API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication API routes
  app.post("/api/auth/signin", signIn);
  app.post("/api/auth/signup", signUp);
  app.get("/api/auth/social/:provider", socialAuth);
  app.post("/api/auth/forgot-password", forgotPassword);
  app.post("/api/auth/reset-password", resetPassword);
  app.get("/api/auth/profile", getProfile);

  // Google OAuth routes
  app.get("/api/auth/google/login", googleAuth);
  app.post("/api/auth/google/callback", googleCallback);
  app.get("/api/auth/google/callback", googleCallback);
  app.get("/api/auth/google/user", getGoogleUser);

  // Discord OAuth routes
  app.get("/api/auth/discord/login", discordAuth);
  app.get("/api/auth/discord/callback", discordCallback);
  app.get("/api/auth/discord/user", getDiscordUser);

  // Players API routes
  app.get("/api/players", getPlayers);
  app.post("/api/players/kick", kickPlayer);
  app.post("/api/players/ban", banPlayer);
  app.post("/api/players/screenshot/:playerId", takeScreenshot);
  app.get("/api/players/stats", getPlayerStats);

  // Dashboard API routes (protected)
  app.get("/api/dashboard/", authenticateToken, getDashboardOverview);

  // Bans API routes
  app.get("/api/bans", getBans);
  app.post("/api/bans/create", createBan);
  app.put("/api/bans/update/:banId", updateBan);
  app.delete("/api/bans/delete/:banId", deleteBan);

  // Servers API routes
  app.get("/api/servers", getServers);
  app.post("/api/servers/add", addServer);
  app.delete("/api/servers/:serverId", deleteServer);
  app.get("/api/server/:serverId", authenticateToken, getServerDashboard);
  app.get("/api/server/:serverId/bans", authenticateToken, getServerBans);
  app.get(
    "/api/server/:serverId/configurations",
    authenticateToken,
    getServerConfigurations,
  );
  app.post("/api/api/server/63/bans/unban", authenticateToken, unbanPlayer);
  app.post(
    "/api/server/:serverId/bans/:banId/report-false-positive",
    authenticateToken,
    reportFalsePositive,
  );
  app.post("/api/server/:serverId/bans", authenticateToken, createBan);

  // Audit Logs API routes (placeholder)
  app.get("/api/audit-logs", (_req, res) => {
    res.json({
      success: true,
      data: { logs: [], totalCount: 0 },
      message: "Audit logs endpoint - to be implemented",
    });
  });

  // Moderators API routes (placeholder)
  app.get("/api/moderators", (_req, res) => {
    res.json({
      success: true,
      data: { moderators: [], totalCount: 0, onlineCount: 0 },
      message: "Moderators endpoint - to be implemented",
    });
  });

  // News API routes (placeholder)
  app.get("/api/news", (_req, res) => {
    res.json({
      success: true,
      data: { posts: [], totalCount: 0 },
      message: "News endpoint - to be implemented",
    });
  });

  // Changelogs API routes (placeholder)
  app.get("/api/changelogs", (_req, res) => {
    res.json({
      success: true,
      data: { changelogs: [], totalCount: 0 },
      message: "Changelogs endpoint - to be implemented",
    });
  });

  // Analytics API routes (placeholder)
  app.get("/api/analytics/stats", (_req, res) => {
    res.json({
      success: true,
      data: {},
      message: "Analytics stats endpoint - to be implemented",
    });
  });

  app.get("/api/analytics/charts", (_req, res) => {
    res.json({
      success: true,
      data: {},
      message: "Analytics charts endpoint - to be implemented",
    });
  });

  // Configuration API routes
  app.get(
    "/api/server/:serverId/configuration",
    authenticateToken,
    getConfiguration,
  );
  app.put(
    "/api/server/:serverId/configuration",
    authenticateToken,
    updateConfiguration,
  );
  app.get(
    "/api/server/:serverId/configuration/history",
    authenticateToken,
    getConfigurationHistory,
  );

  // Webhook test API route
  app.post("/api/webhook/test", authenticateToken, testWebhook);

  return app;
}
