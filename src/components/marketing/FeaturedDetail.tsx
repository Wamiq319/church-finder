"use client";

import { formatDate } from "@/utils/dateUtils";
import { Star, Building } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components";

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
    router.push("/dashboard/create-church/checkout");
  };
  if (!isFeatured) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 max-h-64 flex flex-col justify-center">
        <div className="text-center">
          <div className="bg-green-500 text-white rounded-full p-2 w-8 h-8 mx-auto mb-2 flex items-center justify-center">
            <Star className="h-4 w-4" />
          </div>

          <h3 className="text-base font-bold text-gray-800 mb-1">
            Get Featured for $5/week
          </h3>

          <p className="text-gray-600 mb-2 max-w-xs mx-auto text-xs">
            Boost your church's visibility with our featured listing option.
          </p>

          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto mb-2">
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              Top search placement
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              Homepage highlight
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              Featured badge
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              Priority listing
            </div>
          </div>

          <div className="mt-3 px-2">
            <Button
              variant="primary"
              className="w-full bg-[#7FC242] hover:bg-[#5A9C2E] transition-colors py-2 text-sm font-medium"
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
    <div className="space-y-2 max-h-64">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3">
        <div className="text-center">
          <div className="bg-green-500 text-white rounded-full p-1 w-7 h-7 mx-auto mb-1 flex items-center justify-center">
            <Star className="h-4 w-4" />
          </div>

          <h4 className="text-xs font-bold text-gray-800 mb-0.5">
            🎉 Featured! 🎉
          </h4>

          <span className="bg-green-100 text-green-800 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
            ACTIVE
          </span>

          <p className="text-green-700 font-semibold text-[10px] mt-1">
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
      <div className="bg-white rounded-lg p-2 border border-green-200">
        <h5 className="text-[10px] font-bold text-gray-800 mb-1 flex items-center gap-1">
          <Building className="h-3 w-3 text-green-600" />
          Benefits
        </h5>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[10px] text-gray-700">
            <span className="text-green-500 font-bold">✓</span>
            Top search results
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-700">
            <span className="text-green-500 font-bold">✓</span>
            Homepage highlight
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-700">
            <span className="text-green-500 font-bold">✓</span>
            Featured badge
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-700">
            <span className="text-green-500 font-bold">✓</span>
            Priority listing
          </div>
        </div>
      </div>
    </div>
  );
};
