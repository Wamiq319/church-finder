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

import contentData from "@/data/content.json";
import { Button, ComingSoonPopup } from "@/components";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Event } from "@/types";
import { Loader } from "@/components";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [church, setChurch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const content = contentData.eventDetailPage;

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/events/frontend?type=single&eventId=${params.slug}`
        );
        const data = await res.json();
        if (data.success) {
          setEvent(data.data);
          // Church data is already populated from the API
          if (data.data.church) {
            setChurch(data.data.church);
          }
        } else {
          console.error("Failed to fetch event:", data.message);
          setEvent(null);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading event..." />
      </div>
    );
  }

  if (!event) {
    return notFound();
  }

  // Removed Google Maps logic
  // const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  //   event.location
  // )}`;
  // const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  //   event.location
  // )}&z=15&output=embed&t=m`;

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
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
              {event.title}
              {event.featured && (
                <span className="ml-3 bg-yellow-400 text-xs font-bold px-2 py-1 rounded shadow">
                  Featured
                </span>
              )}
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
              {content.aboutTitle}
            </h2>
            <p className="text-[#555] leading-relaxed">{event.description}</p>
          </div>

          {/* Event Details Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <Calendar className="text-[#7FC242] mr-2" />
              {content.eventDetailsTitle}
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Clock3 className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#555] font-medium">{event.date}</p>
                  <p className="text-[#555]">{event.time}</p>
                </div>
              </li>
              {/* Location as text only */}
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-[#555]">
                  {event.address || "Location not specified"}
                </p>
              </li>
              {church && (
                <li className="flex items-start">
                  <Church className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-[#555]">{church.name}</p>
                </li>
              )}
            </ul>
          </div>

          {/* Location Section - now just text */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <MapPin className="text-[#7FC242] mr-2" />
              {content.locationTitle}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-[#555]">
                  {event.address || "Location not specified"}
                </p>
              </div>
              {/* Google Maps Embed and Button removed */}
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
                {content.hostChurchTitle}
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
                  <Button variant="outline" className="w-full mt-2">
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
              {content.timingTitle}
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
              <h3 className="text-xl font-bold">{content.registerTitle}</h3>
            </div>

            <p className="mb-4">{content.registerDescription}</p>

            <ul className="mb-4 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{content.registerBenefit1}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{content.registerBenefit2}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{content.registerBenefit3}</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                variant="secondary"
                rounded
                className=""
                onClick={() => router.push("/dashboard/create-event")}
              >
                List Your Event
                <ArrowRight className="ml-2" />
              </Button>
            </div>

            <p className="text-xs mt-2 text-center text-blue-100">
              {content.registerFree}
            </p>
          </div>
        </div>
      </div>

      <ComingSoonPopup show={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}
