import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

const GoogleAuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const state = searchParams.get("state");

        if (error) {
          throw new Error(`Google authentication failed: ${error}`);
        }

        if (!code) {
          throw new Error("Authorization code missing");
        }

        // Exchange code for token
        const response = await fetch("/api/auth/google/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            redirect_uri: `${window.location.origin}/auth/google/callback`,
          }),
        });

        if (!response.ok) {
          throw new Error(`Authentication failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.token) {
          // Use AuthContext to sign in
          signIn(data.token, data.user);

          // Get redirect path from state or default
          const redirectPath = state
            ? decodeURIComponent(state)
            : "/dashboard/overview";

          // Redirect to final destination
          navigate(redirectPath, { replace: true });
        } else {
          throw new Error(data.message || "Authentication failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Authentication failed";
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, signIn]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-900/50 border-red-500/20">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Authentication Failed
            </h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => navigate("/signin")}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Back to Sign In
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gray-900/50 border-gray-700/50">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Completing Google Sign In
          </h3>
          <p className="text-gray-400">
            Please wait while we redirect you to your dashboard...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAuthCallback;
