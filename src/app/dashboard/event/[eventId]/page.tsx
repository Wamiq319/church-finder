"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Event } from "@/types";
import { Loader, Button, ClientOnly, EventFeaturedDetail } from "@/components";
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

export default function DashboardEventPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const eventId = params.eventId as string;

  useEffect(() => {
    async function fetchEvent() {
      if (!eventId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/events?eventId=${eventId}`, {
          credentials: "include",
        });
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

  const handleDeleteEvent = async () => {
    if (
      !event ||
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(
        `/api/events?eventId=${(event as any)._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader text="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8">
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
      <div className="max-w-7xl mx-auto px-4 md:px-8">
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

        {/* Event Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details (left, 2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Event Image */}
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
                <img
                  src={
                    event.image || "/assets/images/churches/youth-revival.jpg"
                  }
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
                      <p className="font-semibold text-gray-800">
                        {event.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

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
            </div>
          </div>

          {/* Sidebar (right, 1/3) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 py-3"
                  onClick={() => {
                    const churchId =
                      typeof event.church === "object" && event.church !== null
                        ? (event.church as any)._id ||
                          (event.church as any).toString()
                        : String(event.church);
                    router.push(
                      `/dashboard/create-event?churchId=${churchId}&eventId=${
                        (event as any)._id || ""
                      }`
                    );
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Edit Event
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-red-600 border-red-300 hover:bg-red-50 py-3"
                  onClick={handleDeleteEvent}
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? "Deleting..." : "Delete Event"}
                </Button>
              </div>
            </div>

            {/* Event Featured Detail */}
            <EventFeaturedDetail
              isFeatured={event.featured || false}
              featuredUntil={event.featuredUntil}
              eventId={(event as any)._id}
              onGetFeaturedClick={() => {
                const churchId =
                  typeof event.church === "object" && event.church !== null
                    ? (event.church as any)._id ||
                      (event.church as any).toString()
                    : String(event.church);
                router.push(
                  `/dashboard/create-event?churchId=${churchId}&eventId=${
                    (event as any)._id || ""
                  }&step=2`
                );
              }}
            />
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
