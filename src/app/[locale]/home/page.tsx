"use client";

import { useState } from "react";
import { HeroSection } from "@/components/Hero";
import { Globe, ShieldCheck, Cpu } from "lucide-react";
import { useTranslations } from "next-intl";
import { FeaturedChurches } from "@/components/FeaturedChurches";
import { UpcomingEventsPreview } from "@/components/UpcomingEventsPreview";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ListYourChurchCTA } from "@/components/ListYourChurchCTA";
import { TestimonialsSection } from "@/components/Testimonial";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <main>
      <HeroSection />
      <FeaturedChurches />
      <UpcomingEventsPreview />
      <HowItWorksSection />
      <ListYourChurchCTA />
      <TestimonialsSection />
    </main>
  );
}
