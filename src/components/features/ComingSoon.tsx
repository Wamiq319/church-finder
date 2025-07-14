"use client";

import { Clock, X } from "lucide-react";
import { Button } from "@/components";
import Image from "next/image";

export const ComingSoonPopup = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#E5E7EB]/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F5F6FA] rounded-2xl shadow-2xl max-w-xs w-full overflow-hidden border border-gray-100 p-0">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 shadow"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {/* Founder Image */}
        <div className="flex flex-col items-center pt-5 pb-1 px-3 bg-[#F5F6FA]">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#7FC242] shadow mb-2">
            <Image
              src="/assets/images/founder.jpg"
              alt="Founder"
              fill
              className="object-cover"
              sizes="64px"
              priority
            />
          </div>
          <h3 className="text-lg font-bold text-[#1A365D] mb-1 text-center">
            Feature Coming Soon
          </h3>
          <p className="text-[#444] text-center mb-1 text-sm">
            We're currently working on this feature and it will be available
            soon.
          </p>
        </div>
        {/* Body */}
        <div className="px-3 pb-1">
          <div className="flex flex-col items-center mb-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#7FC242] bg-opacity-20 mb-2">
              <Clock className="h-5 w-5 text-white " />
            </div>
            <p className="text-[#444] text-center text-sm">
              Thanks for your interest!
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded-xl mb-2 text-center">
            <p className="text-xs text-[#444] italic">
              "We're excited to bring you this new functionality to enhance your
              experience. Our team is working hard to make it perfect for you."
            </p>
            <p className="text-xs text-[#1A365D] font-medium mt-1">
              - Evg. Sam Sonibare, Founder
            </p>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-gray-50 px-3 py-3 flex justify-center">
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full py-2 text-base font-bold rounded-xl shadow-lg"
          >
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
};
