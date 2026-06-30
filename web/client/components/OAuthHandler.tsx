import React, { useEffect, useState } from "react";
import { useOAuthHandler } from "@/lib/oauth-handler";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface OAuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      provider: string;
      avatar: string;
      isVerified: boolean;
      createdAt: string;
      lastLogin: string;
    };
  };
}

interface OAuthHandlerProps {
  response?: OAuthResponse;
  onComplete?: () => void;
  redirectPath?: string;
}

export const OAuthHandler: React.FC<OAuthHandlerProps> = ({
  response,
  onComplete,
  redirectPath,
}) => {
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { handleOAuthResponse } = useOAuthHandler({
    onSuccess: (user) => {
      setStatus("success");
      console.log("OAuth sign-in successful:", user);
      if (onComplete) {
        setTimeout(onComplete, 1000);
      }
    },
    onError: (error) => {
      setStatus("error");
      setErrorMessage(error);
      console.error("OAuth sign-in failed:", error);
    },
    redirectPath,
  });

  useEffect(() => {
    if (response && status === "idle") {
      setStatus("processing");
      handleOAuthResponse(response);
    }
  }, [response, status, handleOAuthResponse]);

  if (status === "idle") {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-full max-w-md space-y-4">
        {status === "processing" && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Processing OAuth authentication...
            </AlertDescription>
          </Alert>
        )}

        {status === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Authentication successful! Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Authentication failed: {errorMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

// Hook to handle OAuth responses from external sources
export const useOAuthFromJson = () => {
  const { handleOAuthResponse } = useOAuthHandler();

  const processJsonResponse = (jsonString: string) => {
    try {
      const response: OAuthResponse = JSON.parse(jsonString);
      return handleOAuthResponse(response);
    } catch (error) {
      console.error("Failed to parse OAuth JSON response:", error);
      return { success: false, error: "Invalid JSON response" };
    }
  };

  return { processJsonResponse };
};
