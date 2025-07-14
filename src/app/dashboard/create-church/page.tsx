"use client";

import { useState, useRef, useEffect } from "react";
import { Button, ClientOnly } from "@/components";
import { formatDate } from "@/utils/dateUtils";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import {
  validateBasicInfo,
  validateLocation,
  validateContact,
  validatePromotion,
} from "@/lib/validations/church";
import { Church } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Step1BasicInfo,
  Step2Location,
  Step3ContactServices,
  Step4Promotion,
} from "./components";

export default function CreateChurchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [formData, setFormData] = useState<Church>({
    name: "",
    denomination: "",
    description: "",
    address: "",
    state: "",
    city: "",
    pastorName: "",
    pastorEmail: "",
    pastorPhone: "",
    contactEmail: "",
    contactPhone: "",
    services: [""],
    image: "",
    isFeatured: false,
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

  // Function to fetch and update church data
  const fetchChurchData = async () => {
    try {
      const response = await fetch(
        `/api/churches?createdBy=${session?.user?.id}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success && data.data) {
        // Check if church is complete and published
        // Only redirect if not coming from "Get Featured" button (step=4)
        const stepParam = searchParams.get("step");
        if (
          data.data.step > 3 &&
          data.data.status === "published" &&
          stepParam !== "4"
        ) {
          router.push("/dashboard");
          return;
        }

        // Update formData with backend data
        let newStep = data.data.step + 1; // Default increment step for UI

        // If step parameter is provided, use that instead
        if (stepParam) {
          const stepNumber = parseInt(stepParam);
          if (stepNumber >= 1 && stepNumber <= 4) {
            newStep = stepNumber;
          }
        }

        setFormData({
          ...data.data,
          step: newStep,
        });

        if (data.data.image) {
          setImagePreview(data.data.image);
        }
      }
    } catch (error) {
      console.error("Error loading church data:", error);
      setApiError("Failed to load church data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (session?.user?.id) {
      fetchChurchData();
    } else if (session === null) {
      // User is not authenticated, middleware will handle redirect
      setIsLoading(false);
    }
  }, [session, router]);

  // Check for payment status from URL params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const payment = searchParams.get("payment");
      const sessionId = searchParams.get("session_id");

      if (payment === "success" && sessionId) {
        setPaymentStatus("success");
        // Verify payment and update church status immediately
        if (session?.user?.id) {
          verifyPaymentAndUpdateChurch(sessionId);
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
      const response = await fetch("/api/churches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to save step data.");

      if (data.success) await fetchChurchData();
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

    try {
      setIsUploading(true);
      setUploadError(null);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "Churches");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || data.message || "Failed to upload image");

      setFormData((prev) => ({ ...prev, image: data.data.url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleServiceChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newServices = [...prev.services] as [string, ...string[]];
      newServices[index] = value;
      return { ...prev, services: newServices };
    });
  };

  const addServiceField = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, ""],
    }));
  };

  const removeServiceField = (index: number) => {
    if (formData.services.length > 1) {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index) as [
          string,
          ...string[]
        ],
      }));
    }
  };

  const validateStep = (step: number) => {
    let result;
    switch (step) {
      case 1:
        result = validateBasicInfo(formData);
        break;
      case 2:
        result = validateLocation(formData);
        break;
      case 3:
        result = validateContact(formData);
        break;
      case 4:
        result = validatePromotion(formData);
        break;
      default:
        return true;
    }

    if (!result.success) {
      const newErrors = result.error.issues.reduce<Record<string, string>>(
        (acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        },
        {}
      );
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const verifyPaymentAndUpdateChurch = async (sessionId: string) => {
    try {
      const response = await fetch("/api/payments/verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Payment verified successfully:", data.message);
        // Refresh church data to get updated featured status
        await fetchChurchData();
      } else {
        console.error("Payment verification failed:", data.message);
        // Still try to refresh data in case webhook processed it
        setTimeout(() => {
          fetchChurchData();
        }, 3000);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      // Fallback: try to refresh data after a delay
      setTimeout(() => {
        fetchChurchData();
      }, 3000);
    }
  };

  const handleGetFeatured = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setApiError(data.message || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setApiError("Failed to create checkout session");
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
              style={{ width: `${(formData.step / 4) * 100}%` }}
            ></div>
          </div>

          {/* Form Header */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="text-[#7FC242]" />
              {formData.step === 1 && "Basic Information"}
              {formData.step === 2 && "Location Details"}
              {formData.step === 3 && "Contact & Services"}
              {formData.step === 4 && "Promotion"}
            </h1>
            <p className="text-gray-500 mt-1">Step {formData.step} of 4</p>
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
            {/* Step 1: Basic Information */}
            {formData.step === 1 && (
              <Step1BasicInfo
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onImageChange={handleImageChange}
                isUploading={isUploading}
                uploadError={uploadError}
                imagePreview={imagePreview}
              />
            )}

            {/* Step 2: Location */}
            {formData.step === 2 && (
              <Step2Location
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onStateChange={(state) => {
                  setFormData({
                    ...formData,
                    state,
                    city: "",
                  });
                  if (errors.state) setErrors({ ...errors, state: "" });
                }}
                onCityChange={(city) => {
                  setFormData({ ...formData, city });
                  if (errors.city) setErrors({ ...errors, city: "" });
                }}
              />
            )}

            {/* Step 3: Contact & Services */}
            {formData.step === 3 && (
              <Step3ContactServices
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onServiceChange={handleServiceChange}
                onAddService={addServiceField}
                onRemoveService={removeServiceField}
              />
            )}

            {/* Step 4: Promotion */}
            {formData.step === 4 && (
              <Step4Promotion
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

              {formData.step < 4 ? (
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
                    if (validateStep(4)) {
                      try {
                        await saveStep();
                        // Update status to published
                        const response = await fetch("/api/churches", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "published" }),
                        });

                        if (response.ok) {
                          router.push("/dashboard");
                        }
                      } catch (error) {
                        console.error("Error publishing church:", error);
                      }
                    }
                  }}
                  variant="primary"
                  rounded
                  disabled={isLoading}
                >
                  {isLoading ? "Publishing..." : "Create & publish Church"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </ClientOnly>
  );
}
