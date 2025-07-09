import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Event } from "@/types/church.type";

export const EventCard = ({ event }: { event: Event }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col">
      <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4">
        <Image
          src={event.image || "/assets/images/churches/youth-revival.jpg"}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-[#1A365D] mb-1">{event.title}</h3>
      <div className="flex items-center text-[#7FC242] mb-2">
        <CalendarDays className="h-4 w-4 mr-1" />
        <span className="text-sm text-[#555]">{event.date}</span>
      </div>
      <div className="flex items-center text-[#7FC242] mb-2">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-sm text-[#555]">{event.location}</span>
      </div>
      <p className="text-sm text-[#555] mb-4 line-clamp-2">
        {event.description}
      </p>
      <Link
        href={`/events/${event.slug}`}
        className="mt-auto inline-block text-[#2D9C6F] hover:underline font-semibold text-sm"
      >
        View Details
      </Link>
    </div>
  );
};
