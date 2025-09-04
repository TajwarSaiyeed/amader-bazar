"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    if (session.user.id === userId) {
      return { success: false, error: "You cannot delete your own account" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const ordersCount = await prisma.order.count({
      where: { userId },
    });

    if (ordersCount > 0) {
      return {
        success: false,
        error: `Cannot delete user. They have ${ordersCount} order(s) in the system. Users with order history cannot be deleted to maintain business records.`,
      };
    }

    const wishlistCount = await prisma.wishlist.count({
      where: { userId },
    });

    if (wishlistCount > 0) {
      console.log(
        `Note: User has ${wishlistCount} wishlist items that will be removed.`
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function updateUserRole(
  userId: string,
  newRole: "USER" | "ADMIN"
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Prevent admin from changing their own role
    if (session.user.id === userId) {
      return { success: false, error: "You cannot change your own role" };
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/admin/users");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}

export async function updateUserProfile(name: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate name
    if (!name || name.trim().length === 0) {
      return { success: false, error: "Name is required" };
    }

    if (name.trim().length > 100) {
      return { success: false, error: "Name must be less than 100 characters" };
    }

    // Update user name
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, error: null, user: updatedUser };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getUserById(userId: string) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized", user: null };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          include: {
            OrderItem: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        wishlist: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return { success: false, message: "User not found", user: null };
    }

    return { success: true, message: "User found", user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, message: "Failed to fetch user", user: null };
  }
}
