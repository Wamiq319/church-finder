import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import Event from "@/lib/models/Event";
import { eventSchema } from "@/lib/validations/event";

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

      const event = await Event.findById(eventId);
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
      const events = await Event.find({ church: churchId }).sort({ date: 1 });
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
    const { churchId, ...eventData } = body;

    console.log("POST /api/events - Request body:", body);
    console.log("User church:", user.church);
    console.log("Requested churchId:", churchId);

    // Use churchId from request or fall back to user's church
    const targetChurchId = churchId || user.church;
    console.log("Target church ID:", targetChurchId);

    // Check if this is an update to an existing event
    const existingEvent = await Event.findOne({
      church: targetChurchId,
    }).sort({ createdAt: -1 });

    console.log("Existing event found:", existingEvent ? "Yes" : "No");

    if (existingEvent) {
      // Update existing event
      console.log("Updating existing event");
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

      Object.assign(existingEvent, result.data);
      // Ensure step is properly set
      if (result.data.step) {
        existingEvent.step = result.data.step;
      }
      await existingEvent.save();
      console.log("Event updated successfully:", existingEvent);

      return NextResponse.json({ success: true, data: existingEvent });
    } else {
      // Create new event
      console.log("Creating new event");
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

      const event = new Event({
        ...result.data,
        church: targetChurchId,
        slug: "",
        step: result.data.step || 1,
      });
      await event.save();
      console.log("Event created successfully:", event);

      return NextResponse.json({ success: true, data: event });
    }
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
