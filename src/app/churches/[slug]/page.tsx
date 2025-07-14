"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
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
  Globe,
} from "lucide-react";
import contentData from "@/data/content.json";
import { Button, Loader, EventsList } from "@/components";
import { useParams, useRouter } from "next/navigation";
import { Church } from "@/types";

type ChurchWithId = Church & { _id?: string };

export default function ChurchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [church, setChurch] = useState<ChurchWithId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const content = contentData.churchDetailPage;

  useEffect(() => {
    const fetchChurch = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/churches/frontend?type=single&slug=${params.slug}`
        );
        const data = await response.json();

        if (data.success && data.data) {
          setChurch(data.data);
        } else {
          setError("Church not found");
        }
      } catch (error) {
        console.error("Error fetching church:", error);
        setError("Failed to load church details");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchChurch();
    }
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center py-12">
          <Loader text="Loading church details..." />
        </div>
      </div>
    );
  }

  if (error || !church) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Church Header with Image */}
      <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden shadow-lg mb-8">
        <Image
          src={church.image || "/assets/images/churches/st-andrews.jpg"}
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
          {/* Details Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <Home className="text-[#7FC242] mr-2" />
              Details
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <BookOpen className="h-5 w-5 text-[#7FC242] mr-2" />
                <span className="font-semibold text-[#1A365D] mr-1">
                  Denomination:
                </span>
                <span className="text-[#555]">{church.denomination}</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 text-[#7FC242] mr-2" />
                <span className="font-semibold text-[#1A365D] mr-1">
                  Address:
                </span>
                <span className="text-[#555]">
                  {church.address}, {church.city}, {church.state}
                </span>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <BookOpen className="text-[#7FC242] mr-2" />
              {content.aboutTitle}
            </h2>
            <p className="text-[#555] leading-relaxed">{church.description}</p>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 h-80 overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <Calendar className="text-[#7FC242] mr-2" />
              {content.servicesTitle}
            </h2>
            <ul className="space-y-3">
              {church.services?.map((service, index) => (
                <li key={index} className="flex items-start">
                  <Cross className="h-5 w-5 text-[#7FC242] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-[#555]">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          {/* Pastor Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <User className="text-[#7FC242] mr-2" />
              {content.pastorTitle}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-[#7FC242] mr-2" />
                <span className="text-[#555]">{church.pastorName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#7FC242] mr-2" />
                <a
                  href={`mailto:${church.pastorEmail}`}
                  className="text-[#555] hover:text-[#7FC242] transition-colors"
                >
                  {church.pastorEmail}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#7FC242] mr-2" />
                <a
                  href={`tel:${church.pastorPhone}`}
                  className="text-[#555] hover:text-[#7FC242] transition-colors"
                >
                  {church.pastorPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
              <Phone className="text-[#7FC242] mr-2" />
              {content.contactTitle}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#7FC242] mr-2" />
                <a
                  href={`mailto:${church.contactEmail}`}
                  className="text-[#555] hover:text-[#7FC242] transition-colors"
                >
                  {church.contactEmail}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#7FC242] mr-2" />
                <a
                  href={`tel:${church.contactPhone}`}
                  className="text-[#555] hover:text-[#7FC242] transition-colors"
                >
                  {church.contactPhone}
                </a>
              </div>
              {church.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-[#7FC242] mr-2" />
                  <a
                    href={church.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#555] hover:text-[#7FC242] transition-colors underline"
                  >
                    {church.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Registration CTA */}
          <div className="bg-gradient-to-r from-[#1A365D] to-[#2C5282] rounded-xl p-6 text-white">
            <div className="flex items-center mb-3">
              <PlusCircle className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-bold">{content.registerTitle}</h3>
            </div>
            <p className="mb-4">{content.registerDescription}</p>
            <ul className="mb-4 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{content.registerBenefit1}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{content.registerBenefit2}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{content.registerBenefit3}</span>
              </li>
            </ul>
            <Button
              variant="secondary"
              rounded
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              {content.registerButton}
              <ArrowRight className="ml-2" />
            </Button>
            <p className="text-xs mt-2 text-center text-blue-100">
              {content.registerFree}
            </p>
          </div>
        </div>
      </div>

      {/* Events Section - full width at bottom */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-2xl font-bold text-[#1A365D] mb-4 flex items-center">
          <Calendar className="text-[#7FC242] mr-2" />
          Related Events
        </h2>
        <EventsList churchId={church?._id || ""} publicView />
      </div>
    </div>
  );
}
