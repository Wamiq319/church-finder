import { Event as EventType } from "@/types";
import { Card, Loader } from "@/components";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";

export function EventsList({
  churchId,
  onEventCountChange,
}: {
  churchId: string;
  onEventCountChange?: (count: number) => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch(`/api/events?action=list&churchId=${churchId}`);
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
          if (onEventCountChange) onEventCountChange(data.data.length);
        }
      } catch {
        setEvents([]);
        if (onEventCountChange) onEventCountChange(0);
      }
      setLoading(false);
    }
    if (churchId) fetchEvents();
  }, [churchId, onEventCountChange]);

  const handleEventClick = (event: EventType) => {
    router.push(`/dashboard/event/${event.slug}`);
  };

  if (loading) return <Loader text="Loading events..." />;
  if (!events.length)
    return <div className="text-gray-500">No events found.</div>;

  return (
    <div className="flex flex-row gap-4 overflow-x-auto pb-2">
      {events.map((event) => (
        <div
          key={event.slug}
          onClick={() => handleEventClick(event)}
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 min-w-[280px] max-w-xs"
        >
          <Card
            image={event.image || "/assets/images/churches/youth-revival.jpg"}
            imageAlt={event.title}
            title={event.title}
            description={event.description}
            metadata={[
              {
                icon: <CalendarDays className="h-4 w-4" />,
                text: event.date,
              },
              {
                icon: <MapPin className="h-4 w-4" />,
                text: event.address || "Location TBA",
              },
            ]}
            onClick={() => handleEventClick(event)}
            imageHeight="h-32"
          />
        </div>
      ))}
    </div>
  );
}
