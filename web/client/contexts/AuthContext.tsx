import React, { createContext, useContext, useEffect, useState } from "react";
import {
  isAuthenticated,
  getCurrentUser,
  signOut,
  getAuthToken,
} from "@/lib/auth-utils";

interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  provider: "email" | "discord" | "google";
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, userData: User) => void;
  signOut: () => void;
  checkAuth: () => void;
  forceLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount and when storage changes
  const checkAuth = () => {
    try {
      const authStatus = isAuthenticated();
      const userToken = getAuthToken();
      const userData = getCurrentUser();

      if (authStatus && userToken && userData) {
        setUser(userData);
        setToken(userToken);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function
  const handleSignIn = (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Sign out function
  const handleSignOut = () => {
    signOut();
    setUser(null);
    setToken(null);
  };

  // Force logout function (used by API client on 401 errors)
  const forceLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setIsLoading(false);
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for storage changes (for multi-tab support) and auth events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        checkAuth();
      }
    };

    const handleAuthLogout = () => {
      // Force logout when auth-logout event is triggered
      forceLogout();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-logout", handleAuthLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-logout", handleAuthLogout);
    };
  }, []);

  // Auto-logout on token expiration (if applicable)
  useEffect(() => {
    if (token) {
      // Here you could add token expiration checking
      // For now, we'll just keep the current implementation
    }
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    checkAuth,
    forceLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
