import React, { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Lock,
  Gift,
  Star,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api-client";

export function RedeemPage() {
  usePageTitle("Redeem");
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 47,
    minutes: 32,
    seconds: 15,
  });
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedeem = async () => {
    if (!redeemCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a redemption code",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to redeem license keys.",
        variant: "destructive",
      });
      navigate("/auth/signin", {
        state: { from: "/dashboard/redeem" },
      });
      return;
    }

    setIsRedeeming(true);

    try {
      const result = await api.subscriptions.redeem(redeemCode.trim());

      if (result.success) {
        toast({
          title: "🎉 Code Redeemed Successfully!",
          description: `Your license "${redeemCode}" has been activated`,
        });
        setRedeemCode("");
      } else {
        toast({
          title: "Redemption Failed",
          description: result.error || "Invalid or expired redemption code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Redemption error:", error);
      toast({
        title: "Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleTrialClaim = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to claim your free trial.",
        variant: "destructive",
      });
      navigate("/auth/signin", {
        state: { from: "/dashboard/redeem" },
      });
      return;
    }

    setIsRedeeming(true);

    try {
      const result = await api.subscriptions.redeem("trial");

      if (result.success) {
        toast({
          title: "🎉 Trial Activated!",
          description: "Your 3-day free trial has been activated successfully!",
        });
      } else {
        toast({
          title: "Trial Activation Failed",
          description: result.error || "Unable to activate trial at this time",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Trial redemption error:", error);
      toast({
        title: "Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRedeem();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative min-h-screen">
      {/* Animated background with gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,207,255,0.1),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,255,127,0.08),transparent_50%)] -z-10" />

      {/* Animated particles */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div
          className="absolute w-2 h-2 bg-[#00CFFF]/30 rounded-full animate-pulse"
          style={{
            top: "20%",
            left: "10%",
            animationDelay: "0s",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-1 h-1 bg-[#00FF7F]/40 rounded-full animate-pulse"
          style={{
            top: "60%",
            left: "80%",
            animationDelay: "2s",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-3 h-3 bg-[#00CFFF]/20 rounded-full animate-pulse"
          style={{
            top: "80%",
            left: "20%",
            animationDelay: "4s",
            animation: "float 10s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>

      <div className="p-4 lg:p-6 space-y-6 relative">
        {/* Breadcrumb */}
        <Breadcrumb className="animate-fade-in">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard/overview"
                className="text-slate-400 hover:text-[#00CFFF] transition-colors"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-slate-600" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-200">
                Redeem License
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="text-center space-y-4 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Shield className="h-10 w-10 text-[#00CFFF] drop-shadow-[0_0_10px_rgba(0,207,255,0.5)]" />
              <div className="absolute inset-0 animate-ping">
                <Shield className="h-10 w-10 text-[#00CFFF]/30" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
              Redeem License
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Enter your license key to activate premium protection instantly.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Redeem License Card */}
          <Card className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-[#00CFFF]/20 shadow-2xl hover:shadow-[0_0_30px_rgba(0,207,255,0.15)] transition-all duration-500 group animate-slide-up-delay">
            {/* Glassmorphism glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00CFFF]/5 via-transparent to-[#00FF7F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00CFFF]/10 rounded-lg">
                  <Lock className="h-5 w-5 text-[#00CFFF]" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">
                    License Activation
                  </CardTitle>
                  <p className="text-sm text-slate-400">
                    Secure your server with premium protection
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 relative">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    License Key
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="AS-XXXX-XXXX-XXXX-XXXX"
                      value={redeemCode}
                      onChange={(e) =>
                        setRedeemCode(e.target.value.toUpperCase())
                      }
                      onKeyPress={handleKeyPress}
                      className="h-11 text-base bg-slate-800/50 border-slate-700/50 focus:border-[#00CFFF] focus:ring-[#00CFFF]/20 text-white placeholder:text-slate-500 transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#00CFFF]/10 to-[#00FF7F]/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                <Button
                  onClick={handleRedeem}
                  disabled={isRedeeming || !redeemCode.trim()}
                  className="w-full h-11 text-base font-semibold bg-gradient-to-r from-[#00CFFF] to-[#0099CC] hover:from-[#00B8E6] hover:to-[#0088BB] text-white shadow-lg hover:shadow-[0_0_20px_rgba(0,207,255,0.4)] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                >
                  {isRedeeming ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Activating License...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Redeem License
                    </div>
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center italic">
                  License keys are case-sensitive and can only be activated once
                  per account.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trial Offer Section */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-900/40 via-slate-900/50 to-teal-900/40 backdrop-blur-xl border border-[#00FF7F]/30 shadow-2xl hover:shadow-[0_0_30px_rgba(0,255,127,0.2)] transition-all duration-500 group animate-slide-up-delay-2">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00FF7F]/10 via-transparent to-[#00CFFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="text-center relative pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-[#00FF7F]/20 to-emerald-600/20 rounded-full">
                    <Gift className="h-8 w-8 text-[#00FF7F] animate-bounce" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                  </div>
                </div>
              </div>

              <CardTitle className="text-2xl lg:text-3xl font-bold mb-3">
                <span className="bg-gradient-to-r from-[#00FF7F] via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,127,0.3)]">
                  🎁 Claim Your 3-Day Free Trial
                </span>
              </CardTitle>

              <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                Unlock Atomic Shield's premium protection completely free — no
                credit card required.
              </p>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              {/* Countdown Timer */}
              <div className="bg-gradient-to-r from-red-900/30 via-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-lg p-4 border border-red-500/30">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-orange-400 animate-pulse" />
                    <span className="text-orange-300 font-semibold text-base">
                      Offer expires in:
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="relative">
                        <div className="text-2xl font-bold text-red-400 bg-red-500/20 rounded-lg px-3 py-2 min-w-[60px] border border-red-500/30">
                          {timeRemaining.hours.toString().padStart(2, "0")}
                        </div>
                        <div className="absolute inset-0 bg-red-400/20 rounded-lg animate-pulse" />
                      </div>
                      <div className="text-xs text-red-300 mt-2 font-medium">
                        Hours
                      </div>
                    </div>

                    <div className="text-red-400 text-xl font-bold animate-pulse">
                      :
                    </div>

                    <div className="text-center">
                      <div className="relative">
                        <div className="text-2xl font-bold text-red-400 bg-red-500/20 rounded-lg px-3 py-2 min-w-[60px] border border-red-500/30">
                          {timeRemaining.minutes.toString().padStart(2, "0")}
                        </div>
                        <div className="absolute inset-0 bg-red-400/20 rounded-lg animate-pulse" />
                      </div>
                      <div className="text-xs text-red-300 mt-2 font-medium">
                        Minutes
                      </div>
                    </div>

                    <div className="text-red-400 text-xl font-bold animate-pulse">
                      :
                    </div>

                    <div className="text-center">
                      <div className="relative">
                        <div className="text-2xl font-bold text-red-400 bg-red-500/20 rounded-lg px-3 py-2 min-w-[60px] border border-red-500/30">
                          {timeRemaining.seconds.toString().padStart(2, "0")}
                        </div>
                        <div className="absolute inset-0 bg-red-400/20 rounded-lg animate-pulse" />
                      </div>
                      <div className="text-xs text-red-300 mt-2 font-medium">
                        Seconds
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Claim Trial Button */}
              <div className="text-center">
                <Button
                  onClick={handleTrialClaim}
                  disabled={isRedeeming}
                  className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-[#00FF7F] to-emerald-500 hover:from-[#00E66F] hover:to-emerald-400 text-slate-900 shadow-2xl hover:shadow-[0_0_30px_rgba(0,255,127,0.5)] transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                >
                  {isRedeeming ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                      Activating Trial...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Claim My 3-Day Trial
                    </div>
                  )}
                </Button>
              </div>

              {/* Benefits Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[#00FF7F]/10 rounded-lg border border-[#00FF7F]/20 hover:bg-[#00FF7F]/15 transition-all duration-300">
                  <div className="flex justify-center mb-3">
                    <Shield className="h-6 w-6 text-[#00FF7F]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#00FF7F] mb-2">
                    Full Protection
                  </h3>
                  <p className="text-xs text-slate-400">
                    Complete anti-cheat coverage for your server
                  </p>
                </div>

                <div className="text-center p-4 bg-[#00FF7F]/10 rounded-lg border border-[#00FF7F]/20 hover:bg-[#00FF7F]/15 transition-all duration-300">
                  <div className="flex justify-center mb-3">
                    <Star className="h-6 w-6 text-[#00FF7F]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#00FF7F] mb-2">
                    Premium Features
                  </h3>
                  <p className="text-xs text-slate-400">
                    Access to all advanced tools and analytics
                  </p>
                </div>

                <div className="text-center p-4 bg-[#00FF7F]/10 rounded-lg border border-[#00FF7F]/20 hover:bg-[#00FF7F]/15 transition-all duration-300">
                  <div className="flex justify-center mb-3">
                    <Calendar className="h-6 w-6 text-[#00FF7F]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#00FF7F] mb-2">
                    3 Days Access
                  </h3>
                  <p className="text-xs text-slate-400">
                    Full trial period with no restrictions
                  </p>
                </div>
              </div>

              {/* Urgency Note */}
              <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-orange-300 italic">
                    <strong>Hurry! Limited time offer.</strong> Your trial key
                    expires in 48 hours after being issued.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-slide-up-delay-2 {
          animation: slide-up 0.8s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
}
