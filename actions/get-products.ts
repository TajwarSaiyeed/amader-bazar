"use server";

import prisma from "@/lib/prisma";
import type { Category, Product, ProductImage } from "@/generated/prisma";

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
};

export async function getProducts(
  id?: string,
  limit?: number,
  name?: string
): Promise<{ error: string | null; products: ProductWithRelations[] }> {
  try {
    const where: any = { isFeatured: true };
    if (id) where.categoryId = id;
    if (name) where.name = { contains: name };

    const products = (await prisma.product.findMany({
      where,
      include: { category: true, images: true },
      take: limit ?? 50,
    })) as unknown as ProductWithRelations[];

    return { error: null, products };
  } catch (error: unknown) {
    return { error: (error as Error).message, products: [] };
  }
}
