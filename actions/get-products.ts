"use server";

import prisma from "@/lib/prisma";
import type { Category, Product, ProductImage } from "@/generated/prisma";
import type {
  SortOption,
  ProductWhereInput,
  ProductOrderByInput,
} from "@/types";

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
};

interface GetProductsParams {
  categoryId?: string;
  limit?: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  newOnly?: boolean;
}

export async function getProducts(
  categoryId?: string,
  limit?: number,
  name?: string,
  minPrice?: number,
  maxPrice?: number,
  sort?: SortOption,
  newOnly?: boolean
): Promise<{ error: string | null; products: ProductWithRelations[] }> {
  try {
    // Build where clause with proper typing
    const where: ProductWhereInput = {
      isFeatured: true,
      isArchived: false,
    };

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Name search
    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // New products filter (products created within the last 30 days)
    // This helps users discover recently added inventory
    if (newOnly) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      where.createdAt = {
        gte: thirtyDaysAgo,
      };
    }

    // Build orderBy clause with proper typing
    let orderBy: ProductOrderByInput = { createdAt: "desc" }; // default: newest first

    switch (sort) {
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      case "name-desc":
        orderBy = { name: "desc" };
        break;
      case "price-low-high":
        orderBy = { price: "asc" };
        break;
      case "price-high-low":
        orderBy = { price: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const products = (await prisma.product.findMany({
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
          take: 3, // Limit images for performance
        },
      },
      orderBy,
      take: Math.min(limit ?? 50, 100), // Cap maximum results
    })) as unknown as ProductWithRelations[];

    return { error: null, products };
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    return { error: (error as Error).message, products: [] };
  }
}

// Alternative function with object parameter for better readability
export async function getProductsWithFilters(
  params: GetProductsParams
): Promise<{ error: string | null; products: ProductWithRelations[] }> {
  return getProducts(
    params.categoryId,
    params.limit,
    params.name,
    params.minPrice,
    params.maxPrice,
    params.sort,
    params.newOnly
  );
}
