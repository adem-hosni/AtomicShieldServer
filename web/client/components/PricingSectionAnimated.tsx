import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Sparkles } from "lucide-react";
import { PaymentMethodModal } from "./PaymentMethodModal";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  link: string;
  gradient: string;
  badge?: string;
}

const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 45,
    period: "month",
    description: "Perfect for small servers and testing",
    features: [
      "Basic anti-cheat protection",
      "Up to 32 players",
      "Email support",
      "Basic reporting",
      "1 server license",
      "Community Discord access",
    ],
    icon: <Zap className="w-6 h-6" />,
    link: "https://buy.polar.sh/polar_cl_zgpZfocRnCm5gWMCSI42pewz4ATn3W1GUgW5T1pp3cK",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "pro",
    name: "Pro",
    price: 89,
    period: "month",
    originalPrice: 129,
    description: "Advanced protection for growing communities",
    features: [
      "Advanced anti-cheat system",
      "Up to 128 players",
      "Priority support",
      "Advanced analytics",
      "3 server licenses",
      "Custom integrations",
      "Real-time monitoring",
      "API access",
      "Custom rules engine",
    ],
    popular: true,
    badge: "Most Popular",
    icon: <Star className="w-6 h-6" />,
    link: "https://buy.polar.sh/polar_cl_YoZtBkBxAiuBMBlue4X48XmIMf7VuBsse1oDB0jkIWH",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    period: "month",
    originalPrice: 299,
    description: "Maximum security for large networks",
    features: [
      "Military-grade protection",
      "Unlimited players",
      "24/7 dedicated support",
      "Custom development",
      "Unlimited server licenses",
      "White-label solution",
      "API access",
      "Advanced machine learning",
      "Custom deployment",
      "SLA guarantee",
      "Priority feature requests",
    ],
    badge: "Enterprise",
    icon: <Crown className="w-6 h-6" />,
    link: "https://buy.polar.sh/polar_cl_Q2KXM8Z2kOQ13ig6oq57QLMwqyg0xyBbOg5Gr2BYL1A",
    gradient: "from-orange-500 to-red-500",
  },
];

export function PricingSectionAnimated() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <>
      <section
        id="pricing"
        className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.08)_1px,transparent_1px)] bg-[size:60px_60px] animate-grid-move" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 backdrop-blur-xl border border-cyan-400/20 rounded-full px-6 py-3 mb-6 group hover:border-cyan-400/40 transition-all duration-300">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span className="text-sm font-medium text-cyan-400">
                Choose Your Protection Level
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent mb-6">
              Pricing Plans
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Secure your server with the most advanced anti-cheat technology.
              Start protecting your community today with our cutting-edge
              solutions.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan, index) => (
              <Card
                key={plan.id}
                className={`
                  relative group transition-all duration-700 hover:scale-105 cursor-pointer
                  ${
                    plan.popular
                      ? "border-2 border-purple-500/50 bg-gradient-to-b from-purple-900/30 to-gray-950/80 shadow-2xl shadow-purple-500/20 z-10"
                      : "border border-gray-700/50 bg-gradient-to-b from-gray-800/30 to-gray-950/80 hover:border-cyan-400/50"
                  }
                  backdrop-blur-xl overflow-hidden
                `}
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: "fade-in-up 0.8s ease-out forwards",
                }}
                onClick={() => handleSelectPlan(plan)}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${plan.gradient} blur-xl -z-10`}
                />

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-6 py-2 text-sm font-semibold animate-bounce">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  {/* Icon */}
                  <div
                    className={`
                    w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center
                    bg-gradient-to-r ${plan.gradient} group-hover:scale-110 transition-transform duration-300
                  `}
                  >
                    <div className="text-white animate-pulse">{plan.icon}</div>
                  </div>

                  {/* Plan Name */}
                  <CardTitle className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {plan.name}
                  </CardTitle>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-2">
                      {plan.originalPrice && (
                        <span className="text-2xl text-gray-500 line-through">
                          ${plan.originalPrice}
                        </span>
                      )}
                      <span className="text-5xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                        ${plan.price}
                      </span>
                      <span className="text-gray-400 ml-2">/{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
                        <span className="text-green-400 text-sm font-medium">
                          Save ${plan.originalPrice - plan.price}/month
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mt-4">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6 px-8 pb-8">
                  {/* Features */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={feature}
                        className="flex items-start space-x-3 group-hover:text-cyan-300 transition-colors"
                        style={{
                          animationDelay: `${index * 200 + featureIndex * 100}ms`,
                          animation: "fade-in-left 0.6s ease-out forwards",
                        }}
                      >
                        <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0 group-hover:text-cyan-300 transition-colors" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className={`
                      w-full h-12 text-lg font-semibold transition-all duration-500 group-hover:scale-105
                      ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                      }
                      hover:shadow-2xl transform-gpu
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan);
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>

                {/* Hover Glow Border */}
                <div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r ${plan.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`}
                />
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            className="text-center mt-16 animate-fade-in-up"
            style={{ animationDelay: "1s" }}
          >
            <p className="text-gray-400 mb-6 text-lg">
              Need a custom solution? Contact our enterprise team for tailored
              pricing.
            </p>
            <Button
              variant="outline"
              className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 px-8 py-3 text-lg font-medium backdrop-blur-xl"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {selectedPlan && (
        <PaymentMethodModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
        />
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }

        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
}
