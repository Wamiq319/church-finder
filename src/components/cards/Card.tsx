import Image from "next/image";
import { ReactNode } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

interface MetadataItem {
  icon: ReactNode;
  text: string;
}

interface CardProps {
  image: string;
  imageAlt: string;
  title: string;
  description?: string;
  metadata?: MetadataItem[];
  onClick?: () => void;
  buttonText?: string;
  className?: string;
  imageHeight?: string;
  isFeatured?: boolean;
  slug?: string;
}

export const Card = ({
  image,
  imageAlt,
  title,
  description,
  metadata,
  onClick,
  buttonText = "View Details",
  className = "",
  imageHeight = "h-40",
  isFeatured = false,
  slug,
}: CardProps) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (slug) {
      window.location.href = `/churches/${slug}`;
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 flex flex-col cursor-pointer hover:shadow-lg transition-shadow relative ${className}`}
      onClick={handleCardClick}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
          <Star className="h-3 w-3 fill-current" />
          Featured
        </div>
      )}

      <div
        className={`relative w-full ${imageHeight} rounded-lg overflow-hidden mb-4`}
      >
        <Image src={image} alt={imageAlt} fill className="object-cover" />
      </div>

      <h3 className="text-lg font-bold text-[#1A365D] mb-1 line-clamp-1">
        {title}
      </h3>

      {metadata && metadata.length > 0 && (
        <div className="space-y-2 mb-4">
          {metadata.map((item, index) => (
            <div key={index} className="flex items-center text-[#7FC242]">
              <span className="mr-1">{item.icon}</span>
              <span className="text-sm text-[#555] line-clamp-1">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {description && (
        <p className="text-sm text-[#555] mb-4 line-clamp-2">{description}</p>
      )}

      <button
        className="mt-auto inline-block text-[#2D9C6F] hover:underline font-semibold text-sm"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) {
            onClick();
          } else if (slug) {
            window.location.href = `/churches/${slug}`;
          }
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};
