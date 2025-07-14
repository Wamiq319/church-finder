"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components";
import { PlusCircle, Star } from "lucide-react";

interface QuickActionsProps {
  churchId?: string;
}

export function QuickActions({ churchId }: QuickActionsProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>

      <div className="space-y-3">
        <Button
          variant="primary"
          className="w-full justify-start py-3 bg-[#7FC242] hover:bg-[#5A9C2E]"
          onClick={() =>
            router.push(`/dashboard/create-event?churchId=${churchId}`)
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>
    </div>
  );
}
