"use client";

import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function EventCarousel({ events }: { events: any[] }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const banners =
    events.length > 0
      ? [...events, ...events].slice(0, 3)
      : [
          {
            image: "https://via.placeholder.com/1200x400?text=Event",
            title: "Sample Event",
            date: "June 1, 2025",
            location: "Nigeria",
            slug: "#",
          },
        ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="relative mb-12 rounded-xl overflow-hidden shadow-lg">
      {/* Green bar at the top */}
      <div className="absolute top-0 left-0 right-0 h-2  z-10"></div>

      <div className="relative h-64 md:h-80 w-full">
        <Image
          width={1200}
          height={400}
          src={banners[current].image}
          alt={banners[current].title}
          className="w-full h-full object-cover"
        />
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
                {banners[current].location}
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

      {/* Navigation dots */}
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
    </div>
  );
}
