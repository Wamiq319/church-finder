"use client";

import Image from "next/image";
import {
  Building,
  CheckCircle,
  Star,
  BookOpen,
  Mail,
  Phone,
  User,
  Clock,
} from "lucide-react";
import type { Church } from "@/types";

interface ChurchDetailsProps {
  church: Church & { _id?: string };
}

export function ChurchDetails({ church }: ChurchDetailsProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Church Status Card with Large Image */}
      <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden shadow-lg">
        {church.image ? (
          <Image
            src={church.image}
            alt={church.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Building className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
              {church.name}
              {church.isFeatured && (
                <span className="bg-[#FFD700] text-[#1A365D] text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <Star className="h-3 w-3 mr-1" /> FEATURED
                </span>
              )}
            </h2>
            <p className="text-white mt-1">
              {church.address}, {church.city}, {church.state}
            </p>
          </div>
        </div>
      </div>

      {/* Church Description */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#7FC242]" />
          About Church
        </h2>
        <p className="text-gray-600 whitespace-pre-wrap break-words">
          {church.description}
        </p>
      </div>

      {/* Church & Pastor Details */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Church Details Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Building className="h-4 w-4 text-[#7FC242]" />
            Church Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Building className="h-4 w-4 text-[#7FC242]" />
                Denomination
              </p>
              <p className="font-medium mt-1">{church.denomination}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#7FC242]" />
                Email
              </p>
              <p className="font-medium mt-1">{church.contactEmail}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#7FC242]" />
                Phone
              </p>
              <p className="font-medium mt-1">{church.contactPhone}</p>
            </div>
          </div>
        </div>

        {/* Pastor Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-[#7FC242]" />
            Pastor Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <User className="h-4 w-4 text-[#7FC242]" />
                Name
              </p>
              <p className="font-medium mt-1">{church.pastorName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#7FC242]" />
                Email
              </p>
              <p className="font-medium mt-1">{church.pastorEmail}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#7FC242]" />
                Phone
              </p>
              <p className="font-medium mt-1">{church.pastorPhone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#7FC242]" />
          Service Times
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {church.services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Clock className="h-5 w-5 text-[#7FC242]" />
              <span className="text-[#7FC242] font-medium">{service}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
