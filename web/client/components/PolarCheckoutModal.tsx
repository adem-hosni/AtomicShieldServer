import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Smartphone,
  X,
  Check,
  Building2,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PolarCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
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
  fullWidth = false,
}: {
  icon: React.ReactNode;
  name: string;
  isSelected: boolean;
  onClick: () => void;
  delay?: number;
  fullWidth?: boolean;
}) => (
  <div
    className={`
      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 
      transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20
      ${
        isSelected
          ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20"
          : "border-gray-600/50 bg-gray-800/30 hover:border-cyan-400/50"
      }
      ${fullWidth ? "col-span-full" : ""}
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

export function PolarCheckoutModal({
  isOpen,
  onClose,
  plan,
}: PolarCheckoutModalProps) {
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
      icon: (
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
          <span className="text-xs font-bold text-blue-600">G</span>
        </div>
      ),
      delay: 200,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: (
        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">P</span>
        </div>
      ),
      delay: 300,
    },
    {
      id: "crypto",
      name: "Crypto",
      icon: (
        <div className="w-6 h-6 text-orange-400">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z" />
            <path d="M12.65 10.2c.2-1.33-.815-2.045-2.205-2.525l.45-1.805-1.1-.275-.44 1.76c-.29-.07-.59-.14-.88-.21l.44-1.77-1.1-.28-.45 1.81c-.24-.055-.475-.11-.7-.17l0-.01-1.52-.38-.29 1.17s.81.19.8.2c.445.11.525.4.51.63l-.51 2.055c.03.007.07.018.115.035l-.12-.03-.72 2.88c-.055.135-.195.34-.51.26.01.015-.8-.2-.8-.2l-.55 1.26 1.44.36c.27.07.53.14.79.205l-.455 1.83 1.1.275.45-1.815c.3.08.59.155.87.225l-.45 1.8 1.1.275.455-1.825c1.875.355 3.285.21 3.88-1.475.48-1.36-.025-2.145-1.005-2.66.715-.165 1.254-.635 1.4-1.605zm-2.5 3.5c-.34 1.365-2.64.625-3.385.44l.605-2.425c.745.185 3.135.55 2.78 1.985zm.34-3.52c-.31 1.24-2.23.61-2.85.455l.548-2.195c.62.155 2.625.445 2.302 1.74z" />
          </svg>
        </div>
      ),
      delay: 400,
    },
    {
      id: "vietnam-bank",
      name: "Việt Nam Bank",
      icon: <Building2 className="w-6 h-6 text-red-400" />,
      delay: 500,
      fullWidth: true,
    },
  ];

  const handlePurchase = () => {
    if (!acceptedTos || !email) return;

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

  const getCurrencySymbol = () => {
    switch (plan.id) {
      case "basic":
        return "£";
      default:
        return "$";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-950/98 border border-cyan-400/20 backdrop-blur-2xl p-0 overflow-hidden">
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

          .glow-animation {
            animation: glow 2s ease-in-out infinite;
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-2xl font-bold text-cyan-400 tracking-wide">
            {plan.name.toUpperCase()}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Email Input */}
          <div
            className="space-y-3"
            style={{ animation: "fadeInUp 0.6s ease-out forwards" }}
          >
            <label
              htmlFor="email"
              className="text-base font-medium text-cyan-400"
            >
              E-Mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-cyan-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-600/50 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 h-12 text-base"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-cyan-400">
              Payment method
            </h3>

            {/* Top row - 3 methods */}
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

            {/* Middle row - 2 methods */}
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

            {/* Bottom row - 1 full width method */}
            <div className="grid grid-cols-1">
              <PaymentMethod
                icon={paymentMethods[5].icon}
                name={paymentMethods[5].name}
                isSelected={selectedPayment === paymentMethods[5].id}
                onClick={() => setSelectedPayment(paymentMethods[5].id)}
                delay={paymentMethods[5].delay}
                fullWidth={true}
              />
            </div>
          </div>

          {/* Total */}
          <div
            className="flex justify-between items-center p-4 bg-gray-900/30 rounded-xl border border-cyan-400/20"
            style={{ animation: "fadeInUp 0.6s ease-out 0.6s both" }}
          >
            <span className="text-lg font-medium text-cyan-400">Total</span>
            <span className="text-2xl font-bold text-cyan-400">
              {getCurrencySymbol()}
              {plan.price}
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
              bg-gradient-to-r from-cyan-400 to-blue-500 
              hover:from-cyan-300 hover:to-blue-400
              disabled:from-gray-600 disabled:to-gray-700
              disabled:cursor-not-allowed text-white
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
