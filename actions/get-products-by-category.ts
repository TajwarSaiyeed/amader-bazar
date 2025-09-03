"use server";

import prisma from "@/lib/prisma";
import type { Category, Product, ProductImage } from "@/generated/prisma";

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
};

export async function getProductsByCategory(
  id: string,
  limit: number,
  name?: string
): Promise<{ error: string | null; products: ProductWithRelations[] }> {
  try {
    const where: {
      isFeatured: boolean;
      categoryId: string;
      name?: { contains: string };
    } = { isFeatured: true, categoryId: id };
    if (name) where.name = { contains: name };

    const products = (await prisma.product.findMany({
      where,
      orderBy: { createdAt: "asc" },
      include: { images: true, category: true },
      take: limit ?? 50,
    })) as unknown as ProductWithRelations[];

    return { error: null, products };
  } catch (error: unknown) {
    return { error: (error as Error).message, products: [] };
  }
}
