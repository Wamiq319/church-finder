"use client";
import React from "react";
import { Search, Info, MessageCircle, MapPin } from "lucide-react";
import content from "@/data/content.json";

export const HowItWorksSection = () => {
  const howItWorks = content.HomePage.howItWorks;

  const steps: {
    icon: React.ReactNode;
    key: keyof typeof howItWorks.steps;
    bgColor: string;
  }[] = [
    {
      icon: <Search className="h-10 w-10 text-[#7FC242]" />,
      key: "search",
      bgColor: "bg-[#F0FAF5]",
    },
    {
      icon: <Info className="h-10 w-10 text-[#7FC242]" />,
      key: "viewDetails",
      bgColor: "bg-[#F5F9FF]",
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-[#7FC242]" />,
      key: "connect",
      bgColor: "bg-[#FEF6F0]",
    },
    {
      icon: <MapPin className="h-10 w-10 text-[#7FC242]" />,
      key: "visit",
      bgColor: "bg-[#F8F0FE]",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A365D] mb-3">
            {howItWorks.title}
          </h2>
          <p className="text-lg text-[#555] max-w-2xl mx-auto">
            {howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className="group relative flex flex-col items-center text-center p-8 rounded-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-white border border-gray-200 rounded-xl shadow-sm group-hover:shadow-md transition-all" />

              <div
                className={`relative mb-6 h-20 w-20 rounded-full ${step.bgColor} flex items-center justify-center`}
              >
                <div className="absolute -top-2 -left-2 h-24 w-24 rounded-full border-2 border-[#7FC242] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {step.icon}
                <span className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#1A365D] text-white flex items-center justify-center font-bold">
                  {index + 1}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#1A365D] mb-3 relative">
                {howItWorks.steps[step.key].title}
              </h3>
              <p className="text-[#555] relative">
                {howItWorks.steps[step.key].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
