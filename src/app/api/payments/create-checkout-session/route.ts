import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth.config";
import { createFeaturedChurchCheckoutSession } from "@/lib/stripe";
import Church from "@/lib/models/Church";
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

    // Get the church for the current user
    const church = await Church.findOne({ createdBy: session.user.id }).lean();
    if (!church) {
      return NextResponse.json(
        { success: false, message: "Church not found" },
        { status: 404 }
      );
    }

    // Create Stripe checkout session
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
