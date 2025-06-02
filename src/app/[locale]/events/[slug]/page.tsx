"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Calendar,
  User,
  ArrowRight,
  PlusCircle,
  BookOpen,
  Clock3, 
  Church,
} from "lucide-react";
import eventsData from "@/data/events.json";
import churchesData from "@/data/churches.json";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useParams } from 'next/navigation';

export default function EventDetailPage() {
  const params = useParams();
  const event = eventsData.find((e) => e.slug === params.slug);
  const t = useTranslations("eventDetailPage");

  if (!event) {
    return notFound();
  }

  // Find the church by churchId
  const church = churchesData.find((c) => c.id === event.churchId);

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.location
  )}`;

  const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    event.location
  )}&z=15&output=embed&t=m`;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Event Header with Image */}
      <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden shadow-lg mb-8">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {event.title}
            </h1>
            {church && (
              <p className="text-white/90 mt-2">Hosted by: {church.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* About Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <BookOpen className="text-[#7FC242] mr-2" />
              {t("aboutTitle")}
            </h2>
            <p className="text-[#555] leading-relaxed">{event.description}</p>
          </div>

          {/* Event Details Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <Calendar className="text-[#7FC242] mr-2" />
              {t("eventDetailsTitle")}
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Clock3 className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#555] font-medium">{event.date}</p>
                  <p className="text-[#555]">{event.time}</p>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-[#555]">{event.location}</p>
              </li>
              {church && (
                <li className="flex items-start">
                  <Church className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-[#555]">{church.name}</p>
                </li>
              )}
            </ul>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <MapPin className="text-[#7FC242] mr-2" />
              {t("locationTitle")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-[#555]">{event.location}</p>
              </div>
              {/* Google Maps Embed */}
              <div className="h-64 w-full rounded-lg mt-4 overflow-hidden border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={mapsEmbedUrl}
                  allowFullScreen
                  aria-hidden="false"
                  tabIndex={0}
                ></iframe>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => window.open(mapsSearchUrl, "_blank")}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {t("openInMaps")}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          {/* Church Info Section */}
          {church && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
                <Church className="text-[#7FC242] mr-2" />
                {t("hostChurchTitle")}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Church className="h-5 w-5 text-[#7FC242] mr-2" />
                  <span className="text-[#555]">{church.name}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[#555]">{church.address}</p>
                    <p className="text-[#555]">
                      {church.city}, {church.state}
                    </p>
                  </div>
                </div>
                {church.pastor && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-[#7FC242] mr-2" />
                    <span className="text-[#555]">{church.pastor.name}</span>
                  </div>
                )}
                <Link href={`/churches/${church.slug}`}>
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <Church className="h-4 w-4 mr-2" />
                    View Church Details
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Event Timing */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <Clock className="text-[#7FC242] mr-2" />
              {t("timingTitle")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-[#7FC242] mr-2" />
                <span className="text-[#555]">{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-[#7FC242] mr-2" />
                <span className="text-[#555]">{event.time}</span>
              </div>
            </div>
          </div>

          {/* Registration CTA */}
          <div className="bg-gradient-to-r from-[#1A365D] to-[#2C5282] rounded-xl p-6 text-white">
            <div className="flex items-center mb-3">
              <PlusCircle className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-bold">
                Get More Attendees For Your Event
              </h3>
            </div>

            <p className="mb-4">
              Join hundreds of churches and organizations reaching thousands of
              believers through our platform.
            </p>

            <ul className="mb-4 space-y-3">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span className="font-medium">Reach a wider audience</span> -
                Get your event in front of our active community
              </li>

              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span className="font-medium">Free promotion</span> - Featured
                in our newsletters and social media
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link href="/events/create">
                <Button
                  variant="secondary"
                  rounded
                  className=""
                >
                  List Your Event
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>

              <Link href={`/register-event/${event.slug}`}>
                <Button
                  variant="outline"
                  rounded
                  className=" text-white hover:text-[#1A365D] border-white hover:bg-white/90"
                >
                  Attend This Event
                </Button>
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-xs text-blue-100">Have questions?</span>
              <a
                href="/contact"
                className="text-xs font-medium underline hover:text-white"
              >
                Contact our events team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
