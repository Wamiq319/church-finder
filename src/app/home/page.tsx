"use client";

import {
  HeroSection,
  FeaturedChurches,
  UpcomingEventsPreview,
  HowItWorksSection,
  ListYourChurchCTA,
  TestimonialsSection,
} from "@/components";

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
