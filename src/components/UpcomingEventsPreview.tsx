"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  slug: string;
}

const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Youth Revival Conference",
    date: "June 15, 2025",
    location: "Abuja, Nigeria",
    image: "/assets/images/churches/youth-revival.jpg",
    slug: "youth-revival-abuja",
  },
  {
    id: "2",
    title: "Praise & Worship Night",
    date: "June 22, 2025",
    location: "Lagos, Nigeria",
    image: "/assets/images/churches/youth-revival2.jpg",
    slug: "praise-worship-night",
  },
  {
    id: "3",
    title: "Community Outreach Program",
    date: "July 5, 2025",
    location: "Port Harcourt, Nigeria",
    image: "/assets/images/churches/youth-revival.jpg",
    slug: "community-outreach-ph",
  },
];

export const UpcomingEventsPreview = () => {
  const t = useTranslations("Events");
  const router = useRouter();

  return (
    <section className="py-16 bg-[#f2fcf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A365D] mb-2">
            {t("upcomingEvents")}
          </h2>
          <p className="text-[#555] max-w-2xl mx-auto">
            {t("upcomingEventsSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
              onClick={() => router.push(`/events/${event.slug}`)}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1A365D] mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-[#555]">
                    <CalendarDays className="h-4 w-4 mr-2 text-[#7FC242]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-[#555]">
                    <MapPin className="h-4 w-4 mr-2 text-[#7FC242]" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <button className="mt-4 flex items-center text-[#7FC242] hover:text-[#5A7D2C] transition-colors">
                  {t("viewDetails")}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push("/events")}
            className="px-8 py-3 bg-[#7FC242] hover:bg-[#5A7D2C] text-white rounded-lg transition-colors duration-300 inline-flex items-center"
          >
            {t("seeAllEvents")}
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};
