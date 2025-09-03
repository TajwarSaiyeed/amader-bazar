"use server";

import prisma from "@/lib/prisma";
import type { Category, Product, ProductImage } from "@/generated/prisma";

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
};

export async function getBrandNewProducts(): Promise<{
  error: string | null;
  products: ProductWithRelations[];
}> {
  try {
    const products = (await prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "asc" },
      include: { images: true, category: true },
      take: 4,
    })) as unknown as ProductWithRelations[];

    return { error: null, products };
  } catch (error: unknown) {
    return { error: (error as Error).message, products: [] };
  }
}
