import React, { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthCallbackWithContext } from "@/lib/auth-utils-enhanced";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

const SignIn = () => {
  usePageTitle("Sign In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  // Get the return URL from location state, query parameter, or default to dashboard
  const urlParams = new URLSearchParams(location.search);
  const redirectParam = urlParams.get("redirect");
  const returnUrl =
    location.state?.from || redirectParam || "/dashboard/overview";

  // Handle OAuth callback with AuthContext integration
  useAuthCallbackWithContext(signIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is ok first
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default error message
        }
        setError(errorMessage);
        return;
      }

      // Only parse JSON if response is ok
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        setError("Invalid response from server");
        return;
      }

      if (data.success) {
        // Use AuthContext to handle sign in
        signIn(data.data.token, data.data.user);

        // Redirect to the return URL or dashboard
        navigate(returnUrl, { replace: true });
      } else {
        setError(data.message || "Sign in failed");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || "/api";

    if (provider === "discord") {
      const backendRedirectUri =
        "http://localhost:8000/api/auth/discord/callback";
      window.location.href = `${apiUrl}/auth/discord/login?redirect=${encodeURIComponent(backendRedirectUri)}&returnUrl=${encodeURIComponent(returnUrl)}`;
    } else if (provider === "google") {
      const state = encodeURIComponent(returnUrl);
      window.location.href = `${apiUrl}/auth/google/login?returnUrl=${state}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden flex items-center justify-center px-4 sm:px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.12)_1px,transparent_1px)] bg-[size:50px_50px]"
          style={{
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      {/* Glowing Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=800"
                alt="AtomicShield Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg"
              />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse group-hover:bg-cyan-400/40 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-purple-300 transition-all duration-300">
              AtomicShield
            </span>
          </Link>
        </div>

        {/* Sign In Form */}
        <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/60 backdrop-blur-2xl border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10">
          <CardHeader className="text-center space-y-2 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your quantum-grade enhancement platform
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            {/* Social Authentication Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                onClick={() => handleSocialAuth("discord")}
                className="group w-full bg-[#5865F2] hover:bg-[#4752C4] text-white border-0 shadow-lg shadow-[#5865F2]/25 hover:shadow-[#5865F2]/40 transition-all duration-300 rounded-xl hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-5 mr-3 bg-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <svg
                      className="w-3 h-3 text-[#5865F2]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
                    </svg>
                  </div>
                  <span className="font-medium">Continue with Discord</span>
                </div>
              </Button>

              <Button
                type="button"
                onClick={() => handleSocialAuth("google")}
                className="group w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Continue with Google</span>
                </div>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/80 text-gray-400">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-300"
                >
                  Email or Username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder-gray-500 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800/50 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder-gray-500 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 rounded-xl"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
