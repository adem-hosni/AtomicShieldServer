import { RequestHandler } from "express";

// Google OAuth configuration
const GOOGLE_CLIENT_ID ="1091637385561-5l7jpbubori3m6jekd6nn1bu7g999p3f.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_REDIRECT_URI = "http://localhost:8000/api/auth/google/callback";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
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

// Google OAuth redirect endpoint
export const googleAuth: RequestHandler = (req, res) => {
  console.log("Google OAuth route hit with query:", req.query);

  const state = Math.random().toString(36).substring(2, 15);
  const { returnUrl, redirect, state: providedState } = req.query;

  // Use returnUrl or redirect parameter
  const finalReturnUrl =
    (returnUrl as string) || (redirect as string) || "/dashboard/overview";

  // Store state in session (in production, use proper session management)
  req.session = req.session || {};
  req.session.oauth_state = state;
  req.session.return_url = finalReturnUrl;

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", encodeURIComponent(finalReturnUrl));
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "consent");

  res.redirect(googleAuthUrl.toString());
};

// Google OAuth callback endpoint
export const googleCallback: RequestHandler = async (req, res) => {
  try {
    const { code, state } = req.body || req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code missing",
      });
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code: code as string,
        grant_type: "authorization_code",
        redirect_uri: req.body?.redirect_uri || GOOGLE_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json();

    // Get user information from Google
    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`,
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data from Google");
    }

    const googleUser: GoogleUser = await userResponse.json();

    // Check if user already exists
    let user = users.find(
      (u) => u.provider === "google" && u.providerId === googleUser.id,
    );

    if (!user) {
      // Create new user
      user = {
        id: `google-${googleUser.id}`,
        email: googleUser.email,
        password: "", // Not needed for OAuth
        name: googleUser.name,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isVerified: googleUser.verified_email,
        provider: "google",
        providerId: googleUser.id,
        avatar: googleUser.picture,
      };

      users.push(user);
    } else {
      // Update existing user
      user.lastLogin = new Date().toISOString();
      user.name = googleUser.name;
      user.email = googleUser.email;
      user.isVerified = googleUser.verified_email;
      user.avatar = googleUser.picture;
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // For API requests (like from our component), return JSON
    if (req.headers["content-type"]?.includes("application/json") || req.body) {
      return res.json({
        success: true,
        token,
        user: createUserResponse(user),
        message: "Google authentication successful",
      });
    }

    const frontendUrl = "http://localhost:8080";
    const redirectPath =
      state && typeof state === "string"
        ? decodeURIComponent(state)
        : "/dashboard/overview";
    const safeRedirectPath = redirectPath.startsWith("/")
      ? redirectPath
      : `/${redirectPath}`;

    const userData = encodeURIComponent(
      JSON.stringify({
        id: parseInt(user.id.replace("google-", "")),
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar || "",
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      }),
    );

    const redirectUrl = `${frontendUrl}${safeRedirectPath}?token=${encodeURIComponent(token)}&user=${userData}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    // For API requests, return JSON error
    if (req.headers["content-type"]?.includes("application/json") || req.body) {
      return res.status(500).json({
        success: false,
        message: "Google authentication failed",
      });
    }

    // For browser requests, redirect to error page
    res.redirect("/?error=google_auth_failed");
  }
};

// Get Google user info endpoint (for testing)
export const getGoogleUser: RequestHandler = async (req, res) => {
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
    console.error("Get Google user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
