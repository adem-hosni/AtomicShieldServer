import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-change-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (
  payload: Omit<JWTPayload, "iat" | "exp">,
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  console.log("Authentication middleware - Headers:", {
    authorization: authHeader,
  });
  console.log("Authentication middleware - Token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  try {
    const decoded = verifyToken(token);
    console.log("Token verified successfully:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token verification failed:", error);
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

// Optional middleware - allows both authenticated and unauthenticated requests
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // Token is invalid, but we don't reject the request
      console.log("Invalid token provided, continuing without auth");
    }
  }

  next();
};
