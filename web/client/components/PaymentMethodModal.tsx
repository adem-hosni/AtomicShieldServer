import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  X,
  CreditCard,
  Smartphone,
  Bitcoin,
  Building2,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSellAuthEmbed } from "@/hooks/useSellAuthEmbed";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: number;
    link: string;
  };
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
  popular?: boolean;
  disabled?: boolean;
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  plan,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const { toast } = useToast();
  const {
    checkout,
    isLoading: sellAuthLoading,
    modal: sellAuthModal,
    captcha,
  } = useSellAuthEmbed();

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Credit Card",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "apple",
      name: "Apple Pay",
      icon: (
        <div className="w-5 h-5 bg-black rounded text-white flex items-center justify-center">
          <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        </div>
      ),
    },
    {
      id: "google",
      name: "Google Pay",
      icon: (
        <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-red-500 rounded text-white flex items-center justify-center text-xs font-bold">
          G
        </div>
      ),
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: (
        <div className="w-5 h-5 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
          P
        </div>
      ),
    },
    {
      id: "crypto",
      name: "Crypto",
      icon: <Bitcoin className="w-5 h-5 text-orange-500" />,
      description: "Bitcoin, Ethereum, USDC",
    },
    {
      id: "vietnam-bank",
      name: "Việt Nam Bank",
      icon: (
        <div className="w-5 h-5 bg-red-600 rounded text-white flex items-center justify-center text-xs font-bold">
          <Building2 className="w-3 h-3" />
        </div>
      ),
      description: "Vietnamese Banking System",
    },
  ];

  // Animation effect when modal opens
  useEffect(() => {
    if (isOpen) {
      setAnimationStep(0);
      const timer1 = setTimeout(() => setAnimationStep(1), 100);
      const timer2 = setTimeout(() => setAnimationStep(2), 300);
      const timer3 = setTimeout(() => setAnimationStep(3), 500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  const handlePurchase = async () => {
    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service",
        variant: "destructive",
      });
      return;
    }

    // Handle Vietnam Bank payments - Show notification and redirect to Discord
    if (selectedMethod === "vietnam-bank") {
      toast({
        title: "Việt Nam Bank Payment",
        description:
          "Please open a ticket in our Discord server to complete the payment process.",
      });

      // Redirect to Discord after a short delay
      setTimeout(() => {
        window.open("https://discord.gg/ucWAMN3m", "_blank");
        onClose();
      }, 1500);
      return;
    }

    // Handle SellAuth payments for Crypto and PayPal
    if (["crypto", "paypal"].includes(selectedMethod)) {
      // Get the appropriate product IDs based on plan
      const getSellAuthData = () => {
        // Test with the previous working configuration first to isolate the issue
        console.log("Plan name:", plan.name.toLowerCase());
        switch (plan.name.toLowerCase()) {
          case "basic":
            return { productId: 422775, variantId: 611772 }; // Revert to working config
          case "pro":
            return { productId: 423016, variantId: 612230 };
          case "enterprise":
            return { productId: 423017, variantId: 612231 };
          default:
            return { productId: 423017, variantId: 612231 };
        }
      };

      const { productId, variantId } = getSellAuthData();

      try {
        await checkout({
          cart: [{ productId, variantId, quantity: 1 }],
          shopId: 171908,
          modal: true,
          scrollTop: true,
        });

        toast({
          title: "Payment Initiated",
          description: `Opening ${paymentMethods.find((m) => m.id === selectedMethod)?.name} checkout...`,
        });

        onClose();
      } catch (error) {
        console.error("SellAuth checkout error:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : "No stack trace",
          productId,
          variantId,
          planName: plan.name,
        });

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to initiate payment. Please try again.";

        toast({
          title: "Payment Failed",
          description: `${errorMessage}. Redirecting to alternative checkout...`,
          variant: "destructive",
        });

        // Fallback to plan link if SellAuth fails
        setTimeout(() => {
          window.open(plan.link, "_blank");
          onClose();
        }, 2000);
      }
      return;
    }

    setIsProcessing(true);

    // Get the appropriate URL based on plan and payment method for Polar
    const getPolarUrl = () => {
      if (["card", "apple", "google"].includes(selectedMethod)) {
        switch (plan.name.toLowerCase()) {
          case "basic":
            return "https://buy.polar.sh/polar_cl_zgpZfocRnCm5gWMCSI42pewz4ATn3W1GUgW5T1pp3cK";
          case "pro":
            return "https://buy.polar.sh/polar_cl_YoZtBkBxAiuBMBlue4X48XmIMf7VuBsse1oDB0jkIWH";
          case "enterprise":
            return "https://buy.polar.sh/polar_cl_Q2KXM8Z2kOQ13ig6oq57QLMwqyg0xyBbOg5Gr2BYL1A";
          default:
            return plan.link;
        }
      }
      return plan.link;
    };

    // Simulate payment processing for other methods
    setTimeout(() => {
      toast({
        title: "Payment Initiated",
        description: `Redirecting to ${paymentMethods.find((m) => m.id === selectedMethod)?.name} checkout...`,
      });

      // Redirect to the appropriate URL
      window.open(getPolarUrl(), "_blank");
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-900/90 backdrop-blur-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/20 overflow-hidden">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-400/5 pointer-events-none" />
        <div className="relative z-10">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-bold text-cyan-400 tracking-wider">
                {plan.name.toUpperCase()}
              </DialogTitle>
              {plan.name === "PRO" && (
                <Badge
                  className={cn(
                    "bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 animate-pulse",
                    "transition-all duration-500",
                    animationStep >= 1
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95",
                  )}
                >
                  POPULAR
                </Badge>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6 px-1">
            {/* Payment Methods */}
            <div
              className={cn(
                "space-y-3 transition-all duration-500 ease-out",
                animationStep >= 2
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <label className="text-sm font-medium text-cyan-400">
                Payment method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method, index) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    disabled={method.disabled}
                    className={cn(
                      "relative flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 group",
                      "hover:scale-[1.02] active:scale-[0.98] transform-gpu",
                      selectedMethod === method.id
                        ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20 ring-1 ring-cyan-400/20"
                        : "border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50 hover:shadow-md hover:shadow-slate-900/20",
                      method.disabled && "opacity-50 cursor-not-allowed",
                      // Staggered animation
                      animationStep >= 2
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4",
                    )}
                    style={{
                      transitionDelay:
                        animationStep >= 2 ? `${index * 50}ms` : "0ms",
                    }}
                  >
                    {method.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 animate-pulse shadow-lg shadow-purple-500/25 border border-purple-400/20">
                        Popular
                      </Badge>
                    )}

                    <div className="flex-shrink-0 text-cyan-400">
                      {method.icon}
                    </div>

                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
                        {method.name}
                      </div>
                      {method.description && (
                        <div className="text-xs text-slate-400 mt-1">
                          {method.description}
                        </div>
                      )}
                    </div>

                    {selectedMethod === method.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-slate-900" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Total */}
            <div
              className={cn(
                "flex items-center justify-between py-4 border-t border-slate-700",
                "transition-all duration-500 ease-out",
                animationStep >= 3
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <span className="text-lg font-medium text-white">Total</span>
              <span className="text-2xl font-bold text-cyan-400">
                {formatPrice(plan.price)}
              </span>
            </div>

            {/* Terms Checkbox */}
            <div
              className={cn(
                "flex items-start space-x-3",
                "transition-all duration-500 ease-out",
                animationStep >= 3
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
              style={{ transitionDelay: animationStep >= 3 ? "100ms" : "0ms" }}
            >
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked as boolean)
                }
                className="border-slate-600 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400"
              />
              <label
                htmlFor="terms"
                className="text-xs text-slate-400 leading-5 cursor-pointer"
              >
                By clicking "Buy now" you agree to our{" "}
                <a
                  href="/tos"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Terms of Service
                </a>
              </label>
            </div>

            {/* Buy Button */}
            <Button
              onClick={handlePurchase}
              disabled={isProcessing || sellAuthLoading || !agreedToTerms}
              className={cn(
                "w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500",
                "hover:from-cyan-400 hover:to-blue-400 text-white font-semibold",
                "shadow-lg shadow-cyan-400/25 hover:shadow-xl hover:shadow-cyan-400/30",
                "transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                animationStep >= 3
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
              style={{ transitionDelay: animationStep >= 3 ? "200ms" : "0ms" }}
            >
              {isProcessing || sellAuthLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {sellAuthLoading ? "Preparing checkout..." : "Processing..."}
                </div>
              ) : (
                `Buy now`
              )}
            </Button>

            {/* Footer */}
            <div
              className={cn(
                "text-center text-xs text-slate-500 pb-2",
                "transition-all duration-500 ease-out",
                animationStep >= 3
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
              style={{ transitionDelay: animationStep >= 3 ? "300ms" : "0ms" }}
            >
              Powered by{" "}
              <span className="text-cyan-400 font-medium">Polar.sh</span>
              {" & "}
              <span className="text-cyan-400 font-medium">SellAuth</span>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* SellAuth Integration */}
      {captcha}
      {sellAuthModal}
    </Dialog>
  );
}
