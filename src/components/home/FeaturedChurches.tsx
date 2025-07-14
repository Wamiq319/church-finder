"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import content from "@/data/content.json";
import { Card } from "@/components";
import { MapPin } from "lucide-react";
import { Church } from "@/types";

export const FeaturedChurches = () => {
  const featured = content.HomePage.featured;
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [autoScrollActive, setAutoScrollActive] = useState(false);

  // Fetch top 5 featured churches only once
  useEffect(() => {
    let isMounted = true;
    const fetchFeaturedChurches = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/churches/frontend?type=featured&limit=5");
        const data = await res.json();
        if (isMounted) {
          if (data.success && data.data) {
            setChurches(data.data);
          } else {
            setError("No featured churches found.");
          }
        }
      } catch (err) {
        if (isMounted) setError("Failed to load featured churches.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchFeaturedChurches();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll effect (only after data is loaded and if scrollable)
  useEffect(() => {
    if (loading || error || !carouselRef.current || churches.length < 2) return;
    const carousel = carouselRef.current;
    if (carousel.scrollWidth <= carousel.clientWidth) return;
    let animationFrameId: number;
    let scrollAmount = carousel.scrollLeft;
    const scrollSpeed = 0.8;
    let stopped = false;
    setAutoScrollActive(true);
    const autoScroll = () => {
      if (stopped) return;
      if (carousel.scrollWidth > carousel.clientWidth) {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
          scrollAmount = 0;
        }
        carousel.scrollLeft = scrollAmount;
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };
    if (!isDragging) autoScroll();
    return () => {
      stopped = true;
      setAutoScrollActive(false);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loading, error, isDragging, churches]);

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
        {loading ? (
          <div className="flex justify-center items-center min-h-[120px]">
            Loading...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[120px] text-red-500">
            {error}
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="relative overflow-hidden w-[100%]"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <div className="flex space-x-6 py-2">
              {churches.map((church) => (
                <Card
                  key={church.slug}
                  image={
                    church.image || "/assets/images/churches/st-andrews.jpg"
                  }
                  imageAlt={church.name}
                  title={church.name}
                  description={church.description}
                  metadata={[
                    {
                      icon: <MapPin className="h-4 w-4 text-[#7FC242]" />,
                      text: `${church.city}, ${church.state}`,
                    },
                  ]}
                  isFeatured={church.isFeatured}
                  onClick={() => router.push(`/churches/${church.slug}`)}
                  className="min-w-[280px] md:min-w-[320px]"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
