import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { PaymentMethodModal } from "./PaymentMethodModal";

interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  link: string;
  gradient: string;
}

const plans: PricingPlan[] = [
  {
    name: "Basic",
    price: 40,
    period: "month",
    description: "Perfect for small servers and testing",
    features: [
      "Basic anti-cheat protection",
      "Up to 32 players",
      "Email support",
      "Basic reporting",
      "1 server license",
    ],
    icon: <Zap className="w-6 h-6" />,
    link: "https://buy.polar.sh/polar_cl_zgpZfocRnCm5gWMCSI42pewz4ATn3W1GUgW5T1pp3cK",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Pro",
    price: 80,
    period: "month",
    description: "Advanced protection for growing communities",
    features: [
      "Advanced anti-cheat system",
      "Up to 128 players",
      "Priority support",
      "Advanced analytics",
      "3 server licenses",
      "Custom integrations",
      "Real-time monitoring",
    ],
    popular: true,
    icon: <Star className="w-6 h-6" />,
    link: "https://buy.polar.sh/polar_cl_YoZtBkBxAiuBMBlue4X48XmIMf7VuBsse1oDB0jkIWH",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Enterprise",
    price: 250,
    period: "month",
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
    ],
    icon: <Crown className="w-6 h-6" />,
    link: "https://buy.polar.sh/polar_cl_Q2KXM8Z2kOQ13ig6oq57QLMwqyg0xyBbOg5Gr2BYL1A",
    gradient: "from-orange-500 to-red-500",
  },
];

export function PricingSection() {
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
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Secure your server with the most advanced anti-cheat technology.
              Start protecting your community today.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`
                  relative p-8 border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl
                  ${
                    plan.popular
                      ? "border-purple-500/50 bg-gradient-to-b from-purple-900/20 to-gray-950/50 shadow-purple-500/20"
                      : "border-gray-700/50 bg-gradient-to-b from-gray-800/20 to-gray-950/50"
                  }
                  backdrop-blur-xl
                `}
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: "fadeInUp 0.8s ease-out forwards",
                }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-6 py-1">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <div
                    className={`
                    w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                    bg-gradient-to-r ${plan.gradient}
                  `}
                  >
                    <div className="text-white">{plan.icon}</div>
                  </div>

                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-400 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={feature}
                        className="flex items-start space-x-3"
                        style={{
                          animationDelay: `${index * 200 + featureIndex * 100}ms`,
                          animation: "fadeInLeft 0.6s ease-out forwards",
                        }}
                      >
                        <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    className={`
                      w-full h-12 text-lg font-semibold transition-all duration-300
                      ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/25"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                      }
                      hover:scale-105 hover:shadow-xl
                    `}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-6">
              Need a custom solution? Contact our enterprise team.
            </p>
            <Button
              variant="outline"
              className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Modal */}
      {selectedPlan && (
        <PaymentMethodModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
