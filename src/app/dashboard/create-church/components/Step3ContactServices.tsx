import { Button, Input } from "@/components";
import { Mail, Phone, Clock } from "lucide-react";
import { Church } from "@/types";

interface Step3ContactServicesProps {
  formData: Church;
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onServiceChange: (index: number, value: string) => void;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
}

export const Step3ContactServices = ({
  formData,
  errors,
  onInputChange,
  onServiceChange,
  onAddService,
  onRemoveService,
}: Step3ContactServicesProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-[#5A7D2C]">Pastor Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Pastor Name*"
          name="pastorName"
          value={formData.pastorName}
          onChange={onInputChange}
          placeholder="Pastor's full name"
          error={errors.pastorName}
          rounded
        />
        <Input
          label="Pastor Email*"
          name="pastorEmail"
          type="email"
          value={formData.pastorEmail}
          onChange={onInputChange}
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
          onChange={onInputChange}
          placeholder="+234 800 000 0000"
          error={errors.pastorPhone}
          rounded
          icon={<Phone className="h-4 w-4 text-[#7FC242]" />}
        />
      </div>

      <h3 className="text-lg font-medium text-[#5A7D2C]">Church Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Church Email*"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={onInputChange}
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
          onChange={onInputChange}
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
              onServiceChange(0, e.target.value)
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
                onServiceChange(index + 1, e.target.value)
              }
              placeholder={`Service ${index + 2} (e.g., Sunday Worship - 9 AM)`}
              rounded
              error={
                errors.services && !service.trim() ? "Required" : undefined
              }
            />
            <button
              type="button"
              onClick={() => onRemoveService(index + 1)}
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
          onClick={onAddService}
          variant="outline"
          className="w-full"
          rounded
        >
          Add Another Service Time
        </Button>
      </div>
    </div>
  );
};
