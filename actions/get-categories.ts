"use server";

import prisma from "@/lib/prisma";
import type { Category } from "@/generated/prisma";

export async function getCategories(): Promise<{
  error: string | null;
  categories: Category[];
}> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return { error: null, categories };
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    return { error: (error as Error).message, categories: [] };
  }
}
