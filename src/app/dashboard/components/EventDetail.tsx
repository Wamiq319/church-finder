import { Event } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import Image from "next/image";
import { Star, Calendar, MapPin, Clock, Edit, Eye } from "lucide-react";
import { Button } from "@/components";
import Link from "next/link";

interface EventDetailProps {
  event: Event;
  churchId: string;
}

export function EventDetail({ event, churchId }: EventDetailProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Event Image */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
        <Image
          src={event.image || "/assets/images/churches/youth-revival.jpg"}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
        {event.featured && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star className="h-4 w-4" />
            Featured
          </div>
        )}
      </div>

      {/* Event Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{event.title}</h1>

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
            <span className="font-semibold text-green-800">Featured Event</span>
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
        <Link
          href={`/dashboard/create-event?churchId=${churchId}&eventId=${
            (event as any)._id || ""
          }`}
        >
          <Button variant="primary" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Event
          </Button>
        </Link>

        <Link href={`/events/${event.slug}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Public Page
          </Button>
        </Link>
      </div>
    </div>
  );
}
