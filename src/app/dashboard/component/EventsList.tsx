import { Event } from "@/types";
import { EventCard } from "@/components/ui/EventCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/Loader";

export function EventsList({ churchId }: { churchId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch(`/api/events?action=list&churchId=${churchId}`);
        const data = await res.json();
        if (data.success) setEvents(data.data);
      } catch {
        setEvents([]);
      }
      setLoading(false);
    }
    if (churchId) fetchEvents();
  }, [churchId]);

  const handleEventClick = (event: Event) => {
    router.push(`/dashboard/event/${event._id}`);
  };

  if (loading) return <Loader text="Loading events..." />;
  if (!events.length)
    return <div className="text-gray-500">No events found.</div>;

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event._id?.toString() || event.slug}
          onClick={() => handleEventClick(event)}
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
        >
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}
