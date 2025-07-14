"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Event } from "@/types";
import { Loader, Button, ClientOnly } from "@/components";
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  MapPin,
  Edit,
  Eye,
} from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

export default function DashboardEventPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventId = params.eventId as string;

  useEffect(() => {
    async function fetchEvent() {
      if (!eventId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/events?eventId=${eventId}`);
        const data = await response.json();

        if (data.success) {
          setEvent(data.data);
        } else {
          setError(data.message || "Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.id) {
      fetchEvent();
    }
  }, [eventId, session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader text="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Event Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The event you're looking for doesn't exist."}
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="primary"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader text="Loading..." />
        </div>
      }
    >
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Inlined EventDetail JSX */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Event Image */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
            <img
              src={event.image || "/assets/images/churches/youth-revival.jpg"}
              alt={event.title}
              style={{ objectFit: "cover" }}
              className="object-cover w-full h-full"
            />
            {event.featured && (
              <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Star className="h-4 w-4" />
                Featured
              </div>
            )}
          </div>

          {/* Event Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {event.title}
          </h1>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-[#7FC242]" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(event.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-[#7FC242]" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-semibold text-gray-800">{event.time}</p>
              </div>
            </div>

            {event.address && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                <MapPin className="h-5 w-5 text-[#7FC242]" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-800">{event.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Event Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Featured Status */}
          {event.featured && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">
                  Featured Event
                </span>
              </div>
              <p className="text-sm text-green-700">
                Featured until:{" "}
                {event.featuredUntil
                  ? formatDate(event.featuredUntil)
                  : "next week"}
              </p>
            </div>
          )}

          {/* Event Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {event.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex items-center gap-2"
              onClick={() =>
                router.push(
                  `/dashboard/create-event?churchId=${event.church.toString()}&eventId=${
                    (event as any)._id || ""
                  }`
                )
              }
            >
              <Edit className="h-4 w-4" />
              Edit Event
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => router.push(`/events/${event.slug}`)}
            >
              <Eye className="h-4 w-4" />
              View Public Page
            </Button>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
