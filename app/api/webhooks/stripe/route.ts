import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  console.log("🔗 Webhook received");

  try {
    const buf = await request.arrayBuffer();
    const body = Buffer.from(buf);

    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature");

    console.log("📝 Signature:", signature ? "Present" : "Missing");
    console.log(
      "🔑 Webhook Secret:",
      process.env.STRIPE_WEBHOOK_SECRET ? "Present" : "Missing"
    );

    if (!signature) {
      console.error("❌ No signature found in headers");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ No webhook secret in environment");
      return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      console.log("✅ Signature verified successfully");
    } catch (err) {
      console.error("❌ Signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("📦 Event type:", event.type);

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log("💳 Processing checkout session:", session.id);

          const userId = session.metadata?.userId;
          const productIds = session.metadata?.productIds
            ? JSON.parse(session.metadata.productIds)
            : [];
          const total = parseFloat(session.metadata?.total || "0");

          console.log("👤 User ID:", userId);
          console.log("🛒 Product IDs:", productIds);
          console.log("💰 Total:", total);

          const customerDetails = session.customer_details;

          const address = customerDetails?.address
            ? `${customerDetails.address.line1}${
                customerDetails.address.line2
                  ? ", " + customerDetails.address.line2
                  : ""
              }, ${customerDetails.address.city}, ${
                customerDetails.address.state || ""
              } ${customerDetails.address.postal_code}, ${
                customerDetails.address.country
              }`
            : "No address provided";

          if (userId && productIds.length > 0) {
            console.log("🏗️ Creating order in database...");

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

            console.log("✅ Order created successfully:", order.id);
          } else {
            console.warn("⚠️ Missing userId or productIds:", {
              userId,
              productIds,
            });
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
      console.error("❌ Webhook processing error:", error);
      return NextResponse.json(
        { error: "Webhook processing error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
