"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export type PlaceOrderInput = {
  transactionId: string;
  address: string;
  postCode: string;
  phoneNumber: string;
  orderItems: string[];
  total: number;
};

export async function placeOrder(input: PlaceOrderInput) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { transactionId, address, postCode, phoneNumber, orderItems, total } =
    input;

  if (!transactionId || !address || !postCode || !phoneNumber) {
    throw new Error("Missing required fields");
  }
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error("No order items");
  }

  const order = await prisma.order.create({
    data: {
      total,
      postalCode: postCode,
      address,
      transactionId,
      phoneNumber,
      userId: session.user.id,
      OrderItem: {
        create: orderItems.map((productId) => ({ productId })),
      },
    },
  });

  return { id: order.id } as const;
}
