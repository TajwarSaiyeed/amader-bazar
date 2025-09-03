"use server";

import prisma from "@/lib/prisma";
import type { Category, Product, ProductImage } from "@/generated/prisma";

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
};

export async function getProduct(
  id: string
): Promise<{ error: string | null; product: ProductWithRelations | null }> {
  try {
    const product = (await prisma.product.findFirst({
      where: { id },
      include: { category: true, images: true },
    })) as unknown as ProductWithRelations | null;

    return { error: null, product };
  } catch (error: unknown) {
    return { error: (error as Error).message, product: null };
  }
}
