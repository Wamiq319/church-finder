import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./Button";
import { ArrowRight } from "lucide-react";

interface Church {
  id: string;
  name: string;
  location: string;
  image: string;
  slug: string;
}

interface ChurchCardProps {
  church: Church;
  className?: string;
}

export const ChurchCard = ({ church, className = "" }: ChurchCardProps) => {
  const router = useRouter();
  const t = useTranslations("Common");

  return (
    <div
      className={`bg-white cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex-shrink-0 ${className}`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={church.image}
          alt={church.name}
          fill
          className="rounded-t-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#1A365D]">{church.name}</h3>
        <p className="text-sm text-[#555] mt-1 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {church.location}
        </p>
        <Button
          onClick={() => router.push(`/churches/${church.slug}`)}
          className="mt-4 w-full py-2 bg-[#7FC242] hover:bg-[#5A7D2C] text-white rounded-md transition-colors duration-300"
        >
          {t("viewDetails")}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
