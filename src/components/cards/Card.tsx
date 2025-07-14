import Image from "next/image";
import { ReactNode } from "react";

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
}: CardProps) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 flex flex-col cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
    >
      <div
        className={`relative w-full ${imageHeight} rounded-lg overflow-hidden mb-4`}
      >
        <Image src={image} alt={imageAlt} fill className="object-cover" />
      </div>

      <h3 className="text-lg font-bold text-[#1A365D] mb-1">{title}</h3>

      {metadata && metadata.length > 0 && (
        <div className="space-y-2 mb-4">
          {metadata.map((item, index) => (
            <div key={index} className="flex items-center text-[#7FC242]">
              <span className="mr-1">{item.icon}</span>
              <span className="text-sm text-[#555]">{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {description && (
        <p className="text-sm text-[#555] mb-4 line-clamp-2">{description}</p>
      )}

      {onClick && (
        <button
          className="mt-auto inline-block text-[#2D9C6F] hover:underline font-semibold text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};
