import { useRef } from "react";
import { Button, Input } from "@/components";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { Church } from "@/types";

interface Step1BasicInfoProps {
  formData: Church;
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  uploadError: string | null;
  imagePreview: string | null;
}

export const Step1BasicInfo = ({
  formData,
  errors,
  onInputChange,
  onImageChange,
  isUploading,
  uploadError,
  imagePreview,
}: Step1BasicInfoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Church Name*"
            name="name"
            value={formData.name}
            onChange={onInputChange}
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
            onChange={onInputChange}
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
        label="Description"
        name="description"
        value={formData.description}
        onChange={onInputChange}
        placeholder="Tell us about your church's mission, values, and community between 100 & 500 chacraters..."
        error={errors.description}
        rows={4}
      />
    </div>
  );
};
