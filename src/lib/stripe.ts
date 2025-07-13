import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export const FEATURED_CHURCH_PRICE_ID =
  process.env.STRIPE_FEATURED_CHURCH_PRICE_ID || "price_featured_church_weekly";

// Helper function to create checkout session for featured church
export async function createFeaturedChurchCheckoutSession(
  churchId: string,
  churchName: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Featured Church: ${churchName}`,
            description: "Weekly featured church listing",
          },
          unit_amount: 500, // $5.00 in cents
          recurring: {
            interval: "week",
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/create-church?step=4&payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/create-church?step=4&payment=cancelled`,
    metadata: {
      churchId,
      type: "featured_church",
    },
  });

  return session;
}
