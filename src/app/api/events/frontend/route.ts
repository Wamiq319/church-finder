import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Event } from "@/lib/models/Event";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "featured", "upcoming", "list", "single"
    const eventId = searchParams.get("eventId"); // For single event lookup
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await dbConnect();

    // Base query for published events only
    const baseQuery = { status: "published" };
    console.log("Frontend events API called with type:", type);

    switch (type) {
      case "single":
        // Get single event by ID or slug
        if (!eventId) {
          return NextResponse.json(
            { success: false, message: "Event ID is required" },
            { status: 400 }
          );
        }

        let event = null;
        // Try to find by ObjectId first
        if (mongoose.Types.ObjectId.isValid(eventId)) {
          event = await Event.findById(eventId).populate(
            "church",
            "name address city state pastor"
          );
        }
        // If not found by ID, try by slug
        if (!event) {
          event = await Event.findOne({
            slug: eventId,
            status: "published",
          }).populate("church", "name address city state pastor");
        }

        if (!event) {
          return NextResponse.json(
            { success: false, message: "Event not found" },
            { status: 404 }
          );
        }

        console.log("Found single event:", event.title);
        return NextResponse.json({ success: true, data: event });

      case "featured":
        // Get featured events (most recent 3)
        const featuredEvents = await Event.find({
          ...baseQuery,
          featured: true,
        })
          .select(
            "_id title description date address image slug featured featuredUntil status church"
          )
          .sort({ createdAt: -1 })
          .limit(3)
          .populate("church", "name address city state");

        // Truncate title and description for better layout
        const truncatedFeaturedEvents = featuredEvents.map((event) => ({
          _id: event._id,
          title:
            event.title.length > 30
              ? event.title.substring(0, 30) + "..."
              : event.title,
          description:
            event.description.length > 100
              ? event.description.substring(0, 100) + "..."
              : event.description,
          date: event.date,
          address: event.address,
          image: event.image,
          slug: event.slug,
          featured: event.featured,
          featuredUntil: event.featuredUntil,
          status: event.status,
          church: event.church,
        }));

        console.log("Found featured events:", truncatedFeaturedEvents.length);
        return NextResponse.json({
          success: true,
          data: truncatedFeaturedEvents,
        });

      case "upcoming":
        // Get upcoming events (next 3 events by date)
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const upcomingEvents = await Event.find({
          ...baseQuery,
          date: { $gte: today }, // Events from today onwards
        })
          .select(
            "_id title description date address image slug featured featuredUntil status church"
          )
          .sort({ date: 1 })
          .limit(3)
          .populate("church", "name address city state");

        // Truncate title and description for better layout
        const truncatedUpcomingEvents = upcomingEvents.map((event) => ({
          _id: event._id,
          title:
            event.title.length > 30
              ? event.title.substring(0, 30) + "..."
              : event.title,
          description:
            event.description.length > 100
              ? event.description.substring(0, 100) + "..."
              : event.description,
          date: event.date,
          address: event.address,
          image: event.image,
          slug: event.slug,
          featured: event.featured,
          featuredUntil: event.featuredUntil,
          status: event.status,
          church: event.church,
        }));

        console.log("Found upcoming events:", truncatedUpcomingEvents.length);
        return NextResponse.json({
          success: true,
          data: truncatedUpcomingEvents,
        });

      case "list":
        // Get paginated list of all published events
        const [events, total] = await Promise.all([
          Event.find(baseQuery)
            .select(
              "_id title description date address image slug featured featuredUntil status church"
            )
            .sort({ date: 1 })
            .skip(skip)
            .limit(limit)
            .populate("church", "name address city state"),
          Event.countDocuments(baseQuery),
        ]);

        // Truncate title and description for better layout
        const truncatedEvents = events.map((event) => ({
          _id: event._id,
          title:
            event.title.length > 30
              ? event.title.substring(0, 30) + "..."
              : event.title,
          description:
            event.description.length > 100
              ? event.description.substring(0, 100) + "..."
              : event.description,
          date: event.date,
          address: event.address,
          image: event.image,
          slug: event.slug,
          featured: event.featured,
          featuredUntil: event.featuredUntil,
          status: event.status,
          church: event.church,
        }));

        console.log(
          "Found events for list:",
          truncatedEvents.length,
          "Total:",
          total
        );
        return NextResponse.json({
          success: true,
          data: truncatedEvents,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
          },
        });

      default:
        // Default: return recent published events
        const recentEvents = await Event.find(baseQuery)
          .select(
            "_id title description date address image slug featured featuredUntil status church"
          )
          .sort({ createdAt: -1 })
          .limit(6)
          .populate("church", "name address city state");

        // Truncate title and description for better layout
        const truncatedRecentEvents = recentEvents.map((event) => ({
          _id: event._id,
          title:
            event.title.length > 30
              ? event.title.substring(0, 30) + "..."
              : event.title,
          description:
            event.description.length > 100
              ? event.description.substring(0, 100) + "..."
              : event.description,
          date: event.date,
          address: event.address,
          image: event.image,
          slug: event.slug,
          featured: event.featured,
          featuredUntil: event.featuredUntil,
          status: event.status,
          church: event.church,
        }));

        return NextResponse.json({
          success: true,
          data: truncatedRecentEvents,
        });
    }
  } catch (error) {
    console.error("Error fetching frontend events:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
