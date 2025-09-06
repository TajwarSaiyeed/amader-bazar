"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth-utils";

export async function refreshDashboard() {
  await requireAdminAuth();

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
