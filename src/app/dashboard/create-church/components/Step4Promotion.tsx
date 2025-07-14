import { Button } from "@/components";
import { Building2 } from "lucide-react";
import { Church } from "@/types";
import { formatDate } from "@/utils/dateUtils";

interface Step4PromotionProps {
  formData: Church;
  paymentStatus: string | null;
  onGetFeatured: () => void;
  isLoading: boolean;
}

export const Step4Promotion = ({
  formData,
  paymentStatus,
  onGetFeatured,
  isLoading,
}: Step4PromotionProps) => {
  return (
    <div className="space-y-6">
      {/* Payment Success Message */}
      {paymentStatus === "success" && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                🎉 Congratulations! Your church is now featured!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Your church will be featured prominently on our homepage and
                  search results until{" "}
                  {formData.featuredUntil
                    ? formatDate(formData.featuredUntil)
                    : "next week"}
                  .
                </p>
                <p className="mt-1">
                  You can now publish your church or continue editing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Cancelled Message */}
      {paymentStatus === "cancelled" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Payment Cancelled
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Your payment was cancelled. You can still publish your church
                  without featuring, or try the payment again.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Church Status - Only show when church is featured */}
      {formData.isFeatured && (
        <div className="space-y-6">
          {/* Main Featured Status Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🎉 You Are Featured! 🎉
              </h2>

              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  FEATURED STATUS: ACTIVE
                </span>
              </div>

              <p className="text-green-700 font-semibold text-lg mb-4">
                Featured until:{" "}
                {formData.featuredUntil
                  ? formatDate(formData.featuredUntil)
                  : "next week"}
              </p>

              <p className="text-gray-600 max-w-2xl mx-auto">
                Congratulations! Your church is now prominently featured across
                our platform. This means more visibility and better reach for
                your community.
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              Your Featured Benefits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-500 font-bold text-lg mt-0.5">
                  ✓
                </span>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Top Search Results
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your church appears first in search results
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-500 font-bold text-lg mt-0.5">
                  ✓
                </span>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Homepage Highlight
                  </h4>
                  <p className="text-sm text-gray-600">
                    Featured prominently on our homepage
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-500 font-bold text-lg mt-0.5">
                  ✓
                </span>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Featured Badge
                  </h4>
                  <p className="text-sm text-gray-600">
                    Special "Featured" badge on your profile
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-500 font-bold text-lg mt-0.5">
                  ✓
                </span>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Priority Listing
                  </h4>
                  <p className="text-sm text-gray-600">
                    Higher priority in church listings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              What's Next?
            </h3>
            <p className="text-gray-700">
              Your church is now featured! You can complete the setup by
              publishing your church or continue editing your information. Your
              featured status will remain active until
              {formData.featuredUntil
                ? ` ${formatDate(formData.featuredUntil)}`
                : " next week"}
              .
            </p>
          </div>
        </div>
      )}

      {/* Non-Featured Church CTA and Button - Only show when church is NOT featured */}
      {!formData.isFeatured && (
        <>
          <div className="bg-gradient-to-br from-[#F0F7EA] to-[#E0F0FF] border border-[#7FC242] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#7FC242] text-white rounded-full p-3 flex-shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  Feature Your Church
                </h3>
                <p className="text-[#5A7D2C] text-lg font-bold mt-1">
                  $5 per week
                </p>
                <p className="text-gray-600 mt-2">
                  Get your church featured prominently on our homepage to reach
                  more people.
                </p>
                <ul className="mt-3 space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-[#7FC242]">✓</span> Top placement in
                    search results
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7FC242]">✓</span> Highlighted on
                    homepage
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7FC242]">✓</span> "Featured" badge
                    on profile
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={onGetFeatured}
            variant="primary"
            className="w-full"
            rounded
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating checkout...
              </>
            ) : (
              "Get Featured for $5/week"
            )}
          </Button>
        </>
      )}
    </div>
  );
};
