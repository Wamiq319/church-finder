"use client";

import { useState, useMemo, useEffect } from "react";
import events from "@/data/events.json";
import contentData from "@/data/content.json";
import nigerianCities from "@/data/nigerianCities.json";
import nigerianStates from "@/data/nigerianStates.json";
import {
  Card,
  GridWithPagination,
  EventCarousel,
  BannerCTA,
  FeaturedDetail,
  UpcomingEventsSidebar,
  Loader,
  Button,
} from "@/components";
import { Search, MapPin } from "lucide-react";
import { Church } from "@/types";

export default function ChurchesPage() {
  const content = contentData.ChurchesPage;
  const [searchQuery, setSearchQuery] = useState("");
  const [churches, setChurches] = useState<Church[]>([]);
  const [filteredChurches, setFilteredChurches] = useState<Church[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    pages: 0,
  });

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Fetch churches from API
  const fetchChurches = async (search?: string, page: number = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        status: "published",
        layout: "card",
      });

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/churches?${params}`);
      const data = await response.json();

      if (data.success) {
        setChurches(data.data.churches);
        setFilteredChurches(data.data.churches);
        setPagination(data.data.pagination);
      } else {
        console.error("Failed to fetch churches:", data.message);
      }
    } catch (error) {
      console.error("Error fetching churches:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchChurches();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Generate location suggestions from Nigerian data
  const locationSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const suggestions: string[] = [];

    // Search in states first
    nigerianStates.forEach((state) => {
      if (state.toLowerCase().includes(query)) {
        suggestions.push(state);
      }
    });

    // Search in cities and create city, state combinations
    Object.entries(nigerianCities).forEach(([state, cities]) => {
      cities.forEach((city) => {
        if (
          city.toLowerCase().includes(query) ||
          state.toLowerCase().includes(query)
        ) {
          const location = `${city}, ${state}`;
          if (!suggestions.includes(location)) {
            suggestions.push(location);
          }
        }
      });
    });

    // Return top 10 suggestions
    return suggestions.slice(0, 10);
  }, [searchQuery]);

  function handleSuggestionClick(suggestion: string) {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    fetchChurches(suggestion);
  }

  // When Search button is clicked
  const handleSearch = () => {
    const query = searchQuery.trim();
    fetchChurches(query);
  };

  return (
    <div className="w-full py-6 px-10">
      <EventCarousel events={events.filter((e) => e.featured)} />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <BannerCTA />

          {/* Search Input */}
          <div className="relative max-w-2xl w-full mx-auto mb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search churches by city, state, or location..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  setShowSuggestions(true);

                  // Clear previous timeout
                  if (searchTimeout) {
                    clearTimeout(searchTimeout);
                  }

                  // Set new timeout for debounced search and suggestions
                  // Only show suggestions, don't search while typing
                  const timeoutId = setTimeout(() => {
                    // Suggestions are handled by useMemo automatically
                  }, 300);

                  setSearchTimeout(timeoutId);
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
            {content.allChurches}
          </h1>

          {isInitialLoading ? (
            <div className="flex justify-center py-12">
              <Loader text="Loading churches..." />
            </div>
          ) : (
            <GridWithPagination
              items={filteredChurches}
              renderItem={(church) => (
                <Card
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
                  slug={church.slug}
                  isFeatured={church.isFeatured}
                />
              )}
              itemsPerPage={9}
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => fetchChurches(searchQuery, page)}
              isLoading={isLoading}
            />
          )}
        </div>

        <div className="lg:w-1/4 space-y-4">
          <FeaturedDetail isFeatured={false} />
          <UpcomingEventsSidebar events={events.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}
