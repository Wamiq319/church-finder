// components/PricingSection.tsx
"use client";

import { CheckCircle, Star, Zap } from "lucide-react";
import { Button } from "./Button";
import { useRouter } from "next/navigation";

export function PricingSection() {
  const router = useRouter();

  const plans = [
    {
      name: "Basic Listing",
      price: "Free",
      features: [
        "Church profile page",
        "Basic event listings",
        "Map location",
        "Standard visibility",
      ],
      cta: "Included",
      popular: false,
    },
    {
      name: "Featured Church",
      price: "$49/week",
      features: [
        "Homepage spotlight",
        "Priority in search results",
        "Verified badge",
        "3x more visibility",
        "Featured for 7 days",
      ],
      cta: "Upgrade Now",
      popular: true,
    },
    {
      name: "Premium Package",
      price: "$99/week",
      features: [
        "All Featured benefits",
        "3 featured event slots included",
        "Social media promotion",
        "5x more visibility",
        "Priority support",
      ],
      cta: "Get Premium",
      popular: false,
    },
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Boost Your Visibility
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your needs and get more visitors to your
          church and events
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative border rounded-xl p-6 transition-all hover:shadow-lg ${
              plan.popular
                ? "border-[#7FC242] ring-1 ring-[#7FC242] transform md:-translate-y-2"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#7FC242] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                <Star className="h-3 w-3 mr-1" /> MOST POPULAR
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {plan.name}
            </h3>
            <p className="text-2xl font-bold mb-4">
              {plan.price}
              {plan.price !== "Free" && (
                <span className="text-sm font-normal text-gray-500">/week</span>
              )}
            </p>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? "primary" : "outline"}
              className={`w-full ${plan.popular ? "shadow-md" : ""}`}
              onClick={() => router.push("/dashboard/pricing")}
            >
              {plan.cta}
              {plan.popular && <Zap className="h-4 w-4 ml-2 fill-current" />}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-600 mb-4">
          Need a custom plan for multiple churches or events?
        </p>
        <Button
          variant="outline"
          className="border-[#7FC242] text-[#7FC242] hover:bg-[#F0F7EA]"
          onClick={() => router.push("/contact")}
        >
          Contact Us for Bulk Pricing
        </Button>
      </div>
    </div>
  );
}
