"use client";

import { ArrowRight, ImagePlus } from "lucide-react";
import { Button, ComingSoonPopup } from "@/components";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const BannerCTA = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="bg-gradient-to-r from-[#7FC242] to-[#A5D76E] rounded-xl p-6 mb-8 text-white shadow-md">
      <ComingSoonPopup show={showPopup} onClose={() => setShowPopup(false)} />
      <div className="flex flex-col md:flex-row justify-between gap-6 md:items-stretch">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center">
              <ImagePlus className="mr-2" />
              Promote Your Church or Event – Display Your Banner Here
            </h2>
            <p className="max-w-2xl">
              Want to showcase your church or event on our website? Submit your
              banner ad and reach thousands of monthly visitors.
            </p>
          </div>
        </div>

        <div className="flex justify-end md:items-end">
          <Button
            variant="secondary"
            rounded
            className="px-8 py-3 whitespace-nowrap"
            onClick={() => setShowPopup(true)}
          >
            Place Your Banner <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
