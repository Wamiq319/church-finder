"use client";

import { useState, useMemo } from "react";
import eventsData from "@/data/events.json";
import contentData from "@/data/content.json";
import { EventCard } from "@/components/ui/EventCard";
import GridWithPagination from "@/components/GridWithPagination";
import { EventCarousel } from "@/components/EventCarousel";
import { BannerCTA } from "@/components/ui/BannerCTA";
import { FeaturedDetails } from "@/components/ui/FeaturedDetail";
import { UpcomingEventsSidebar } from "@/components/ui/UpcomingEventsSidebar";
import { Search } from "lucide-react";
import { Loader } from "@/components/ui/Loader";

export default function EventsPage() {
  const content = contentData.EventsPage;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Extract unique matching locations
  const locationSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    return eventsData
      .map((event) => event.location)
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
        setFilteredEvents(eventsData);
      } else {
        const matches = eventsData.filter(
          (event) =>
            event.title?.toLowerCase().includes(query) ||
            event.location?.toLowerCase().includes(query) ||
            event.organizer?.toLowerCase().includes(query)
        );
        setFilteredEvents(matches);
      }

      setIsLoading(false);
    }, 800); // simulate loading
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <EventCarousel events={eventsData.filter((e) => e.featured)} />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <BannerCTA />

          {/* Search Input */}
          <div className="relative max-w-xl w-full mx-auto mb-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={content.searchPlaceholder}
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
              <button
                onClick={handleSearch}
                className="rounded-full bg-[#7FC242] hover:bg-[#5A7D2C] text-white px-6 py-3 transition text-sm font-medium flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader text={content.searchingText} />
                ) : (
                  <>
                    <Search size={20} />
                    {content.searchButton}
                  </>
                )}
              </button>
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
            {content.allEvents}
          </h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader text={content.loadingText} />
            </div>
          ) : (
            <GridWithPagination
              items={filteredEvents}
              renderItem={(event) => <EventCard event={event} />}
              itemsPerPage={9}
            />
          )}
        </div>

        <div className="lg:w-1/4 space-y-6">
          <FeaturedDetails isFeatured={false} />
          <UpcomingEventsSidebar events={eventsData.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}
