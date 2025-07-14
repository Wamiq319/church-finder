"use client";

import { CheckCircle, Star, Zap, Clock, X } from "lucide-react";
import { Button } from "@/components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ComingSoonPopup } from "../features/ComingSoon";

export const PricingSection = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

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
    <div className="py-16 md:py-24">
      {" "}
      {/* Increased y-padding */}
      <ComingSoonPopup show={showPopup} onClose={() => setShowPopup(false)} />
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Boost Your Visibility
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Choose the plan that fits your needs and get more visitors to your
          church and events
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 sm:px-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative border rounded-xl p-8 transition-all hover:shadow-lg ${
              plan.popular
                ? "border-[#7FC242] ring-1 ring-[#7FC242] transform md:-translate-y-2 bg-gradient-to-b from-[#7FC242]/5 to-white"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#7FC242] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                <Star className="h-3 w-3 mr-1 fill-current" /> MOST POPULAR
              </div>
            )}

            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {plan.name}
            </h3>
            <p className="text-3xl font-bold mb-6">
              {plan.price}
              {plan.price !== "Free" && (
                <span className="text-base font-normal text-gray-500">
                  /week
                </span>
              )}
            </p>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? "primary" : "outline"}
              className={`w-full py-3 text-lg ${
                plan.popular ? "shadow-md hover:shadow-lg" : ""
              }`}
              onClick={() => setShowPopup(true)}
            >
              {plan.cta}
              {plan.popular && <Zap className="h-5 w-5 ml-2 fill-current" />}
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4 text-lg">
          Need a custom plan for multiple churches or events?
        </p>
        <Button
          variant="outline"
          className="border-[#7FC242] text-[#7FC242] hover:bg-[#F0F7EA] text-lg px-8 py-3"
          onClick={() => setShowPopup(true)}
        >
          Contact Us for Bulk Pricing
        </Button>
      </div>
    </div>
  );
};
