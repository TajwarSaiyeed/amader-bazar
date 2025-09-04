"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToWishlist(productId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existingWishlistItem) {
      throw new Error("Product already in wishlist");
    }

    await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, message: "Product added to wishlist" };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add to wishlist",
    };
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, message: "Product removed from wishlist" };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to remove from wishlist",
    };
  }
}

export async function toggleWishlist(productId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existingWishlistItem) {
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId,
          },
        },
      });

      revalidatePath("/");
      revalidatePath("/dashboard");

      return {
        success: true,
        message: "Product removed from wishlist",
        inWishlist: false,
      };
    } else {
      await prisma.wishlist.create({
        data: {
          userId: session.user.id,
          productId,
        },
      });

      revalidatePath("/");
      revalidatePath("/dashboard");

      return {
        success: true,
        message: "Product added to wishlist",
        inWishlist: true,
      };
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update wishlist",
    };
  }
}

export async function getUserWishlist() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            images: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: wishlist };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch wishlist",
      data: [],
    };
  }
}

export async function checkIfInWishlist(productId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: true, inWishlist: false };
    }

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    return { success: true, inWishlist: !!wishlistItem };
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return {
      success: false,
      inWishlist: false,
      message:
        error instanceof Error ? error.message : "Failed to check wishlist",
    };
  }
}

export async function getWishlistCount() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: true, count: 0 };
    }

    const count = await prisma.wishlist.count({
      where: {
        userId: session.user.id,
      },
    });

    return { success: true, count };
  } catch (error) {
    console.error("Error getting wishlist count:", error);
    return {
      success: false,
      count: 0,
      message:
        error instanceof Error ? error.message : "Failed to get wishlist count",
    };
  }
}
