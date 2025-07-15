"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Card, Button, Loader } from "@/components";
import content from "@/data/content.json";
import { Event } from "@/types";

export const UpcomingEventsPreview = () => {
  const upcomingEvents = content.HomePage.upcomingEvents;
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/events/frontend?type=upcoming");
        const result = await response.json();

        if (result.success) {
          setEvents(result.data);
        } else {
          setError("Failed to load upcoming events");
        }
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        setError("Failed to load upcoming events");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  if (loading) {
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
          <div className="flex justify-center">
            <Loader />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
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
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

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

        {events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Card
                  key={event._id}
                  image={
                    event.image || "/assets/images/churches/youth-revival.jpg"
                  }
                  imageAlt={event.title}
                  title={event.title}
                  description={event.description}
                  metadata={[
                    {
                      icon: <CalendarDays className="h-4 w-4" />,
                      text: event.date,
                    },
                    {
                      icon: <MapPin className="h-4 w-4" />,
                      text: event.address || "Location TBA",
                    },
                  ]}
                  onClick={() => router.push(`/events/${event.slug}`)}
                  imageHeight="h-32"
                />
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
          </>
        ) : (
          <div className="text-center">
            <p className="text-[#555] text-lg">
              No upcoming events at the moment. Check back soon!
            </p>
            <div className="mt-8">
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
        )}
      </div>
    </section>
  );
};
