"use server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function createStripeCheckout(cartItems: string[]) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    // Get products for line items
    const products = await prisma.product.findMany({
      where: { id: { in: cartItems } },
      include: { images: true },
    });

    if (products.length === 0) {
      throw new Error("No products found");
    }

    // Calculate total
    const total = products.reduce((sum, product) => sum + product.price, 0);

    // Create Stripe checkout session with shipping address collection
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((product) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images.length > 0 ? [product.images[0].url] : [],
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "BD", "IN"], // Add countries you support
      },
      phone_number_collection: {
        enabled: true,
      },
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        productIds: JSON.stringify(cartItems),
        total: total.toString(),
      },
    });

    return { sessionUrl: stripeSession.url };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    throw new Error("Failed to create checkout session");
  }
}
