import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth.config";
import { stripe } from "@/lib/stripe";
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

    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!checkoutSession) {
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 400 }
      );
    }

    // Check if payment was successful
    if (
      checkoutSession.payment_status === "paid" &&
      checkoutSession.status === "complete"
    ) {
      const churchId = checkoutSession.metadata?.churchId;

      if (churchId && checkoutSession.metadata?.type === "featured_church") {
        // Calculate featured until date (1 week from now)
        const featuredUntil = new Date();
        featuredUntil.setDate(featuredUntil.getDate() + 7);

        // Update church to featured
        const updatedChurch = await Church.findByIdAndUpdate(
          churchId,
          {
            isFeatured: true,
            featuredUntil,
            paymentStatus: "completed",
            step: 4, // Move to step 4 after payment
          },
          { new: true }
        );

        if (updatedChurch) {
          console.log(
            `Church ${churchId} marked as featured via session verification`
          );
          return NextResponse.json({
            success: true,
            message: "Payment verified and church featured",
            church: updatedChurch,
          });
        } else {
          return NextResponse.json(
            { success: false, message: "Church not found" },
            { status: 404 }
          );
        }
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid session metadata" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Payment not completed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify session" },
      { status: 500 }
    );
  }
}
