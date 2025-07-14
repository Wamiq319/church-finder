"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ClientOnly,
  Loader,
  ComingSoonPopup,
  FeaturedDetail,
} from "@/components";
import {
  NoChurchCTA,
  QuickActions,
  ChurchDetails,
  EventsList,
} from "./components";
import type { Church } from "@/types";

type DashboardChurch = Church & {
  _id?: string;
  featuredExpiry?: string;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [church, setChurch] = useState<DashboardChurch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

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

  // Show loading state during initial load
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader text="Loading your dashboard..." />
      </div>
    );
  }

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader text="Loading your data..." />
      </div>
    );
  }

  // Show church details if church exists, is published, and step > 3
  const showChurchDetails =
    church && church.status === "published" && church.step > 3;

  return (
    <ClientOnly
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader text="Loading..." />
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back,{" "}
            <span className="text-[#7FC242]">
              {session?.user?.name || "Pastor"}
            </span>
          </h1>
          <p className="text-gray-600 mt-2">
            Signed in as{" "}
            <span className="font-medium">{session?.user?.email}</span>
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
            <ChurchDetails church={church} />

            {/* Sidebar Column */}
            <div className="space-y-6">
              <QuickActions churchId={church._id} />

              <FeaturedDetail
                isFeatured={church.isFeatured || false}
                featuredUntil={church.featuredUntil}
              />

              <EventsList churchId={church._id || ""} />
            </div>
          </div>
        ) : (
          // Church Creation CTA and Pricing Section
          <div className="space-y-8">
            <NoChurchCTA />
          </div>
        )}
        <ComingSoonPopup
          show={showComingSoon}
          onClose={() => setShowComingSoon(false)}
        />
      </div>
    </ClientOnly>
  );
}
