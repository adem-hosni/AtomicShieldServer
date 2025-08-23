import React from "react";
import DiscordSignInButton from "./DiscordSignInButton";

interface BuilderDiscordSignInProps {
  redirectPath?: string;
  buttonText?: string;
  buttonSize?: "sm" | "default" | "lg";
  showTitle?: boolean;
  title?: string;
  showSubtitle?: boolean;
  subtitle?: string;
  containerClassName?: string;
  buttonClassName?: string;
}

/**
 * Builder.io compatible Discord Sign-In component
 * This wrapper makes the DiscordSignInButton more Builder.io friendly
 * with additional customization options that can be easily configured
 * in the Builder.io visual editor.
 */
export const BuilderDiscordSignIn: React.FC<BuilderDiscordSignInProps> = ({
  redirectPath = "/dashboard/overview",
  buttonText,
  buttonSize = "lg",
  showTitle = false,
  title = "Sign in with Discord",
  showSubtitle = false,
  subtitle = "Connect your Discord account to get started",
  containerClassName = "",
  buttonClassName = "",
}) => {
  return (
    <div className={`w-full max-w-md mx-auto ${containerClassName}`}>
      {showTitle && (
        <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
          {title}
        </h2>
      )}

      {showSubtitle && (
        <p className="text-gray-400 text-center mb-6">{subtitle}</p>
      )}

      <DiscordSignInButton
        redirectPath={redirectPath}
        size={buttonSize}
        className={buttonClassName}
        onAuthStart={() => {
          // Optional: Send analytics event to Builder.io or other services
          console.log("Discord auth started");
        }}
        onAuthComplete={(user) => {
          // Optional: Send analytics event to Builder.io or other services
          console.log("Discord auth completed for user:", user);
        }}
        onAuthError={(error) => {
          // Optional: Send analytics event to Builder.io or other services
          console.error("Discord auth error:", error);
        }}
      />
    </div>
  );
};

// Export both named and default for flexibility
export default BuilderDiscordSignIn;
