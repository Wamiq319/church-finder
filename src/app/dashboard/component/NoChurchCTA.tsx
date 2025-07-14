"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components";
import {
  Building,
  Star,
  TrendingUp,
  Eye,
  BadgeDollarSign,
  ArrowRight,
} from "lucide-react";

export function NoChurchCTA() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Combined Modern Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#7FC242] to-[#5A9C2E] p-8 text-center text-white">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Building className="h-10 w-10" />
          </div>

          <h2 className="text-4xl font-bold mb-3">
            Create Your Church Profile
          </h2>

          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Get your church discovered by thousands of visitors. Featured
            listings receive 3x more engagement.
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Benefits Grid */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Why List Your Church?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                <div className="bg-[#7FC242] text-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Homepage Spotlight
                </h4>
                <p className="text-sm text-gray-600">
                  Featured churches appear prominently on our homepage
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                <div className="bg-[#7FC242] text-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Event Promotion
                </h4>
                <p className="text-sm text-gray-600">
                  Promote your events to reach more people
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                <div className="bg-[#7FC242] text-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Eye className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Increased Visibility
                </h4>
                <p className="text-sm text-gray-600">
                  Get discovered by people searching for churches
                </p>
              </div>
            </div>
          </div>

          {/* Featured Option */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-8">
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <BadgeDollarSign className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Get Featured for $5/week
              </h3>

              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Boost your church's visibility with our featured listing option.
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
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
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              variant="primary"
              rounded
              className="px-10 py-4 text-lg bg-[#7FC242] hover:bg-[#5A9C2E] transition-colors"
              onClick={() => router.push("/dashboard/create-church")}
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
