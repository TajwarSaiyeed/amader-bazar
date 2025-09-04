import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

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

  console.log("✅ Received event:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("💳 Checkout completed:", session.id);

        // Extract metadata
        const userId = session.metadata?.userId;
        const productIds = session.metadata?.productIds
          ? JSON.parse(session.metadata.productIds)
          : [];
        const total = parseFloat(session.metadata?.total || "0");

        // Get customer info and shipping details
        const customerDetails = session.customer_details;

        const address = customerDetails?.address
          ? `${customerDetails.address.line1}${
              customerDetails.address.line2
                ? ", " + customerDetails.address.line2
                : ""
            }, ${customerDetails.address.city}, ${
              customerDetails.address.state
            } ${customerDetails.address.postal_code}, ${
              customerDetails.address.country
            }`
          : "No address provided";

        if (userId && productIds.length > 0) {
          // Create order in database
          const order = await prisma.order.create({
            data: {
              userId,
              total,
              address,
              phoneNumber: customerDetails?.phone || "No phone provided",
              customerName: customerDetails?.name || "No name provided",
              customerEmail: customerDetails?.email || "No email provided",
              stripePaymentIntentId: session.payment_intent as string,
              paymentStatus: "paid",
              orderStatus: "PENDING",
              OrderItem: {
                create: productIds.map((productId: string) => ({
                  productId,
                })),
              },
            },
            include: {
              OrderItem: {
                include: {
                  product: true,
                },
              },
            },
          });

          console.log("✅ Order created:", order.id);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("❌ Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
