"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Church {
  id: string;
  name: string;
  location: string;
  image: string;
  slug: string;
}

const featuredChurches: Church[] = [
  {
    id: "1",
    name: "St. Andrew's Anglican Church",
    location: "Lagos, Nigeria",

    image: "/assets/images/churches/st-andrews.jpg",
    slug: "st-andrews-anglican-church",
  },
  {
    id: "2",
    name: "Redeemed Christian Church of God",
    location: "Abuja, Nigeria",
    image: "/assets/images/churches/st-andrews2.jpg",
    slug: "rccg-abuja",
  },
  {
    id: "3",
    name: "Living Faith Church (Winners Chapel)",
    location: "Port Harcourt, Nigeria",
    image: "/assets/images/churches/st-andrews.jpg",
    slug: "living-faith-ph",
  },
  {
    id: "4",
    name: "Catholic Church of Divine Mercy",
    location: "Enugu, Nigeria",
    image: "/assets/images/churches/st-andrews2.jpg",
    slug: "divine-mercy-enugu",
  },
  {
    id: "5",
    name: "Mountain of Fire and Miracles",
    location: "Ibadan, Nigeria",
    image: "/assets/images/churches/st-andrews.jpg",
    slug: "mfm-ibadan",
  },
  {
    id: "6",
    name: "Deeper Life Bible Church",
    location: "Kano, Nigeria",
    image: "/assets/images/churches/st-andrews2.jpg",
    slug: "deeper-life-kano",
  },
];
export const FeaturedChurches = () => {
  const t = useTranslations("HomePage.featured");
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    if (!carouselRef.current) return;

    const carousel = carouselRef.current;
    let animationFrameId: number;
    let scrollAmount = 0;
    const scrollSpeed = 0.8;

    const autoScroll = () => {
      if (carousel.scrollWidth > carousel.clientWidth) {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= carousel.scrollWidth / 2) {
          scrollAmount = 0;
          carousel.scrollLeft = 0;
        }
        carousel.scrollLeft = scrollAmount;
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    const startScrolling = () => {
      if (!isDragging) {
        autoScroll();
      }
    };

    startScrolling();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging]);

  // Mouse/touch handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-16 bg-[#f8f8f8]">
      <div className="w-full mx-auto  ">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A365D] mb-8 text-center">
          {t("title")}
        </h2>
        <p className="text-center text-[#555] max-w-2xl mx-auto mb-12">
          {t("subtitle")}
        </p>

        {/* Single Carousel (no duplicate grid) */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden w-[100%] "
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div className="flex space-x-6 py-2">
            {featuredChurches.map((church) => (
              <div
                key={church.id}
                className="min-w-[280px] md:min-w-[320px] bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
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
                  <h3 className="text-lg font-bold text-[#1A365D]">
                    {church.name}
                  </h3>
                  <p className="text-sm text-[#555] mt-1 flex items-center">
                    <LocationIcon />
                    {church.location}
                  </p>
                  <button
                    onClick={() => router.push(`/churches/${church.slug}`)}
                    className="mt-4 w-full py-2 bg-[#7FC242] hover:bg-[#5A7D2C] text-white rounded-md transition-colors duration-300"
                  >
                    {t("viewDetails")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
