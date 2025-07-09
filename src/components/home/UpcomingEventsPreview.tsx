"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { EventCard } from "@/components/ui/EventCard";
import { Button } from "../ui/Button";
import events from "@/data/events.json";
import content from "@/data/content.json";

export const UpcomingEventsPreview = () => {
  const upcomingEvents = content.HomePage.upcomingEvents;
  const router = useRouter();

  return (
    <section className="py-16 bg-[#f2fcf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A365D] mb-2">
            {upcomingEvents.upcomingEventsTitle}
          </h2>
          <p className="text-[#555] max-w-2xl mx-auto">
            {upcomingEvents.upcomingEventsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/events")}
            className="px-8 py-3 text-base rounded-md border-2"
          >
            {upcomingEvents.seeAllEvents}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
