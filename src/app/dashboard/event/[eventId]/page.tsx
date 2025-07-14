"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Event } from "@/types";
import { EventDetail } from "../../component/EventDetail";
import { Loader, Button, ClientOnly } from "@/components";
import { ArrowLeft } from "lucide-react";

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

        <EventDetail event={event} churchId={event.church.toString()} />
      </div>
    </ClientOnly>
  );
}
