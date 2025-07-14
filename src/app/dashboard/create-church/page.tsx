"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Input, ClientOnly } from "@/components";
import { formatDate } from "@/utils/dateUtils";
import {
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  Building2,
  MapPin,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import Image from "next/image";
import nigerianStates from "@/data/nigerianStates.json";
import nigerianCities from "@/data/nigerianCities.json";
import {
  validateBasicInfo,
  validateLocation,
  validateContact,
  validatePromotion,
} from "@/lib/validations/church";
import { Church } from "@/types";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

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
        `/api/churches?createdBy=${session?.user?.id}`
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Church Name*"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your church name"
                      error={errors.name}
                      rounded
                    />
                  </div>
                  <div>
                    <Input
                      label="Denomination*"
                      name="denomination"
                      value={formData.denomination}
                      onChange={handleInputChange}
                      placeholder="e.g. Anglican, Catholic, Pentecostal"
                      error={errors.denomination}
                      rounded
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5A7D2C] mb-2">
                    Church Image
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div
                      onClick={handleImageClick}
                      className="relative w-full sm:w-48 h-36 rounded-lg overflow-hidden border-2 border-[#E0E0E0] hover:border-[#7FC242] transition-colors duration-200 cursor-pointer"
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Church preview"
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
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about your church's mission, values, and community between 100 & 500 chacraters..."
                  error={errors.description}
                  rows={4}
                />
              </div>
            )}

            {/* Step 2: Location */}
            {formData.step === 2 && (
              <div className="space-y-6">
                <Input
                  label="Address*"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  error={errors.address}
                  rounded
                  icon={<MapPin className="h-4 w-4 text-[#7FC242]" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5A7D2C] mb-2">
                      State*
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          state: e.target.value,
                          city: "",
                        });
                        if (errors.state) setErrors({ ...errors, state: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 ${
                        errors.state ? "border-red-500" : "border-[#E0E0E0]"
                      } focus:border-[#5A7D2C] focus:ring-2 focus:ring-[#7FC242]/50 rounded-lg transition-all duration-200`}
                    >
                      <option value="">Select State</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5A7D2C] mb-2">
                      City*
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (errors.city) setErrors({ ...errors, city: "" });
                      }}
                      disabled={!formData.state}
                      className={`w-full px-4 py-3 border-2 ${
                        errors.city ? "border-red-500" : "border-[#E0E0E0]"
                      } focus:border-[#5A7D2C] focus:ring-2 focus:ring-[#7FC242]/50 rounded-lg transition-all duration-200 ${
                        !formData.state ? "bg-gray-100 text-gray-400" : ""
                      }`}
                    >
                      <option value="">
                        {formData.state ? "Select City" : "Select State First"}
                      </option>
                      {formData.state &&
                        nigerianCities[
                          formData.state as keyof typeof nigerianCities
                        ]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-[#F0F7EA] p-4 rounded-lg border-2 border-[#E0E0E0]">
                  <h3 className="font-medium text-[#5A7D2C] flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#7FC242]" />
                    Location Preview
                  </h3>
                  {formData.address || formData.city || formData.state ? (
                    <div className="mt-2">
                      <p className="text-[#2E2E2E]">
                        {[formData.address, formData.city, formData.state]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-1">
                      Your location will appear here
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Contact & Services */}
            {formData.step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-[#5A7D2C]">
                  Pastor Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Pastor Name*"
                    name="pastorName"
                    value={formData.pastorName}
                    onChange={handleInputChange}
                    placeholder="Pastor's full name"
                    error={errors.pastorName}
                    rounded
                  />
                  <Input
                    label="Pastor Email*"
                    name="pastorEmail"
                    type="email"
                    value={formData.pastorEmail}
                    onChange={handleInputChange}
                    placeholder="pastor@church.org"
                    error={errors.pastorEmail}
                    rounded
                    icon={<Mail className="h-4 w-4 text-[#7FC242]" />}
                  />
                  <Input
                    label="Pastor Phone*"
                    name="pastorPhone"
                    type="tel"
                    value={formData.pastorPhone}
                    onChange={handleInputChange}
                    placeholder="+234 800 000 0000"
                    error={errors.pastorPhone}
                    rounded
                    icon={<Phone className="h-4 w-4 text-[#7FC242]" />}
                  />
                </div>

                <h3 className="text-lg font-medium text-[#5A7D2C]">
                  Church Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Church Email*"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="contact@church.org"
                    error={errors.contactEmail}
                    rounded
                    icon={<Mail className="h-4 w-4 text-[#7FC242]" />}
                  />
                  <Input
                    label="Church Phone*"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+234 800 000 0000"
                    error={errors.contactPhone}
                    rounded
                    icon={<Phone className="h-4 w-4 text-[#7FC242]" />}
                  />
                </div>

                <h3 className="text-lg font-medium text-[#5A7D2C] flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#7FC242]" />
                  Service Times*
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Input
                      value={formData.services[0] || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleServiceChange(0, e.target.value)
                      }
                      placeholder="Service 1 (e.g., Sunday Worship - 9 AM)"
                      rounded
                      error={
                        errors.services && !formData.services[0]?.trim()
                          ? "Required"
                          : undefined
                      }
                    />
                  </div>

                  {formData.services.slice(1).map((service, index) => (
                    <div key={index + 1} className="flex items-center gap-3">
                      <Input
                        value={service}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleServiceChange(index + 1, e.target.value)
                        }
                        placeholder={`Service ${
                          index + 2
                        } (e.g., Sunday Worship - 9 AM)`}
                        rounded
                        error={
                          errors.services && !service.trim()
                            ? "Required"
                            : undefined
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeServiceField(index + 1)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={addServiceField}
                    variant="outline"
                    className="w-full"
                    rounded
                  >
                    Add Another Service Time
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Promotion */}
            {formData.step === 4 && (
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
                            Your church will be featured prominently on our
                            homepage and search results until{" "}
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
                            Your payment was cancelled. You can still publish
                            your church without featuring, or try the payment
                            again.
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
                          Congratulations! Your church is now prominently
                          featured across our platform. This means more
                          visibility and better reach for your community.
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
                        Your church is now featured! You can complete the setup
                        by publishing your church or continue editing your
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
                            Get your church featured prominently on our homepage
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
                              "Featured" badge on profile
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
