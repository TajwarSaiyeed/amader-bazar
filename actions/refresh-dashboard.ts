"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function refreshDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    revalidatePath("/admin/overview");
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error refreshing dashboard:", error);
    throw new Error("Failed to refresh dashboard");
  }
}
