import { Clock, CheckCircle } from "lucide-react";
import React from "react";

export const ChurchServices = ({ services }: { services: string[] }) => (
  <div className="bg-white rounded-lg shadow h-80 flex flex-col">
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 pt-3 pb-2">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Clock className="h-4 w-4 text-[#7FC242]" />
        Service Times
      </h2>
    </div>
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto px-4 pb-4 pt-2">
      {services.map((service, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100 rounded-lg p-2 flex items-center gap-2 shadow-sm hover:shadow transition-all duration-150"
        >
          <CheckCircle className="h-4 w-4 text-[#7FC242]" />
          <span className="text-[#7FC242] text-sm font-medium">{service}</span>
        </div>
      ))}
    </div>
  </div>
);
