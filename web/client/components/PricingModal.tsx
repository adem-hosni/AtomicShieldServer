import React, { useState } from "react";
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
  CreditCard,
  Smartphone,
  X,
  Check,
  Building2,
  Bitcoin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: number;
    link: string;
  };
}

const PaymentMethod = ({
  icon,
  name,
  isSelected,
  onClick,
  delay = 0,
}: {
  icon: React.ReactNode;
  name: string;
  isSelected: boolean;
  onClick: () => void;
  delay?: number;
}) => (
  <div
    className={`
      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 
      transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20
      ${
        isSelected
          ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20"
          : "border-gray-700 bg-gray-800/50 hover:border-cyan-400/50"
      }
    `}
    onClick={onClick}
    style={{
      animationDelay: `${delay}ms`,
      animation: "fadeInUp 0.6s ease-out forwards",
    }}
  >
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`
        transition-colors duration-300
        ${isSelected ? "text-cyan-400" : "text-gray-400"}
      `}
      >
        {icon}
      </div>
      <span
        className={`
        text-sm font-medium transition-colors duration-300
        ${isSelected ? "text-cyan-400" : "text-gray-300"}
      `}
      >
        {name}
      </span>
    </div>
    {isSelected && (
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center animate-bounce">
        <Check className="w-3 h-3 text-gray-900" />
      </div>
    )}
  </div>
);

export function PricingModal({ isOpen, onClose, plan }: PricingModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("credit-card");
  const [acceptedTos, setAcceptedTos] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: "credit-card",
      name: "Credit Card",
      icon: <CreditCard className="w-6 h-6" />,
      delay: 0,
    },
    {
      id: "apple-pay",
      name: "Apple Pay",
      icon: <Smartphone className="w-6 h-6" />,
      delay: 100,
    },
    {
      id: "google-pay",
      name: "Google Pay",
      icon: <span className="text-xl font-bold">G</span>,
      delay: 200,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <span className="text-lg font-bold text-blue-500">P</span>,
      delay: 300,
    },
    {
      id: "crypto",
      name: "Crypto",
      icon: <Bitcoin className="w-6 h-6" />,
      delay: 400,
    },
    {
      id: "vietnam-bank",
      name: "Việt Nam Bank",
      icon: <Building2 className="w-6 h-6" />,
      delay: 500,
    },
  ];

  const handlePurchase = () => {
    if (!acceptedTos) return;

    // Handle Vietnam Bank payments - Show notification and redirect to Discord
    if (selectedPayment === "vietnam-bank") {
      setIsProcessing(true);
      toast({
        title: "Việt Nam Bank Payment",
        description: "Please open a ticket in our Discord server to complete the payment process.",
      });

      // Redirect to Discord after a short delay
      setTimeout(() => {
        window.open("https://discord.gg/ucWAMN3m", "_blank");
        setIsProcessing(false);
        onClose();
      }, 1500);
      return;
    }

    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      window.open(plan.link, "_blank");
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-950/95 border-cyan-400/20 backdrop-blur-xl">
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes glow {
            0%,
            100% {
              box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
            }
            50% {
              box-shadow: 0 0 30px rgba(6, 182, 212, 0.6);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
          }

          .glow-animation {
            animation: glow 2s ease-in-out infinite;
          }

          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
        `}</style>

        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {plan.name.toUpperCase()}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Email Input */}
          <div
            className="space-y-2"
            style={{ animation: "fadeInUp 0.6s ease-out forwards" }}
          >
            <label
              htmlFor="email"
              className="text-sm font-medium text-cyan-400"
            >
              E-Mail
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
              <div className="absolute inset-y-0 left-3 flex items-center">
                <svg
                  className="w-4 h-4 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-400">
              Payment method
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.slice(0, 3).map((method) => (
                <PaymentMethod
                  key={method.id}
                  icon={method.icon}
                  name={method.name}
                  isSelected={selectedPayment === method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  delay={method.delay}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.slice(3, 5).map((method) => (
                <PaymentMethod
                  key={method.id}
                  icon={method.icon}
                  name={method.name}
                  isSelected={selectedPayment === method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  delay={method.delay}
                />
              ))}
            </div>
            <div className="grid grid-cols-1">
              <PaymentMethod
                icon={paymentMethods[5].icon}
                name={paymentMethods[5].name}
                isSelected={selectedPayment === paymentMethods[5].id}
                onClick={() => setSelectedPayment(paymentMethods[5].id)}
                delay={paymentMethods[5].delay}
              />
            </div>
          </div>

          {/* Total */}
          <div
            className="flex justify-between items-center p-4 bg-gray-900/50 rounded-xl border border-cyan-400/20"
            style={{ animation: "fadeInUp 0.6s ease-out 0.6s both" }}
          >
            <span className="text-lg font-medium text-gray-300">Total</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ${plan.price}
            </span>
          </div>

          {/* Terms of Service */}
          <div
            className="flex items-start space-x-3"
            style={{ animation: "fadeInUp 0.6s ease-out 0.7s both" }}
          >
            <Checkbox
              id="tos"
              checked={acceptedTos}
              onCheckedChange={setAcceptedTos}
              className="border-gray-600 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400 mt-1"
            />
            <label
              htmlFor="tos"
              className="text-sm text-gray-400 leading-relaxed cursor-pointer"
            >
              By clicking "Buy now" you agree to our{" "}
              <a
                href="/tos"
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              >
                Terms of Service
              </a>
              .
            </label>
          </div>

          {/* Buy Button */}
          <Button
            onClick={handlePurchase}
            disabled={!acceptedTos || !email || isProcessing}
            className={`
              w-full h-12 text-lg font-semibold transition-all duration-300
              bg-gradient-to-r from-cyan-500 to-blue-500 
              hover:from-cyan-400 hover:to-blue-400
              disabled:from-gray-600 disabled:to-gray-700
              disabled:cursor-not-allowed
              ${acceptedTos && email ? "glow-animation" : ""}
            `}
            style={{ animation: "fadeInUp 0.6s ease-out 0.8s both" }}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Buy now"
            )}
          </Button>

          {/* Powered by */}
          <div
            className="text-center text-sm text-gray-500"
            style={{ animation: "fadeInUp 0.6s ease-out 0.9s both" }}
          >
            Powered by{" "}
            <span className="text-cyan-400 font-medium">Polar.sh</span>
            {selectedPayment !== "credit-card" && (
              <>
                {" • "}
                <span className="text-cyan-400 font-medium">
                  {selectedPayment === "crypto"
                    ? "Blockchain Networks"
                    : selectedPayment === "vietnam-bank"
                      ? "Vietnamese Banking System"
                      : selectedPayment === "paypal"
                        ? "PayPal"
                        : selectedPayment === "apple-pay"
                          ? "Apple Pay"
                          : "Google Pay"}
                </span>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
