import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import Event from "@/lib/models/Event"; // Mongoose model
import { eventSchema } from "@/lib/validations/event";
import { Event as EventType } from "@/types"; // TypeScript type aliased
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const churchId = searchParams.get("churchId");
    const createdBy = searchParams.get("createdBy");
    const action = searchParams.get("action");

    await dbConnect();

    // Handle different GET operations based on parameters
    if (eventId) {
      // Get specific event by ID
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

      let event = null;
      if (mongoose.Types.ObjectId.isValid(eventId)) {
        event = await Event.findById(eventId);
      }
      if (!event) {
        event = await Event.findOne({ slug: eventId });
      }

      if (!event) {
        return NextResponse.json(
          { success: false, message: "Event not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: event });
    }

    if (action === "list" && churchId) {
      // Get list of events for a church (no auth required for public listing)
      const status = searchParams.get("status");
      const query: { [key: string]: any } = { church: churchId };
      if (status) {
        // Only filter by status if provided
        query["status"] = status;
      }
      const events = await Event.find(query).sort({ date: 1 });
      return NextResponse.json({ success: true, data: events });
    }

    if (createdBy && churchId) {
      // Get most recent event for user and church (requires auth)
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

      const event = await Event.findOne({
        church: churchId,
      }).sort({ createdAt: -1 });

      if (!event) {
        return NextResponse.json(
          { success: false, message: "No event found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: event });
    }

    return NextResponse.json(
      { success: false, message: "Invalid request parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || !user.church) {
      return NextResponse.json(
        { success: false, message: "User has no church" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { churchId, ...eventData } = body as {
      churchId?: string;
    } & EventType;

    console.log("POST /api/events - Request body:", body);
    console.log("User church:", user.church);
    console.log("Requested churchId:", churchId);

    // Use churchId from request or fall back to user's church
    const targetChurchId = churchId || user.church;
    console.log("Target church ID:", targetChurchId);

    // Restrict to 3 events per church
    const eventCount = await Event.countDocuments({ church: targetChurchId });
    if (eventCount >= 3) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Event limit reached. You can only create up to 3 events per church.",
        },
        { status: 400 }
      );
    }

    // Always create a new event (do not update existing)
    const result = eventSchema.safeParse(eventData);
    if (!result.success) {
      console.log("Validation errors:", result.error.errors);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid event data",
          errors: result.error.errors,
        },
        { status: 400 }
      );
    }

    // Generate base slug
    let slug = result.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (await Event.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter++}`;
    }

    const event = new Event({
      ...result.data,
      church: targetChurchId,
      slug: uniqueSlug,
      step: result.data.step || 1,
    });
    await event.save();
    console.log("Event created successfully:", event);

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Error creating/updating event:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || !user.church) {
      return NextResponse.json(
        { success: false, message: "User has no church" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { eventId, ...updateData } = body;

    let event;
    if (eventId) {
      // Update specific event by ID
      event = await Event.findById(eventId);
      if (!event) {
        return NextResponse.json(
          { success: false, message: "Event not found" },
          { status: 404 }
        );
      }
    } else {
      // Find the most recent event for this user's church
      event = await Event.findOne({
        church: user.church,
      }).sort({ createdAt: -1 });

      if (!event) {
        return NextResponse.json(
          { success: false, message: "No event found" },
          { status: 404 }
        );
      }
    }

    // Update event with new data
    Object.assign(event, updateData);
    await event.save();

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Event ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Optional: Add authorization check to ensure user can delete this event
    await Event.findByIdAndDelete(eventId);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
