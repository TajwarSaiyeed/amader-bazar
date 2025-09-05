import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";

async function handleWebhook(request: NextRequest) {
  logger.info("Stripe webhook received");

  try {
    const buf = await request.arrayBuffer();
    const body = Buffer.from(buf);

    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature");

    logger.debug("Signature validation", {
      hasSignature: !!signature,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    });

    if (!signature) {
      logger.error("No signature found in headers");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      logger.error("No webhook secret in environment");
      return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      logger.debug("Signature verified successfully");
    } catch (err) {
      logger.error("Signature verification failed", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    logger.info("Processing webhook event", { type: event.type });

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          logger.info("Processing checkout session", { sessionId: session.id });

          const userId = session.metadata?.userId;
          const productIds = session.metadata?.productIds
            ? JSON.parse(session.metadata.productIds)
            : [];
          const total = parseFloat(session.metadata?.total || "0");

          logger.debug("Checkout session details", {
            userId,
            productCount: productIds.length,
            total,
          });

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
            logger.info("Creating order in database");

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

            logger.info("Order created successfully", { orderId: order.id });

            revalidatePath("/admin/overview");
            revalidatePath("/admin/orders");
            revalidatePath("/admin");
            revalidatePath("/dashboard/orders");
            logger.debug("Pages revalidated for fresh data");
          } else {
            logger.warn("Missing userId or productIds", {
              userId,
              productIds,
            });
          }
          break;
        }

        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          logger.info("Payment succeeded", {
            paymentIntentId: paymentIntent.id,
          });
          break;
        }

        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          logger.warn("Payment failed", { paymentIntentId: paymentIntent.id });
          break;
        }

        default:
          logger.debug("Unhandled event type", { type: event.type });
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      logger.error("Webhook processing error", error);
      return NextResponse.json(
        { error: "Webhook processing error" },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error("Webhook error", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

// Apply rate limiting to the webhook endpoint
export const POST = withRateLimit(handleWebhook, rateLimitConfigs.webhook);
