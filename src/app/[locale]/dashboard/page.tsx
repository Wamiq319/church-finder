"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  CalendarDays,
  MapPin,
  Church,
  CheckCircle,
  Edit,
  PlusCircle,
  Star,
  ArrowRight,
  TrendingUp,
  Eye,
  BadgeDollarSign,
  Clock,
  BookOpen,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { PricingSection } from "@/components/ui/PricingSection";
import { ChurchData } from "@/types/church.type";
import Image from "next/image";

// Extend ChurchData with MongoDB fields
interface ChurchWithMongoFields extends ChurchData {
  _id: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  featuredExpiry?: string;
}

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  isFeatured: boolean;
  featuredExpiry?: string;
}

function ChurchCreationCTA() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-[#F0F7EA] to-[#E0F0FF] border border-[#7FC242] rounded-xl p-8 text-center">
      <div className="bg-[#7FC242] text-white rounded-full p-3 inline-flex mb-4">
        <Church className="h-6 w-6" />
      </div>

      <h3 className="text-2xl font-bold text-[#1A365D] mb-3">
        Create Your Church Profile
      </h3>

      <p className="text-gray-700 mb-6 max-w-md mx-auto">
        Get your church discovered by thousands of visitors. Featured listings
        receive 3x more engagement.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/80 p-4 rounded-lg">
          <Star className="h-5 w-5 text-[#7FC242] mx-auto mb-2" />
          <p className="text-sm font-medium">Homepage Spotlight</p>
        </div>
        <div className="bg-white/80 p-4 rounded-lg">
          <TrendingUp className="h-5 w-5 text-[#7FC242] mx-auto mb-2" />
          <p className="text-sm font-medium">Event Promotion</p>
        </div>
        <div className="bg-white/80 p-4 rounded-lg">
          <Eye className="h-5 w-5 text-[#7FC242] mx-auto mb-2" />
          <p className="text-sm font-medium">Increased Visibility</p>
        </div>
      </div>

      <Button
        variant="primary"
        rounded
        className="px-8 py-3 text-lg w-full max-w-xs mx-auto"
        onClick={() => router.push("/churches/create")}
      >
        Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [church, setChurch] = useState<ChurchWithMongoFields | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch church data
  const fetchChurchData = async () => {
    try {
      const response = await fetch(
        `/api/churches?createdBy=${session?.user?.id}`
      );
      const data = await response.json();
      console.log(data);
      if (data.success) {
        if (data.data) {
          setChurch(data.data);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error fetching church data:", error);
      setError("Failed to fetch church data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (session?.user?.id) {
      fetchChurchData();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader text="Loading your dashboard..." />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  // Show church details if church exists, is published, and step > 3
  const showChurchDetails =
    church && church.status === "published" && church.step > 3;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back,{" "}
          <span className="text-[#7FC242]">
            {session.user.name || "Pastor"}
          </span>
        </h1>
        <p className="text-gray-600 mt-2">
          Signed in as <span className="font-medium">{session.user.email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showChurchDetails ? (
        // Church Details View
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
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
                  <Church className="h-16 w-16 text-gray-400" />
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

            {/* Featured Status Info */}
            {church.isFeatured && church.featuredExpiry && (
              <div className="bg-[#F0F7EA] p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <Star className="h-4 w-4 inline mr-1 text-[#7FC242]" />
                  Your church is featured until{" "}
                  {new Date(church.featuredExpiry).toLocaleDateString()}
                </p>
              </div>
            )}

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
                  <Church className="h-4 w-4 text-[#7FC242]" />
                  Church Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Church className="h-4 w-4 text-[#7FC242]" />
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
                    <span className="text-[#7FC242] font-medium">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start py-3"
                  onClick={() =>
                    router.push(`/events/create?churchId=${church._id}`)
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start py-3"
                  onClick={() =>
                    router.push(`/dashboard/church/${church._id}/promote`)
                  }
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Feature Church
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start py-3"
                  onClick={() => router.push("/dashboard/events/promote")}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Promote Event
                </Button>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="bg-[#F0F7EA] border border-[#7FC242] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Pricing Plans
              </h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-[#7FC242] mr-2 mt-0.5" />
                  <span className="text-sm">Featured Church: $49/week</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-[#7FC242] mr-2 mt-0.5" />
                  <span className="text-sm">Featured Event: $19/event</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-[#7FC242] mr-2 mt-0.5" />
                  <span className="text-sm">Premium Package: $99/week</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full border-[#7FC242] text-[#7FC242] hover:bg-[#E0F0FF]"
                onClick={() => router.push("/dashboard/pricing")}
              >
                View All Plans
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Church Creation CTA and Pricing Section
        <div className="space-y-8">
          <ChurchCreationCTA />
          <PricingSection />
        </div>
      )}
    </div>
  );
}
