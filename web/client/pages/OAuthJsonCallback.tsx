import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { processOAuthResponse } from "@/lib/oauth-handler";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export const OAuthJsonCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        // Check if we have OAuth data in URL parameters first (existing flow)
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");

        if (token && userParam) {
          // Handle URL parameter flow
          const user = JSON.parse(decodeURIComponent(userParam));
          signIn(token, user);
          setStatus("success");

          // Clear URL parameters and redirect
          setTimeout(() => {
            navigate("/dashboard/overview", { replace: true });
          }, 1500);
          return;
        }

        // Check for JSON response data (new flow)
        const jsonData = searchParams.get("json");
        const responseData = searchParams.get("response");

        if (jsonData || responseData) {
          const jsonString = jsonData || responseData;
          if (jsonString) {
            const result = processOAuthResponse(decodeURIComponent(jsonString));

            if (result.success && result.user) {
              // Update auth context
              const authUser = {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                provider: result.user.provider,
                avatar: result.user.avatar,
                isVerified: result.user.isVerified,
                createdAt: result.user.createdAt,
                lastLogin: result.user.lastLogin,
              };

              signIn(localStorage.getItem("token")!, authUser);
              setStatus("success");

              // Redirect to dashboard
              setTimeout(() => {
                navigate("/dashboard/overview", { replace: true });
              }, 1500);
            } else {
              throw new Error(result.error || "OAuth processing failed");
            }
            return;
          }
        }

        // If no valid OAuth data found, redirect to sign in
        throw new Error("No OAuth data found in callback");
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "OAuth authentication failed",
        );

        // Redirect to sign in page after delay
        setTimeout(() => {
          navigate("/auth/signin", { replace: true });
        }, 3000);
      }
    };

    handleOAuth();
  }, [searchParams, navigate, signIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Processing Authentication
          </h2>
        </div>

        {status === "processing" && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Processing your OAuth authentication...
            </AlertDescription>
          </Alert>
        )}

        {status === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Authentication successful! Redirecting to your dashboard...
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage}
              <br />
              <span className="text-sm mt-2 block">
                Redirecting to sign in page...
              </span>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default OAuthJsonCallback;
