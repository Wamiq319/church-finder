"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components";
import { ArrowRight } from "lucide-react";
import { Event } from "@/types";

export const UpcomingEventsSidebar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/events/frontend?type=upcoming");
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-[#1A365D] mb-4 flex items-center">
        <CalendarDays className="text-[#7FC242] mr-2" />
        Upcoming Events
      </h3>
      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-gray-400 text-sm">No upcoming events</div>
        ) : (
          events.map((event) => (
            <Link
              key={event._id}
              href={`/events/${event.slug}`}
              className="block border-b pb-4 last:border-b-0 last:pb-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <h4 className="font-medium text-[#1A365D]">{event.title}</h4>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <CalendarDays className="h-3 w-3 mr-1" />
                <span>{event.date}</span>
              </div>
            </Link>
          ))
        )}
      </div>
      <Link href="/events" className="block w-full">
        <Button variant="outline" className="w-full mt-4">
          View All Events
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};
