"use client";

import { formatDate } from "@/utils/dateUtils";
import { Star, Building } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

interface FeaturedDetailsProps {
  isFeatured: boolean;
  featuredUntil?: Date | string;
}

export const FeaturedDetail = ({
  isFeatured,
  featuredUntil,
}: FeaturedDetailsProps) => {
  const router = useRouter();

  const handleGetFeaturedClick = () => {
    router.push("/dashboard/create-church?step=4");
  };
  if (!isFeatured) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
        <div className="text-center">
          <div className="bg-green-500 text-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <Star className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Get Featured for $5/week
          </h3>

          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Boost your church's visibility with our featured listing option.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              Top search placement
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              Homepage highlight
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              Featured badge
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              Priority listing
            </div>
          </div>

          <div className="mt-6 px-4">
            <Button
              variant="primary"
              className="w-full bg-[#7FC242] hover:bg-[#5A9C2E] transition-colors py-3 text-base font-medium"
              onClick={handleGetFeaturedClick}
            >
              Get Featured Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
        <div className="text-center">
          <div className="bg-green-500 text-white rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
            <Star className="h-5 w-5" />
          </div>

          <h4 className="text-sm font-bold text-gray-800 mb-1">
            🎉 Featured! 🎉
          </h4>

          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            ACTIVE
          </span>

          <p className="text-green-700 font-semibold text-xs mt-2">
            Until:{" "}
            {featuredUntil
              ? formatDate(
                  featuredUntil instanceof Date
                    ? featuredUntil.toISOString()
                    : featuredUntil
                )
              : "next week"}
          </p>
        </div>
      </div>

      {/* Featured Benefits */}
      <div className="bg-white rounded-lg p-3 border border-green-200">
        <h5 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
          <Building className="h-3 w-3 text-green-600" />
          Benefits
        </h5>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="text-green-500 font-bold">✓</span>
            Top search results
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="text-green-500 font-bold">✓</span>
            Homepage highlight
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="text-green-500 font-bold">✓</span>
            Featured badge
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="text-green-500 font-bold">✓</span>
            Priority listing
          </div>
        </div>
      </div>
    </div>
  );
};
