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
        if (data.success) {
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
            image: null,
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

  return (
    <div className="relative mb-12 rounded-xl overflow-hidden shadow-lg">
      {/* Green bar at the top */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#7FC242] z-10"></div>

      <div className="relative h-64 md:h-80 w-full">
        {banners[current].image ? (
          <Image
            width={1200}
            height={400}
            src={banners[current].image}
            alt={banners[current].title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white flex flex-col items-center justify-center">
            <CalendarDays className="w-16 h-16 text-gray-300 mb-4" />
            <span className="text-gray-400 text-lg">No Event Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center px-6">
          <div className="max-w-2xl text-center text-white">
            <h2 className="text-xl md:text-3xl font-bold mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {banners[current].title}
            </h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-6 mb-4 whitespace-nowrap">
              <span className="flex items-center text-sm md:text-base">
                <CalendarDays className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                {banners[current].date}
              </span>
              <span className="flex items-center text-sm md:text-base">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                {banners[current].address || "Location TBD"}
              </span>
            </div>
            <Button
              variant="primary"
              rounded
              className="px-6 py-2 md:px-8 md:py-3 text-sm md:text-lg"
              onClick={() => router.push(`/events/${banners[current].slug}`)}
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
