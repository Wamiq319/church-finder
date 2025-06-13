"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  Church,
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
import { ChurchData } from "@/types/church.type";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateChurchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "1");

  const [formData, setFormData] = useState<ChurchData>({
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
    services: [""] as [string, ...string[]],
    isFeatured: false,
  });

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log(currentStep);
  // Load existing church data if available
  useEffect(() => {
    const loadChurchData = async () => {
      try {
        const response = await fetch("/api/churches");
        const data = await response.json();

        if (data.success && data.data) {
          setFormData(data.data);
          if (data.data.image) {
            setImagePreview(data.data.image);
          }
          setCurrentStep(data.data.step);
        }
      } catch (error) {
        console.error("Error loading church data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChurchData();
  }, []);

  const saveStep = async (step: number) => {
    try {
      setApiError(null); // Clear any previous errors
      console.log(step, formData);

      const requestBody = {
        step,
        status: step === 4 ? "published" : "draft",
        ...formData,
      };

      const response = await fetch("/api/churches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Internal server error");
      }

      if (data.success) {
        if (step === 4) {
          // If final step, redirect to dashboard
          router.push("/dashboard");
        } else {
          // Move to next step
          setCurrentStep(step + 1);
        }
      }
    } catch (error) {
      setApiError("Internal server error");
    }
  };

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        // For step 4, ensure we're sending the final step data
        await saveStep(4);
      } else {
        await saveStep(currentStep);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ChurchData) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to upload image");
      }

      setFormData((prev: ChurchData) => ({
        ...prev,
        image: data.data.url,
      }));
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
    setFormData((prev: ChurchData) => {
      const newServices = [...prev.services] as [string, ...string[]];
      newServices[index] = value;
      return { ...prev, services: newServices };
    });
  };

  const addServiceField = () => {
    setFormData((prev: ChurchData) => ({
      ...prev,
      services: [...prev.services, ""] as [string, ...string[]],
    }));
  };

  const removeServiceField = (index: number) => {
    if (formData.services.length > 1) {
      setFormData((prev: ChurchData) => ({
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
    console.log(step);
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
        (acc: Record<string, string>, issue: z.ZodIssue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        },
        {}
      );
      console.log("Validation errors:", newErrors);
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleGetFeatured = () => {
    setFormData((prev) => ({ ...prev, isFeatured: true }));
    // This will be connected to payment later
    console.log("User wants to feature their church");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FC242]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100">
          <div
            className="h-full bg-[#7FC242] transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>

        {/* Form Header */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Church className="text-[#7FC242]" />
            {currentStep === 1 && "Basic Information"}
            {currentStep === 2 && "Location Details"}
            {currentStep === 3 && "Contact & Services"}
            {currentStep === 4 && "Promotion"}
          </h1>
          <p className="text-gray-500 mt-1">Step {currentStep} of 4</p>
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
          {currentStep === 1 && (
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
                    className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden border-2 border-[#E0E0E0] hover:border-[#7FC242] transition-colors duration-200 cursor-pointer"
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Church preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 128px"
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
                      <p>Recommended: Square image, 800×800px or larger</p>
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
          {currentStep === 2 && (
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
          {currentStep === 3 && (
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
              {formData.services.map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={service}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleServiceChange(index, e.target.value)
                    }
                    placeholder={`Service ${
                      index + 1
                    } (e.g., Sunday Worship - 9 AM)`}
                    rounded
                    error={
                      errors.services && !service.trim()
                        ? "Required"
                        : undefined
                    }
                  />
                  {formData.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeServiceField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={addServiceField}
                variant="outline"
                className="w-full"
                rounded
              >
                Add Another Service
              </Button>
            </div>
          )}

          {/* Step 4: Promotion */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#F0F7EA] to-[#E0F0FF] border border-[#7FC242] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#7FC242] text-white rounded-full p-3 flex-shrink-0">
                    <Church className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Feature Your Church
                    </h3>
                    <p className="text-[#5A7D2C] text-lg font-bold mt-1">
                      $5 per week
                    </p>
                    <p className="text-gray-600 mt-2">
                      Get your church featured prominently on our homepage to
                      reach more people.
                    </p>
                    <ul className="mt-3 space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="text-[#7FC242]">✓</span> Top placement
                        in search results
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#7FC242]">✓</span> Highlighted on
                        homepage
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#7FC242]">✓</span> "Featured"
                        badge on profile
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  onClick={handleGetFeatured}
                  variant="primary"
                  className="w-full"
                  rounded
                >
                  Get Featured for $5/week
                </Button>

                <Button
                  type="button"
                  onClick={async () => {
                    if (validateStep(4)) {
                      await saveStep(4);
                    }
                  }}
                  variant="outline"
                  className="w-full"
                  rounded
                >
                  Skip Promotion for Now
                </Button>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <h3 className="font-medium text-yellow-800">Note</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You can always feature your church later from your dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
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

            {currentStep < 4 ? (
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
              !formData.isFeatured && (
                <Button
                  type="button"
                  onClick={async () => {
                    if (validateStep(4)) {
                      await saveStep(4);
                    }
                  }}
                  variant="primary"
                  rounded
                >
                  Create Church
                </Button>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
