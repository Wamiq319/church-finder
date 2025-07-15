import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth.config";
import {
  createFeaturedChurchCheckoutSession,
  createFeaturedEventCheckoutSession,
} from "@/lib/stripe";
import Church from "@/lib/models/Church";
import { Event } from "@/lib/models/Event";
import dbConnect from "@/lib/dbConnect";

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

    const body = await request.json();
    const { type, eventId } = body;

    // Handle event featuring
    if (type === "event_featured" && eventId) {
      const event = await Event.findById(eventId).lean();
      if (!event) {
        return NextResponse.json(
          { success: false, message: "Event not found" },
          { status: 404 }
        );
      }

      // Create Stripe checkout session for event
      const stripeSession = await createFeaturedEventCheckoutSession(
        event._id.toString(),
        event.title
      );

      // Update event with Stripe session ID
      await Event.findByIdAndUpdate(event._id, {
        stripeSessionId: stripeSession.id,
        paymentStatus: "pending",
      });

      return NextResponse.json({
        success: true,
        sessionId: stripeSession.id,
        url: stripeSession.url,
      });
    }

    // Handle church featuring (existing logic)
    const church = await Church.findOne({ createdBy: session.user.id }).lean();
    if (!church) {
      return NextResponse.json(
        { success: false, message: "Church not found" },
        { status: 404 }
      );
    }

    // Create Stripe checkout session for church
    const stripeSession = await createFeaturedChurchCheckoutSession(
      church._id.toString(),
      church.name
    );

    // Update church with Stripe session ID
    await Church.findByIdAndUpdate(church._id, {
      stripeSessionId: stripeSession.id,
      paymentStatus: "pending",
    });

    return NextResponse.json({
      success: true,
      sessionId: stripeSession.id,
      url: stripeSession.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
