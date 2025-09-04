"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getAllOrders() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

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
  const session = await auth();
  if (!session?.user) return { order: null, error: "Unauthorized" } as const;

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
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

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

    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
