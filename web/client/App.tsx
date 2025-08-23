import "./global.css";

import React from "react";

// Suppress recharts defaultProps warnings since they come from the library itself
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    message.includes(
      "Support for defaultProps will be removed from function components",
    ) &&
    (message.includes("XAxis") || message.includes("YAxis"))
  ) {
    return; // Suppress recharts defaultProps warnings
  }
  originalConsoleWarn.apply(console, args);
};
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/hooks/use-language";
import { AuthProvider } from "@/contexts/AuthContext";
import { useFavicon } from "@/hooks/use-page-title";
import { HelmetProvider } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { AtomicSidebar } from "@/components/AtomicSidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { MobileNavigation } from "@/components/MobileNavigation";
import { DashboardOverview } from "@/components/DashboardOverview";
import { GeneralDashboard } from "@/components/GeneralDashboard";
import { AntiCheatConfigurationPage } from "@/components/AntiCheatConfigurationPage";
import { SimpleServerDashboard } from "@/components/SimpleServerDashboard";
import { BansPage } from "@/components/BansPage";
import { AuditLogsPage } from "@/components/AuditLogsPage";
import { ModeratorsPage } from "@/components/ModeratorsPage";
import { NewsPage } from "@/components/NewsPage";
import { ChangelogsPage } from "@/components/ChangelogsPage";
import { DownloadPage } from "@/components/DownloadPage";
import { PlayersPage } from "@/components/PlayersPage";
import { RedeemPage } from "@/components/RedeemPage";
import { SubscriptionsPage } from "@/components/SubscriptionsPage";
import { AcceptInvite } from "@/components/AcceptInvite";
import { SupportPage } from "@/components/SupportPage";
import { DocumentationPage } from "@/components/DocumentationPage";
import { MultiStreamPage } from "@/components/MultiStreamPage";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePageNew";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import OAuthJsonCallback from "./pages/OAuthJsonCallback";

const queryClient = new QueryClient();

// Layout component for the dashboard
const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background text-foreground dark">
    <AtomicSidebar />
    {/* Mobile Navigation Bar */}
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar/95 backdrop-blur-md border-b border-sidebar-border z-50 flex items-center justify-between px-4 sm:px-6 safe-area-inset-top">
      <div className="flex items-center gap-3">
        <div className="relative group">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fded3bb25d27f4acca47097c7c5d9349e%2F9c3bb44456604be2871a4b72bb7f176b?format=webp&width=800"
            alt="AtomicShield"
            className="h-8 w-8 transition-all duration-300 drop-shadow-lg"
          />
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse transition-all duration-300" />
        </div>
        <h1 className="text-lg font-semibold bg-gradient-to-r from-sidebar-foreground to-cyan-400 bg-clip-text text-transparent">
          AtomicShield
        </h1>
      </div>
      {/* Mobile Navigation Trigger */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
    </div>
    <main className="lg:ml-64 xl:ml-72 min-h-screen transition-all duration-300">
      <div className="w-full pt-16 lg:pt-0 pb-safe">{children}</div>
    </main>
  </div>
);

const App = () => {
  // Initialize favicon with AtomicShield logo
  useFavicon();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/tos" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/invite" element={<AcceptInvite />} />

                {/* Authentication Routes - Redirect to dashboard if already authenticated */}
                <Route
                  path="/auth/signin"
                  element={
                    <PublicRoute redirectIfAuthenticated={true}>
                      <SignIn />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth/signup"
                  element={
                    <PublicRoute redirectIfAuthenticated={true}>
                      <SignUp />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth/forgot-password"
                  element={
                    <PublicRoute redirectIfAuthenticated={true}>
                      <ForgotPassword />
                    </PublicRoute>
                  }
                />

                {/* OAuth Callback Routes */}
                <Route
                  path="/auth/google/callback"
                  element={<GoogleAuthCallback />}
                />
                <Route
                  path="/auth/oauth/callback"
                  element={<OAuthJsonCallback />}
                />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/dashboard/overview" replace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/overview"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <GeneralDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/server/:serverId"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardContent />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/server/:serverId/players"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <PlayersPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/server/:serverId/bans"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <BansPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/server/:serverId/config"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <AntiCheatConfigurationPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/server/:serverId/moderators"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <ModeratorsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/server/:serverId/logs"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <AuditLogsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/server/:serverId/streams"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <MultiStreamPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/news"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <NewsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/changelogs"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <ChangelogsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/download"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DownloadPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/subscriptions"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <SubscriptionsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/redeem"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <RedeemPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/support"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <SupportPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/docs"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DocumentationPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/streams"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <MultiStreamPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

// Create root only once and handle hot module replacement properly
const container = document.getElementById("root")!;

// Check if we're in development and if the root already exists
let root: any;
if (import.meta.hot) {
  // In development with HMR, check if root already exists
  if (!(container as any)._reactRoot) {
    root = createRoot(container);
    (container as any)._reactRoot = root;
  } else {
    root = (container as any)._reactRoot;
  }
} else {
  // In production, always create a new root
  root = createRoot(container);
}

root.render(<App />);
