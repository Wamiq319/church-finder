import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Church } from "@/types/church.type";

export const ChurchCard = ({
  church,
  className = "",
}: {
  church: Church;
  className?: string;
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 flex flex-col ${className}`}
    >
      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
        <Image
          src={church.image || "/assets/images/churches/st-andrews.jpg"}
          alt={church.name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-[#1A365D] mb-1">{church.name}</h3>
      <div className="flex items-center text-[#7FC242] mb-2">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-sm text-[#555]">{church.location}</span>
      </div>
      <p className="text-sm text-[#555] mb-4 line-clamp-2">
        {church.description}
      </p>
      <Link
        href={`/churches/${church.slug}`}
        className="mt-auto inline-block text-[#2D9C6F] hover:underline font-semibold text-sm"
      >
        View Details
      </Link>
    </div>
  );
};
