"use server";

import prisma from "@/lib/prisma";

export async function getOrderDetails(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        OrderItem: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { order: null, error: "Order not found" } as const;
    }

    return { order, error: null } as const;
  } catch (e) {
    return { order: null, error: "Failed to fetch order details" } as const;
  }
}
