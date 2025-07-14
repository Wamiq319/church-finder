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
          .sort({ createdAt: -1 })
          .limit(3)
          .populate("church", "name address city state");

        console.log("Found featured events:", featuredEvents.length);
        return NextResponse.json({ success: true, data: featuredEvents });

      case "upcoming":
        // Get upcoming events (next 3 events by date)
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const upcomingEvents = await Event.find({
          ...baseQuery,
          date: { $gte: today }, // Events from today onwards
        })
          .sort({ date: 1 })
          .limit(3)
          .populate("church", "name address city state");

        console.log("Found upcoming events:", upcomingEvents.length);
        return NextResponse.json({ success: true, data: upcomingEvents });

      case "list":
        // Get paginated list of all published events
        const [events, total] = await Promise.all([
          Event.find(baseQuery)
            .sort({ date: 1 })
            .skip(skip)
            .limit(limit)
            .populate("church", "name address city state"),
          Event.countDocuments(baseQuery),
        ]);

        console.log("Found events for list:", events.length, "Total:", total);
        return NextResponse.json({
          success: true,
          data: events,
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
          .sort({ createdAt: -1 })
          .limit(6)
          .populate("church", "name address city state");

        return NextResponse.json({ success: true, data: recentEvents });
    }
  } catch (error) {
    console.error("Error fetching frontend events:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
