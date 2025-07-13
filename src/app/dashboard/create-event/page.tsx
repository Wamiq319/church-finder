"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ClientOnly from "@/components/ClientOnly";
import { formatDate } from "@/utils/dateUtils";
import {
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  Calendar,
  MapPin,
  Clock,
  Star,
} from "lucide-react";
import Image from "next/image";
import {
  validateEventCreation,
  validateEventPromotion,
} from "@/lib/validations/event";
import { Event } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface EventFormData {
  title: string;
  address: string;
  date: string;
  time: string;
  description: string;
  image: string;
  featured: boolean;
  step: number;
  status: "draft" | "published";
  _id?: string;
  featuredUntil?: Date;
}

export default function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const churchId = searchParams.get("churchId");

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    address: "",
    date: "",
    time: "",
    description: "",
    image: "",
    featured: false,
    step: 1,
    status: "draft",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // Function to fetch and update event data
  const fetchEventData = async () => {
    try {
      const response = await fetch(
        `/api/events?createdBy=${session?.user?.id}&churchId=${churchId}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        // Check if event is complete and published
        if (data.data.step > 2 && data.data.status === "published") {
          router.push("/dashboard");
          return;
        }

        // Update formData with backend data
        setFormData({
          ...data.data,
          step: data.data.step + 1, // Increment step for UI
        });

        if (data.data.image) {
          setImagePreview(data.data.image);
        }
      }
    } catch (error) {
      console.error("Error loading event data:", error);
      setApiError("Failed to load event data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (session?.user?.id && churchId) {
      fetchEventData();
    } else if (session === null) {
      // User is not authenticated, middleware will handle redirect
      setIsLoading(false);
    }
  }, [session, router, churchId]);

  // Check for payment status from URL params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const payment = searchParams.get("payment");
      const sessionId = searchParams.get("session_id");

      if (payment === "success" && sessionId) {
        setPaymentStatus("success");
        // Verify payment and update event status immediately
        if (session?.user?.id) {
          verifyPaymentAndUpdateEvent(sessionId);
        }
        // Clean up URL params
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("payment");
        newUrl.searchParams.delete("session_id");
        window.history.replaceState({}, "", newUrl.toString());
      } else if (payment === "cancelled") {
        setPaymentStatus("cancelled");
        // Clean up URL params
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("payment");
        window.history.replaceState({}, "", newUrl.toString());
      }
    }
  }, [searchParams, session?.user?.id]);

  const saveStep = async () => {
    try {
      setApiError(null);
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, churchId }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to save step data.");

      if (data.success) await fetchEventData();
    } catch (error) {
      console.error("Error in saveStep:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Internal server error during save."
      );
      throw error;
    }
  };

  const nextStep = async () => {
    if (validateStep(formData.step)) {
      try {
        await saveStep();
      } catch (error) {
        console.error("Error in nextStep processing:", error);
      }
    }
  };

  const prevStep = () => {
    setFormData((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setFormData((prev) => ({ ...prev, image: data.url }));
      setImagePreview(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      const result = validateEventCreation.safeParse(formData);
      if (!result.success) {
        result.error.errors.forEach((error) => {
          newErrors[error.path[0]] = error.message;
        });
      }
    } else if (step === 2) {
      const result = validateEventPromotion.safeParse(formData);
      if (!result.success) {
        result.error.errors.forEach((error) => {
          newErrors[error.path[0]] = error.message;
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verifyPaymentAndUpdateEvent = async (sessionId: string) => {
    try {
      const response = await fetch("/api/payments/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFormData((prev) => ({
            ...prev,
            featured: true,
            featuredUntil: data.featuredUntil,
          }));
        }
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const handleGetFeatured = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "event_featured",
          eventId: formData._id,
          amount: 500, // $5.00 in cents
        }),
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setApiError(
        error instanceof Error ? error.message : "Payment setup failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FC242]"></div>
      </div>
    );
  }

  return (
    <ClientOnly
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FC242]"></div>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-100">
            <div
              className="h-full bg-[#7FC242] transition-all duration-300"
              style={{ width: `${(formData.step / 2) * 100}%` }}
            ></div>
          </div>

          {/* Form Header */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="text-[#7FC242]" />
              {formData.step === 1 && "Event Details"}
              {formData.step === 2 && "Promotion"}
            </h1>
            <p className="text-gray-500 mt-1">Step {formData.step} of 2</p>
          </div>

          {/* Error Alert */}
          {apiError && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={nextStep} className="p-6">
            {/* Step 1: Event Details */}
            {formData.step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Event Title*"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter event title"
                      error={errors.title}
                      rounded
                    />
                  </div>
                  <div>
                    <Input
                      label="Event Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter event location"
                      error={errors.address}
                      rounded
                      icon={<MapPin className="h-4 w-4 text-[#7FC242]" />}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Event Date*"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      error={errors.date}
                      rounded
                      icon={<Calendar className="h-4 w-4 text-[#7FC242]" />}
                    />
                  </div>
                  <div>
                    <Input
                      label="Event Time*"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      error={errors.time}
                      rounded
                      icon={<Clock className="h-4 w-4 text-[#7FC242]" />}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5A7D2C] mb-2">
                    Event Image
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div
                      onClick={handleImageClick}
                      className="relative w-full sm:w-48 h-36 rounded-lg overflow-hidden border-2 border-[#E0E0E0] hover:border-[#7FC242] transition-colors duration-200 cursor-pointer"
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Event preview"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 192px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                          <ImagePlus className="h-8 w-8 mb-2" />
                          <span className="text-xs text-center px-2">
                            Click to upload image
                          </span>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        onClick={handleImageClick}
                        variant="outline"
                        className="w-full cursor-pointer"
                        rounded
                        disabled={isUploading}
                      >
                        <ImagePlus className="mr-2 h-4 w-4" />
                        {isUploading
                          ? "Uploading..."
                          : imagePreview
                          ? "Change Image"
                          : "Select Image"}
                      </Button>

                      {uploadError && (
                        <p className="text-sm text-red-500">{uploadError}</p>
                      )}

                      <div className="text-xs text-gray-500">
                        <p>Recommended: 1200×900px or larger</p>
                        <p>Formats: JPG, PNG (max 5MB)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Input
                  label="Event Description*"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event, what attendees can expect, and any important details..."
                  error={errors.description}
                  rows={4}
                />
              </div>
            )}

            {/* Step 2: Promotion */}
            {formData.step === 2 && (
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
                          🎉 Congratulations! Your event is now featured!
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            Your event will be featured prominently on our
                            homepage and search results until{" "}
                            {formData.featuredUntil
                              ? formatDate(formData.featuredUntil)
                              : "next week"}
                            .
                          </p>
                          <p className="mt-1">
                            You can now publish your event or continue editing.
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
                            Your payment was cancelled. You can still publish
                            your event without featuring, or try the payment
                            again.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Featured Event Status - Only show when event is featured */}
                {formData.featured && (
                  <div className="space-y-6">
                    {/* Main Featured Status Card */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                      <div className="text-center">
                        <div className="bg-green-500 text-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Star className="h-8 w-8" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          🎉 Your Event Is Featured! 🎉
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
                          Congratulations! Your event is now prominently
                          featured across our platform. This means more
                          visibility and better reach for your community.
                        </p>
                      </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-600" />
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
                              Your event appears first in search results
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
                              Special "Featured" badge on your event
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
                              Higher priority in event listings
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
                        Your event is now featured! You can complete the setup
                        by publishing your event or continue editing your
                        information. Your featured status will remain active
                        until
                        {formData.featuredUntil
                          ? ` ${formatDate(formData.featuredUntil)}`
                          : " next week"}
                        .
                      </p>
                    </div>
                  </div>
                )}

                {/* Non-Featured Event CTA and Button - Only show when event is NOT featured */}
                {!formData.featured && (
                  <>
                    <div className="bg-gradient-to-br from-[#F0F7EA] to-[#E0F0FF] border border-[#7FC242] rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#7FC242] text-white rounded-full p-3 flex-shrink-0">
                          <Star className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800">
                            Feature Your Event
                          </h3>
                          <p className="text-[#5A7D2C] text-lg font-bold mt-1">
                            $5 per week
                          </p>
                          <p className="text-gray-600 mt-2">
                            Get your event featured prominently on our homepage
                            to reach more people.
                          </p>
                          <ul className="mt-3 space-y-2 text-gray-600">
                            <li className="flex items-center gap-2">
                              <span className="text-[#7FC242]">✓</span> Top
                              placement in search results
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-[#7FC242]">✓</span>{" "}
                              Highlighted on homepage
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-[#7FC242]">✓</span>{" "}
                              "Featured" badge on event
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleGetFeatured}
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
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {formData.step > 1 ? (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  rounded
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {formData.step < 2 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  variant="primary"
                  rounded
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={async () => {
                    if (validateStep(2)) {
                      try {
                        await saveStep();
                        // Update status to published
                        const response = await fetch("/api/events", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "published" }),
                        });

                        if (response.ok) {
                          router.push("/dashboard");
                        }
                      } catch (error) {
                        console.error("Error publishing event:", error);
                      }
                    }
                  }}
                  variant="primary"
                  rounded
                  disabled={isLoading}
                >
                  {isLoading ? "Publishing..." : "Create & publish Event"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </ClientOnly>
  );
}
