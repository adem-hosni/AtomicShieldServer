import { RequestHandler } from "express";

// Discord OAuth configuration
const DISCORD_CLIENT_ID = "1404072529684861058";
const DISCORD_CLIENT_SECRET = "6_Ne6-v2aaYWHLzeSVXHBAtchTnnYD2W";
const DISCORD_REDIRECT_URI = "http://localhost:8000/api/auth/discord/callback";

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email: string;
  verified: boolean;
}

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

// Mock user database (same as auth.ts)
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
  isVerified: boolean;
  provider: "email" | "discord" | "google";
  providerId?: string;
  avatar?: string;
}

// Simple in-memory user store (in production, use a real database)
const users: User[] = [];

// Helper function to generate mock JWT token
const generateToken = (userId: string): string => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Helper function to create user response (exclude sensitive data)
const createUserResponse = (user: User) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  isVerified: user.isVerified,
  provider: user.provider,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
  avatar: user.avatar,
});

// Discord OAuth redirect endpoint
export const discordAuth: RequestHandler = (req, res) => {
  console.log("Discord OAuth route hit with query:", req.query);

  const { returnUrl } = req.query;
  const finalReturnUrl = (returnUrl as string) || "/dashboard/overview";

  const discordAuthUrl = new URL("https://discord.com/api/oauth2/authorize");
  discordAuthUrl.searchParams.set("client_id", DISCORD_CLIENT_ID);
  discordAuthUrl.searchParams.set("redirect_uri", DISCORD_REDIRECT_URI);
  discordAuthUrl.searchParams.set("response_type", "code");
  discordAuthUrl.searchParams.set("scope", "identify email");
  discordAuthUrl.searchParams.set("state", encodeURIComponent(finalReturnUrl));

  res.redirect(discordAuthUrl.toString());
};

// Discord OAuth callback endpoint
export const discordCallback: RequestHandler = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Authorization code missing" });
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData: DiscordTokenResponse = await tokenResponse.json();

    // Fetch user info from Discord
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data from Discord");
    }

    const discordUser: DiscordUser = await userResponse.json();

    // Find existing user or create new
    let user = users.find(
      (u) => u.provider === "discord" && u.providerId === discordUser.id,
    );

    if (!user) {
      user = {
        id: Date.now().toString(),
        email: discordUser.email,
        password: "", // Not used for OAuth
        name: discordUser.username,
        createdAt: new Date().toLocaleString(),
        lastLogin: new Date().toLocaleString(),
        isVerified: discordUser.verified,
        provider: "discord",
        providerId: discordUser.id,
        avatar: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : undefined,
      };
      users.push(user);
    } else {
      // Update last login and user info
      user.lastLogin = new Date().toLocaleString();
      user.name = discordUser.username;
      user.email = discordUser.email;
      user.isVerified = discordUser.verified;
      user.avatar = discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : undefined;
    }

    // Generate your JWT token for the user
    const token = generateToken(user.id);

    // Prepare user data for URL param (include avatar and other info)
    const userData = encodeURIComponent(
      JSON.stringify({
        id: parseInt(user.id),
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar || "",
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      }),
    );

    // Redirect to frontend with token and user data
    const frontendUrl =  "http://localhost:8080";
    const redirectPath =
      state && typeof state === "string"
        ? decodeURIComponent(state)
        : "/dashboard/overview";
    const safeRedirectPath = redirectPath.startsWith("/")
      ? redirectPath
      : `/${redirectPath}`;

    const redirectUrl = `${frontendUrl}${safeRedirectPath}?token=${encodeURIComponent(token)}&user=${userData}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Discord OAuth callback error:", error);

    const frontendUrl =  "http://localhost:8080";
    return res.redirect(`${frontendUrl}/?error=discord_auth_failed`);
  }
};

// Get Discord user info endpoint (for testing)
export const getDiscordUser: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.substring(7);

    // Mock token validation (in production, verify JWT)
    const userIdMatch = token.match(/mock-jwt-token-(.*?)-/);
    if (!userIdMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const userId = userIdMatch[1];
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: createUserResponse(user),
      },
    });
  } catch (error) {
    console.error("Get Discord user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
