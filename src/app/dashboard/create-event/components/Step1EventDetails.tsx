import { useRef } from "react";
import { Button, Input } from "@/components";
import { ImagePlus, Calendar, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { Event } from "@/types";

interface Step1EventDetailsProps {
  formData: Partial<Event> & { step: number; _id?: string };
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  uploadError: string | null;
  imagePreview: string | null;
}

export default function Step1EventDetails({
  formData,
  errors,
  onInputChange,
  onImageChange,
  isUploading,
  uploadError,
  imagePreview,
}: Step1EventDetailsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Event Title*"
            name="title"
            value={formData.title || ""}
            onChange={onInputChange}
            placeholder="Enter event title"
            error={errors.title}
            rounded
          />
        </div>
        <div>
          <Input
            label="Event Address"
            name="address"
            value={formData.address || ""}
            onChange={onInputChange}
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
            value={formData.date || ""}
            onChange={onInputChange}
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
            value={formData.time || ""}
            onChange={onInputChange}
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
              onChange={onImageChange}
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
        value={formData.description || ""}
        onChange={onInputChange}
        placeholder="Describe your event, what attendees can expect, and any important details..."
        error={errors.description}
        rows={4}
      />
    </div>
  );
}
