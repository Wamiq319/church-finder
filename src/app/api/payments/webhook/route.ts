import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Church from "@/lib/models/Church";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await dbConnect();

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Webhook: checkout.session.completed", session.metadata);

        if (session.metadata?.type === "featured_church") {
          const churchId = session.metadata.churchId;
          console.log("Processing featured church payment for:", churchId);

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

          console.log(
            `Church ${churchId} is now featured until ${featuredUntil}`,
            updatedChurch
          );
        } else {
          console.log("No featured church metadata found in session");
        }
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as any;

        if (invoice.subscription) {
          // Handle recurring payment success
          // You might want to extend the featured period here
          console.log(
            `Recurring payment succeeded for subscription: ${invoice.subscription}`
          );
        }
        break;

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as any;

        if (failedInvoice.subscription) {
          // Handle failed recurring payment
          // You might want to remove featured status here
          console.log(
            `Recurring payment failed for subscription: ${failedInvoice.subscription}`
          );
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
