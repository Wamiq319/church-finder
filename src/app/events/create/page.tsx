"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import {
  CalendarDays,
  MapPin,
  Clock,
  Image as ImageIcon,
  Church,
  Star,
} from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { ComingSoonPopup } from "@/components/ui/ComingSoon";
import { eventSchema } from "@/lib/validations/event";
import { z } from "zod";

interface EventFormData {
  title: string;
  address?: string;
  date: string;
  time: string;
  description: string;
  image: string;
  featured: boolean;
}

export default function CreateEvent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    address: "",
    date: "",
    time: "",
    description: "",
    image: "",
    featured: false,
  });

  const churchId = searchParams.get("churchId");

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate with Zod
    const result = eventSchema.safeParse(formData);
    if (!result.success) {
      // Map Zod errors to a field: message object
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    } else {
      setValidationErrors({});
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.message || "Failed to create event");
      }
    } catch (error) {
      setError("An error occurred while creating the event");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader text="Loading..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Form Header */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Church className="text-[#7FC242]" />
            Create New Event
          </h1>
          <p className="text-gray-500 mt-1">
            Fill in the details below to create your event
          </p>
        </div>

        {error && (
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
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Event Title*"
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter event title"
              error={validationErrors.title}
            />

            <Input
              label="Event Address"
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Enter event address (optional)"
              error={validationErrors.address}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Date*"
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              icon={<CalendarDays className="h-5 w-5 text-[#7FC242]" />}
              error={validationErrors.date}
            />

            <Input
              label="Time*"
              type="time"
              required
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              icon={<Clock className="h-5 w-5 text-[#7FC242]" />}
              error={validationErrors.time}
            />
          </div>

          <Input
            label="Description*"
            required
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your event..."
            error={validationErrors.description}
          />

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
                    <ImageIcon className="h-8 w-8 mb-2" />
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
                  <ImageIcon className="mr-2 h-4 w-4" />
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

          {/* Featured Event CTA */}
          <div className="bg-gradient-to-br from-[#F0F7EA] to-[#E0F0FF] border border-[#7FC242] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#7FC242] text-white rounded-full p-3 flex-shrink-0">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Feature Your Event
                </h3>
                <p className="text-[#5A7D2C] text-lg font-bold mt-1">
                  $19 per event
                </p>
                <p className="text-gray-600 mt-2">
                  Get your event featured prominently on our homepage to reach
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
                    on event
                  </li>
                </ul>
                <Button
                  type="button"
                  onClick={() => setShowComingSoon(true)}
                  variant="primary"
                  className="mt-4 w-full sm:w-auto"
                  rounded
                >
                  <Star className="mr-2 h-4 w-4" />
                  Feature This Event
                </Button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="px-6"
              rounded
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-6"
              disabled={isLoading}
              rounded
            >
              Create Event
            </Button>
          </div>
        </form>
      </div>
      <ComingSoonPopup
        show={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  );
}
