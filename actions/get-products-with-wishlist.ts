"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import type { Category, Product, ProductImage } from "@/generated/prisma";

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
  isInWishlist?: boolean;
};

export async function getProductsWithWishlistStatus(
  id?: string,
  limit?: number,
  name?: string
): Promise<{ error: string | null; products: ProductWithRelations[] }> {
  try {
    const session = await auth();
    const where: {
      isFeatured: boolean;
      categoryId?: string;
      name?: { contains: string };
    } = { isFeatured: true };

    if (id) where.categoryId = id;
    if (name) where.name = { contains: name };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        wishlist: session?.user?.id
          ? {
              where: {
                userId: session.user.id,
              },
            }
          : false,
      },
      take: limit ?? 50,
    });

    // Transform the products to include wishlist status
    const productsWithWishlistStatus: ProductWithRelations[] = products.map(
      (product) => ({
        ...product,
        isInWishlist: session?.user?.id ? product.wishlist.length > 0 : false,
        // Remove wishlist array from the response
        wishlist: undefined as any,
      })
    );

    return { error: null, products: productsWithWishlistStatus };
  } catch (error: unknown) {
    return { error: (error as Error).message, products: [] };
  }
}
