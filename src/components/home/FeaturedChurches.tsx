"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChurchCard } from "@/components/ui/ChurchCard";
import churches from "@/data/churches.json";
import content from "@/data/content.json";

export const FeaturedChurches = () => {
  const featured = content.HomePage.featured;
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
      <div className="w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A365D] mb-8 text-center">
          {featured.title}
        </h2>
        <p className="text-center text-[#555] max-w-2xl mx-auto mb-12">
          {featured.subtitle}
        </p>

        <div
          ref={carouselRef}
          className="relative overflow-hidden w-[100%]"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div className="flex space-x-6 py-2">
            {churches.map((church) => (
              <ChurchCard
                key={church.id}
                church={church}
                className="min-w-[280px] md:min-w-[320px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
