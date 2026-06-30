import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const GoogleSignInDemo = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-2">Google Sign-In Demo</h1>
        <p className="text-gray-400">
          Test the Google OAuth authentication component
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Basic Implementation */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">
              Basic Google Sign-In Button
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400">
              Default implementation with standard styling and functionality.
            </p>
            <div className="max-w-sm">
              <GoogleSignInButton
                onAuthStart={() => console.log("Google auth started")}
                onAuthComplete={(user) =>
                  console.log("Google auth completed:", user)
                }
                onAuthError={(error) =>
                  console.error("Google auth error:", error)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Redirect Path */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Custom Redirect Path</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400">
              Sign in with Google and redirect to a specific path after
              authentication.
            </p>
            <div className="max-w-sm">
              <GoogleSignInButton
                redirectPath="/dashboard/overview"
                onAuthStart={() =>
                  console.log("Google auth started with custom redirect")
                }
                onAuthComplete={(user) =>
                  console.log("Google auth completed:", user)
                }
                onAuthError={(error) =>
                  console.error("Google auth error:", error)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Different Sizes */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Different Sizes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-gray-400 mb-3">Small size:</p>
              <div className="max-w-xs">
                <GoogleSignInButton size="sm" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-3">Default size:</p>
              <div className="max-w-sm">
                <GoogleSignInButton size="default" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-3">Large size:</p>
              <div className="max-w-sm">
                <GoogleSignInButton size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Styling */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Custom Styling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400">
              Custom styled Google sign-in button with additional classes.
            </p>
            <div className="max-w-sm">
              <GoogleSignInButton
                className="border-2 border-cyan-500/50 hover:border-cyan-400"
                onAuthStart={() =>
                  console.log("Custom styled Google auth started")
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Handling */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Event Handling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400">
              Open your browser's developer console to see the authentication
              events.
            </p>
            <div className="max-w-sm">
              <GoogleSignInButton
                onAuthStart={() => {
                  console.log("🚀 Google authentication started");
                  alert(
                    "Google authentication started! Check the console for details.",
                  );
                }}
                onAuthComplete={(user) => {
                  console.log("✅ Google authentication completed:", user);
                  alert(`Welcome ${user.name}! Authentication successful.`);
                }}
                onAuthError={(error) => {
                  console.error("❌ Google authentication error:", error);
                  alert(`Authentication failed: ${error}`);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-gray-400 space-y-2">
              <p>
                <strong className="text-white">Basic Usage:</strong>
              </p>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                {`import { GoogleSignInButton } from "@/components/GoogleSignInButton";

<GoogleSignInButton
  redirectPath="/dashboard/overview"
  onAuthComplete={(user) => console.log("User:", user)}
  onAuthError={(error) => console.error("Error:", error)}
/>`}
              </pre>

              <p className="pt-4">
                <strong className="text-white">Available Props:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  <code>redirectPath</code> - Where to redirect after successful
                  authentication
                </li>
                <li>
                  <code>size</code> - Button size: "sm", "default", or "lg"
                </li>
                <li>
                  <code>className</code> - Additional CSS classes
                </li>
                <li>
                  <code>disabled</code> - Disable the button
                </li>
                <li>
                  <code>onAuthStart</code> - Callback when authentication starts
                </li>
                <li>
                  <code>onAuthComplete</code> - Callback when authentication
                  succeeds
                </li>
                <li>
                  <code>onAuthError</code> - Callback when authentication fails
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleSignInDemo;
