import { RequestHandler } from "express";
import { z } from "zod";
import { generateToken, verifyToken } from "../middleware/auth";

// Mock user database (in production, use a real database)
interface User {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  name: string;
  createdAt: string;
  lastLogin?: string;
  isVerified: boolean;
  provider: "email" | "discord" | "google";
  providerId?: string;
}

// Mock database
const users: User[] = [
  {
    id: "1",
    email: "admin@atomicshield.com",
    password: "admin123", // In production, hash this with bcrypt
    name: "Admin User",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z",
    isVerified: true,
    provider: "email",
  },
  {
    id: "2",
    email: "user@example.com",
    password: "password123",
    name: "Test User",
    createdAt: "2024-01-05T00:00:00Z",
    isVerified: true,
    provider: "email",
  },
];

// Validation schemas
const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Helper function to generate JWT token
const generateUserToken = (user: User): string => {
  return generateToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });
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
});

// Sign In endpoint
export const signIn: RequestHandler = async (req, res) => {
  try {
    console.log("Sign in attempt:", req.body);

    // Validate request body
    const validationResult = signInSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.issues);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.issues,
      });
    }

    const { email, password } = validationResult.data;

    // Find user by email
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password (in production, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate token
    const token = generateUserToken(user);
    console.log("Generated JWT token for user:", user.email);

    // Return success response
    const response = {
      success: true,
      message: "Sign in successful",
      data: {
        user: createUserResponse(user),
        token,
        expiresIn: "24h",
      },
    };

    console.log("Sending sign in response:", {
      success: response.success,
      message: response.message,
    });
    res.json(response);
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Sign Up endpoint
export const signUp: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const validationResult = signUpSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.issues,
      });
    }

    const { email, password, name } = validationResult.data;

    // Check if user already exists
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      email: email.toLowerCase(),
      password, // In production, hash with bcrypt
      name,
      createdAt: new Date().toISOString(),
      isVerified: false, // In production, send verification email
      provider: "email",
    };

    // Add to mock database
    users.push(newUser);

    // Generate token
    const token = generateUserToken(newUser);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: createUserResponse(newUser),
        token,
        expiresIn: "24h",
      },
    });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Social authentication endpoints
export const socialAuth: RequestHandler = async (req, res) => {
  try {
    const { provider } = req.params;
    const { code, state } = req.query;

    if (!["discord", "google"].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported authentication provider",
      });
    }

    // In production, implement proper OAuth flow:
    // 1. Exchange code for access token
    // 2. Use access token to get user info from provider
    // 3. Create or update user in database
    // 4. Generate JWT token

    // Mock implementation for now
    console.log(`Social auth with ${provider}:`, { code, state });

    // Mock user data based on provider
    const mockSocialUser: User = {
      id: `${provider}-${Date.now()}`,
      email: `user@${provider}.example.com`,
      password: "", // Not needed for social auth
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isVerified: true,
      provider: provider as "discord" | "google",
      providerId: `${provider}-user-id-${Date.now()}`,
    };

    // Check if user exists by provider ID
    let user = users.find(
      (u) =>
        u.provider === provider && u.providerId === mockSocialUser.providerId,
    );

    if (!user) {
      // Create new user
      users.push(mockSocialUser);
      user = mockSocialUser;
    } else {
      // Update last login
      user.lastLogin = new Date().toISOString();
    }

    // Generate token
    const token = generateUserToken(user);

    // Return success response
    res.json({
      success: true,
      message: `${provider} authentication successful`,
      data: {
        user: createUserResponse(user),
        token,
        expiresIn: "24h",
      },
    });
  } catch (error) {
    console.error("Social auth error:", error);
    res.status(500).json({
      success: false,
      message: "Social authentication failed",
    });
  }
};

// Forgot password endpoint
export const forgotPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user by email
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    // Always return success for security (don't reveal if email exists)
    res.json({
      success: true,
      message:
        "If an account with this email exists, you will receive a password reset link",
    });

    // In production:
    // 1. Generate secure reset token
    // 2. Store token in database with expiration
    // 3. Send email with reset link
    if (user) {
      console.log(`Password reset requested for user: ${user.email}`);
      // Mock: Generate reset token and log it
      const resetToken = `reset-${user.id}-${Date.now()}`;
      console.log(`Reset token (mock): ${resetToken}`);
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reset password endpoint
export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // In production:
    // 1. Validate reset token
    // 2. Check token expiration
    // 3. Update user password (hashed)
    // 4. Invalidate reset token

    // Mock implementation
    console.log(`Password reset with token: ${token}`);

    // Mock: Extract user ID from token (in production, look up in database)
    const userIdMatch = token.match(/reset-(\d+)-/);
    if (!userIdMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const userId = userIdMatch[1];
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password (in production, hash it)
    user.password = newPassword;

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get current user profile
export const getProfile: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyToken(token);
      const user = users.find((u) => u.id === decoded.userId);

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
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
