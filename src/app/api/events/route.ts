import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import Event from "@/lib/models/Event";
import { eventSchema } from "@/lib/validations/event";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get("createdBy");
    const churchId = searchParams.get("churchId");

    if (!createdBy || !churchId) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the most recent event for this user and church
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

    // Check if this is an update to an existing event
    const existingEvent = await Event.findOne({
      church: churchId || user.church,
    }).sort({ createdAt: -1 });

    if (existingEvent) {
      // Update existing event
      const result = eventSchema.safeParse(eventData);
      if (!result.success) {
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
      await existingEvent.save();

      return NextResponse.json({ success: true, data: existingEvent });
    } else {
      // Create new event
      const result = eventSchema.safeParse(eventData);
      if (!result.success) {
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
        church: churchId || user.church,
        slug: "",
      });
      await event.save();

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

    // Find the most recent event for this user's church
    const event = await Event.findOne({
      church: user.church,
    }).sort({ createdAt: -1 });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "No event found" },
        { status: 404 }
      );
    }

    // Update event with new data
    Object.assign(event, body);
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
