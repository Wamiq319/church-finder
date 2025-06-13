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
} from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { PricingSection } from "@/components/ui/PricingSection";
import { ChurchData } from "@/types/church.type";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChurchData = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/churches");
          const data = await response.json();

          if (data.success) {
            if (data.data) {
              // If church exists but step < 4, redirect to create page
              if (data.data.step < 4) {
                router.push(`/churches/create?step=${data.data.step}`);
                return;
              }
              setChurch(data.data);
            }
          } else {
            setError(data.message);
          }
        } catch (error) {
          console.error("Error fetching church data:", error);
          setError("Failed to fetch church data");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchChurchData();
  }, [status, session, router]);

  if (status === "loading" || loading) {
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

      {!church ? (
        <div className="space-y-8">
          <ChurchCreationCTA />
          <PricingSection />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Church Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {church.name}
                    {church.isFeatured && (
                      <span className="bg-[#FFD700] text-[#1A365D] text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1" /> FEATURED
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {church.address}, {church.city}, {church.state}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="py-3"
                  onClick={() =>
                    router.push(`/dashboard/church/${church._id}/promote`)
                  }
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {church.isFeatured ? "Manage Promotion" : "Get Featured"}
                </Button>
              </div>

              {church.isFeatured && church.featuredExpiry && (
                <div className="mt-4 bg-[#F0F7EA] p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <Star className="h-4 w-4 inline mr-1 text-[#7FC242]" />
                    Your church is featured until{" "}
                    {new Date(church.featuredExpiry).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Church Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Church Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Denomination</p>
                  <p className="font-medium">{church.denomination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pastor</p>
                  <p className="font-medium">{church.pastorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Email</p>
                  <p className="font-medium">{church.contactEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Phone</p>
                  <p className="font-medium">{church.contactPhone}</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Service Times
              </h2>
              <div className="space-y-2">
                {church.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#7FC242]" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start py-3"
                  onClick={() =>
                    router.push(`/dashboard/church/${church._id}/edit`)
                  }
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Church Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start py-3"
                  onClick={() => router.push("/dashboard/events")}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Manage Events
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start py-3"
                  onClick={() => router.push("/dashboard/promote")}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Promotion Center
                </Button>
              </div>
            </div>

            {/* Add new Event Creation Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Create New Event
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Add a new event to your church calendar. Events can be promoted
                to reach more people.
              </p>
              <Button
                variant="primary"
                className="w-full py-3"
                onClick={() => router.push("/dashboard/events/create")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
            </div>

            {/* Promotion Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Promotion Status
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Church Visibility</p>
                  <p className="font-medium">
                    {church.isFeatured ? (
                      <span className="text-[#7FC242]">Featured ✨</span>
                    ) : (
                      <span className="text-gray-600">Standard Listing</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Featured Events</p>
                  <p className="font-medium">
                    {events.filter((e) => e.isFeatured).length} Active
                  </p>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push("/dashboard/promote")}
                >
                  Upgrade Visibility
                </Button>
              </div>
            </div>

            {/* Pricing Card */}
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
      )}
    </div>
  );
}
