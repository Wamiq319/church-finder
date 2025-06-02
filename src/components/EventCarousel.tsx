"use client";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowRight,
} from "lucide-react";
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
  console.log("Banners:", banners);
  return (
    <div className="relative mb-12 rounded-xl overflow-hidden shadow-lg">
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
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {banners[current].title}
            </h2>
            <div className="flex justify-center gap-6 mb-4">
              <span className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-1" />
                {banners[current].date}
              </span>
              <span className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                {banners[current].location}
              </span>
            </div>
            <Button
              variant="primary"
              rounded
              className="px-8 py-3 text-lg"
              onClick={() => router.push(`/events/${banners[current].slug}`)}
            >
              View Event Details <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <button
        onClick={() =>
          setCurrent((current - 1 + banners.length) % banners.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        onClick={() => setCurrent((current + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>
      <div className="absolute bottom-4 w-full flex justify-center space-x-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full ${
              i === current ? "bg-white w-6" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
