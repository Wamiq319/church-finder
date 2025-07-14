"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Input, ClientOnly } from "@/components";
import { formatDate } from "@/utils/dateUtils";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import {
  validateEventCreation,
  validateEventPromotion,
} from "@/lib/validations";
import { Event } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Step1EventDetails, Step2EventPromotion } from "./components";

// Use Event type directly, no need for extension since Event type already has all fields

export default function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const churchId = searchParams.get("churchId");
  const eventId = searchParams.get("eventId");

  const [formData, setFormData] = useState<
    Partial<Event> & { step: number; _id?: string }
  >({
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
    if (!eventId) return; // Only fetch if editing
    try {
      const response = await fetch(`/api/events?eventId=${eventId}`, {
        credentials: "include",
      });
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
          step: data.data.step, // Use the actual step from database
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
      if (eventId) {
        fetchEventData();
      } else {
        setIsLoading(false); // New event, no need to fetch
        setFormData({
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
        setImagePreview(null);
      }
    } else if (session === null) {
      // User is not authenticated, middleware will handle redirect
      setIsLoading(false);
    }
  }, [session, router, churchId, eventId]);

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
      console.log("Saving step data:", { ...formData, churchId });

      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, churchId }),
      });

      const data = await response.json();
      console.log("Save response:", data);

      if (!response.ok)
        throw new Error(data.message || "Failed to save step data.");

      if (data.success) {
        // Update formData with the saved event data
        setFormData((prev) => ({
          ...prev,
          _id: data.data._id,
          step: data.data.step,
        }));
        console.log("Step saved successfully, new step:", data.data.step);
      }
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
        // Increment step after successful save
        setFormData((prev) => ({ ...prev, step: Math.min(prev.step + 1, 2) }));
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
      formData.append("folder", "Events");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setFormData((prev) => ({ ...prev, image: data.data.url }));
      setImagePreview(data.data.url);
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
      const result = validateEventCreation(formData);
      if (!result.success) {
        console.log("Step 1 validation errors:", result.error.errors);
        result.error.errors.forEach((error: any) => {
          newErrors[error.path[0]] = error.message;
        });
      }
    } else if (step === 2) {
      const result = validateEventPromotion(formData);
      if (!result.success) {
        console.log("Step 2 validation errors:", result.error.errors);
        result.error.errors.forEach((error: any) => {
          newErrors[error.path[0]] = error.message;
        });
      }
    }

    console.log("Validation errors:", newErrors);
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              nextStep();
            }}
            className="p-6"
          >
            {/* Step 1: Event Details */}
            {formData.step === 1 && (
              <Step1EventDetails
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onImageChange={handleImageChange}
                isUploading={isUploading}
                uploadError={uploadError}
                imagePreview={imagePreview}
              />
            )}

            {/* Step 2: Promotion */}
            {formData.step === 2 && (
              <Step2EventPromotion
                formData={formData}
                paymentStatus={paymentStatus}
                onGetFeatured={handleGetFeatured}
                isLoading={isLoading}
              />
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
                        setIsLoading(true);
                        await saveStep();
                        // Update status to published
                        const response = await fetch("/api/events", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            status: "published",
                            step: 2,
                          }),
                        });

                        if (response.ok) {
                          router.push("/dashboard");
                        } else {
                          const data = await response.json();
                          setApiError(
                            data.message || "Failed to publish event"
                          );
                        }
                      } catch (error) {
                        console.error("Error publishing event:", error);
                        setApiError("Failed to publish event");
                      } finally {
                        setIsLoading(false);
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
