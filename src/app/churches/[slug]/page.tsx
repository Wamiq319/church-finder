"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Mail,
  Clock,
  Phone,
  Calendar,
  User,
  Home,
  Cross,
  BookOpen,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import churches from "@/data/churches.json";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ChurchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const church = churches.find((c) => c.slug === params.slug);
  const t = useTranslations("churchDetailPage");

  if (!church) {
    return notFound();
  }

  // Generate Google Maps URLs
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${church.address}, ${church.city}, ${church.state}`
  )}`;

  const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${church.address}, ${church.city}, ${church.state}`
  )}&z=15&output=embed&t=m`;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Church Header with Image */}
      <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden shadow-lg mb-8">
        <Image
          src={church.image}
          alt={church.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {church.name}
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* About Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <BookOpen className="text-[#7FC242] mr-2" />
              {t("aboutTitle")}
            </h2>
            <p className="text-[#555] leading-relaxed">{church.description}</p>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <Calendar className="text-[#7FC242] mr-2" />
              {t("servicesTitle")}
            </h2>
            <ul className="space-y-3">
              {church.services.map((service, index) => (
                <li key={index} className="flex items-start">
                  <Cross className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-[#555]">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <MapPin className="text-[#7FC242] mr-2" />
              {t("locationTitle")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Home className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#555] font-medium">{church.address}</p>
                  <p className="text-[#555]">
                    {church.city}, {church.state}
                  </p>
                </div>
              </div>
              {/* Google Maps Embed */}
              <div className="h-64 w-full rounded-lg mt-4 overflow-hidden border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={mapsEmbedUrl}
                  allowFullScreen
                  aria-hidden="false"
                  tabIndex={0}
                ></iframe>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => window.open(mapsSearchUrl, "_blank")}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {t("openInMaps")}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          {/* Pastor Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <User className="text-[#7FC242] mr-2" />
              {t("pastorTitle")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-[#7FC242] mr-2" />
                <span className="text-[#555]">{church.pastor.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#7FC242] mr-2" />
                <a
                  href={`mailto:${church.pastor.email}`}
                  className="text-[#555] hover:text-[#7FC242] transition-colors"
                >
                  {church.pastor.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#7FC242] mr-2" />
                <a
                  href={`tel:${church.pastor.phone}`}
                  className="text-[#555] hover:text-[#7FC242] transition-colors"
                >
                  {church.pastor.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <Phone className="text-[#7FC242] mr-2" />
              {t("contactTitle")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#7FC242] mr-2" />
                <a
                  href={`mailto:${church.contact.email}`}
                  className="text-[#555] hover:text-[#7FC242] transition-colors"
                >
                  {church.contact.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#7FC242] mr-2" />
                <a
                  href={`tel:${church.contact.phone}`}
                  className="text-[#555] hover:text-[#7FC242] transition-colors"
                >
                  {church.contact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Registration CTA */}
          <div className="bg-gradient-to-r from-[#1A365D] to-[#2C5282] rounded-xl p-6 text-white">
            <div className="flex items-center mb-3">
              <PlusCircle className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-bold">{t("registerTitle")}</h3>
            </div>
            <p className="mb-4">{t("registerDescription")}</p>
            <ul className="mb-4 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{t("registerBenefit1")}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{t("registerBenefit2")}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{t("registerBenefit3")}</span>
              </li>
            </ul>
            <Button
              variant="secondary"
              rounded
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              {t("registerButton")}
              <ArrowRight className="ml-2" />
            </Button>
            <p className="text-xs mt-2 text-center text-blue-100">
              {t("registerFree")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
