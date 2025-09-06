"use server";

import prisma from "@/lib/prisma";
import { requireAuth, requireAdminAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function getAllOrders() {
  await requireAdminAuth();

  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      OrderItem: {
        include: {
          product: { include: { images: true } },
        },
      },
    },
  });
}

export async function getOrderDetails(orderId: string) {
  await requireAuth();

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

export async function updateOrderStatus(
  orderId: string,
  newStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  await requireAdminAuth();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: newStatus,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/dashboard/orders");
    revalidatePath("/admin/overview"); // Revalidate dashboard overview
    revalidatePath("/admin"); // Revalidate admin root

    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
