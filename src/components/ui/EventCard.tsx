import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./Button";
interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  slug: string;
}

interface EventCardProps {
  event: Event;
  className?: string;
}

export const EventCard = ({ event, className = "" }: EventCardProps) => {
  const router = useRouter();
  const t = useTranslations("Common");

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer ${className}`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#1A365D] mb-3">{event.title}</h3>
        <div className="space-y-2">
          <div className="flex items-center text-[#555]">
            <CalendarDays className="h-4 w-4 mr-2 text-[#7FC242]" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-[#555]">
            <MapPin className="h-4 w-4 mr-2 text-[#7FC242]" />
            <span>{event.location}</span>
          </div>
        </div>

        <Button
          onClick={() => router.push(`/events/${event.slug}`)}
          variant="outline"
          className="mt-4 w-full py-2 flex items-center justify-center"
        >
          {t("viewDetails")}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
