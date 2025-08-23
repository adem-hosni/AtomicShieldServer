import React from "react";
import { Button } from "@/components/ui/button";

export function PricingSectionTest() {
  return (
    <section id="pricing" className="py-24 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-cyan-400 mb-8">Pricing Plans</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Basic</h3>
            <div className="text-3xl font-bold text-cyan-400 mb-4">$45</div>
            <Button
              onClick={() =>
                window.open(
                  "https://buy.polar.sh/polar_cl_zgpZfocRnCm5gWMCSI42pewz4ATn3W1GUgW5T1pp3cK",
                  "_blank",
                )
              }
              className="w-full bg-cyan-500 hover:bg-cyan-400"
            >
              Get Basic
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gray-800 p-8 rounded-lg border border-purple-500">
            <h3 className="text-xl font-bold text-white mb-4">Pro</h3>
            <div className="text-3xl font-bold text-purple-400 mb-4">$89</div>
            <Button
              onClick={() =>
                window.open(
                  "https://buy.polar.sh/polar_cl_YoZtBkBxAiuBMBlue4X48XmIMf7VuBsse1oDB0jkIWH",
                  "_blank",
                )
              }
              className="w-full bg-purple-500 hover:bg-purple-400"
            >
              Get Pro
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Enterprise</h3>
            <div className="text-3xl font-bold text-orange-400 mb-4">$199</div>
            <Button
              onClick={() =>
                window.open(
                  "https://buy.polar.sh/polar_cl_Q2KXM8Z2kOQ13ig6oq57QLMwqyg0xyBbOg5Gr2BYL1A",
                  "_blank",
                )
              }
              className="w-full bg-orange-500 hover:bg-orange-400"
            >
              Get Enterprise
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
