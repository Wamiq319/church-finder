"use client";

import { HeroSection } from "@/components/home/Hero";
import { FeaturedChurches } from "@/components/home/FeaturedChurches";
import { UpcomingEventsPreview } from "@/components/home/UpcomingEventsPreview";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ListYourChurchCTA } from "@/components/home/ListYourChurchCTA";
import { TestimonialsSection } from "@/components/home/Testimonial";

export default function HomePage() {
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
