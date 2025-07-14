"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components";
import { PlusCircle } from "lucide-react";

interface QuickActionsProps {
  churchId?: string;
  eventCount?: number;
}

export function QuickActions({ churchId, eventCount }: QuickActionsProps) {
  const router = useRouter();

  const isDisabled = eventCount !== undefined && eventCount >= 3;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>

      <div className="space-y-3">
        <Button
          variant="primary"
          className={`w-full justify-start py-3 bg-[#7FC242] hover:bg-[#5A9C2E] ${
            isDisabled
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : ""
          }`}
          onClick={() =>
            router.push(`/dashboard/create-event?churchId=${churchId}`)
          }
          disabled={isDisabled}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>
    </div>
  );
}
