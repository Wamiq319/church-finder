"use client";

import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Event } from "@/types";

export const EventCarousel = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/events/frontend?type=featured");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setEvents(data.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching featured events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedEvents();
  }, []);

  const banners =
    events.length > 0
      ? events
      : [
          {
            image: "/assets/images/churches/youth-revival.jpg",
            title: "No Featured Events",
            date: "Coming Soon",
            address: "Stay tuned for upcoming events",
            slug: "#",
          },
        ];

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (loading) {
    return (
      <div className="relative mb-12 rounded-xl overflow-hidden shadow-lg">
        <div className="h-64 md:h-80 w-full bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400">Loading featured events...</div>
        </div>
      </div>
    );
  }

  const currentEvent = banners[current];
  const imageUrl =
    currentEvent.image || "/assets/images/churches/youth-revival.jpg";

  return (
    <div className="relative mb-12 rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-64 md:h-80 w-full">
        <Image
          width={1200}
          height={400}
          src={imageUrl}
          alt={currentEvent.title}
          className="w-full h-full object-cover"
          priority={current === 0}
        />
        <div className="absolute inset-0  flex items-center justify-center px-6">
          <div className="max-w-2xl text-center text-white">
            <Button
              variant="primary"
              rounded
              className="px-6 py-2 md:px-8 md:py-3 text-sm md:text-lg"
              onClick={() => router.push(`/events/${currentEvent.slug}`)}
            >
              View Event Details <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation dots - only show if more than one event */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 cursor-pointer w-full flex justify-center space-x-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                i === current ? "bg-white w-6" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
