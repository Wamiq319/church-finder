import { Input } from "@/components";
import { MapPin } from "lucide-react";
import { Church } from "@/types";
import nigerianStates from "@/data/nigerianStates.json";
import nigerianCities from "@/data/nigerianCities.json";

interface Step2LocationProps {
  formData: Church;
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
}

export const Step2Location = ({
  formData,
  errors,
  onInputChange,
  onStateChange,
  onCityChange,
}: Step2LocationProps) => {
  return (
    <div className="space-y-6">
      <Input
        label="Address*"
        name="address"
        value={formData.address}
        onChange={onInputChange}
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
              onStateChange(e.target.value);
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
              onCityChange(e.target.value);
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
          <p className="text-gray-500 mt-1">Your location will appear here</p>
        )}
      </div>
    </div>
  );
};
