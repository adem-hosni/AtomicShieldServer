import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: number;
    link: string;
  };
}

export function PricingModalSimple({
  isOpen,
  onClose,
  plan,
}: PricingModalProps) {
  const [email, setEmail] = useState("");

  const handlePurchase = () => {
    window.open(plan.link, "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-950 border-cyan-400/20">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-cyan-400">
              {plan.name.toUpperCase()}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              ${plan.price}/month
            </div>
          </div>

          <div>
            <label className="text-sm text-cyan-400 mb-2 block">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          <Button
            onClick={handlePurchase}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white"
          >
            Buy Now - ${plan.price}
          </Button>

          <div className="text-center text-sm text-gray-400">
            Powered by Polar.sh
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
