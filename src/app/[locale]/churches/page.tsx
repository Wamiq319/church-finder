"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import churchesData from "@/data/churches.json";
import events from "@/data/events.json";
import { ChurchCard } from "@/components/ui/ChurchCard";
import { GridWithPagination } from "@/components/GridWithPagination";
import { EventCarousel } from "@/components/EventCarousel";
import { BannerCTA } from "@/components/ui/BannerCTA";
import { PromotionCard } from "@/components/ui/PromotionCard";
import { UpcomingEventsSidebar } from "@/components/ui/UpcomingEventsSidebar";
import { Search } from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function ChurchesPage() {
  const t = useTranslations("ChurchesPage");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChurches, setFilteredChurches] = useState(churchesData);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Extract unique matching locations
  const locationSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    return churchesData
      .map((church) => church.location)
      .filter(
        (loc, idx, arr) =>
          loc.toLowerCase().includes(query) && arr.indexOf(loc) === idx
      )
      .slice(0, 5);
  }, [searchQuery]);

  function handleSuggestionClick(suggestion: string) {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  }

  // When Search button is clicked
  const handleSearch = () => {
    setIsLoading(true);

    setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();

      if (!query) {
        setFilteredChurches(churchesData);
      } else {
        const matches = churchesData.filter(
          (church) =>
            church.city?.toLowerCase().includes(query) ||
            church.state?.toLowerCase().includes(query) ||
            church.location?.toLowerCase().includes(query)
        );
        setFilteredChurches(matches);
      }

      setIsLoading(false);
    }, 800); // simulate loading
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <EventCarousel events={events.filter((e) => e.featured)} />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <BannerCTA />

          {/* Search Input */}
          <div className="relative max-w-xl w-full mx-auto mb-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search churches by city, state, or location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                className="flex-grow px-5 py-3 rounded-full border border-[#7FC242] focus:outline-none focus:ring-2 focus:ring-[#7FC242]/60 text-base text-gray-800"
                autoComplete="off"
              />
              <Button
                onClick={handleSearch}
                variant="primary"
                className="px-6 py-3 transition text-sm font-medium flex items-center gap-2"
                rounded={true}
              >
                {isLoading ? (
                  <Loader text="Searching..." />
                ) : (
                  <>
                    <Search size={20} />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && locationSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-48 overflow-auto shadow-md">
                {locationSuggestions.map((loc) => (
                  <li
                    key={loc}
                    onMouseDown={() => handleSuggestionClick(loc)}
                    className="px-4 py-2 cursor-pointer hover:bg-[#7FC242] hover:text-white"
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <h1 className="text-3xl font-bold text-[#1A365D] mb-8 text-center">
            {t("allChurches")}
          </h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader text="Loading churches..." />
            </div>
          ) : (
            <GridWithPagination
              items={filteredChurches}
              renderItem={(church) => <ChurchCard church={church} />}
              itemsPerPage={9}
            />
          )}
        </div>

        <div className="lg:w-1/4 space-y-6">
          <PromotionCard />
          <UpcomingEventsSidebar events={events.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}
