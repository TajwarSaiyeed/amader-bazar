"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import type { Category, Product, ProductImage } from "@/generated/prisma";

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
  isInWishlist?: boolean;
};

type QueryResult = {
  id: string;
  name: string;
  description: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
  };
  images: {
    id: string;
    url: string;
  }[];
  wishlist: {
    id: string;
  }[];
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

    const products: QueryResult[] = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        isFeatured: true,
        isArchived: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
          },
          take: 3,
        },
        wishlist: session?.user?.id
          ? {
              where: {
                userId: session.user.id,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
      take: Math.min(limit ?? 50, 100),
    });

    const productsWithWishlistStatus: ProductWithRelations[] = products.map(
      (product) => ({
        ...product,
        category: {
          ...product.category,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        images: product.images.map((img) => ({
          ...img,
          productId: product.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        isInWishlist: session?.user?.id ? product.wishlist.length > 0 : false,
      })
    );

    return { error: null, products: productsWithWishlistStatus };
  } catch (error: unknown) {
    return { error: (error as Error).message, products: [] };
  }
}
