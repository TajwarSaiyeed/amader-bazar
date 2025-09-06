"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAuth } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { categoryFormSchema } from "@/schemas/category-schemas";

const CreateCategorySchema = categoryFormSchema;
const UpdateCategorySchema = categoryFormSchema.extend({ id: z.string() });

export async function createCategory(
  input: z.infer<typeof CreateCategorySchema>
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    await requireAdminAuth();

    const values = CreateCategorySchema.parse(input);

    const category = await prisma.category.create({
      data: values,
    });

    revalidatePath("/admin/categories");
    return { ok: true, id: category.id };
  } catch (error: unknown) {
    return { ok: false, error: (error as Error).message };
  }
}

export async function updateCategory(
  input: z.infer<typeof UpdateCategorySchema>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminAuth();

    const { id, ...values } = UpdateCategorySchema.parse(input);

    await prisma.category.update({
      where: { id },
      data: values,
    });

    revalidatePath("/admin/categories");
    return { ok: true };
  } catch (error: unknown) {
    return { ok: false, error: (error as Error).message };
  }
}

export async function deleteCategory(id: string) {
  await requireAdminAuth();

  // Check if category has any products
  const productsCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productsCount > 0) {
    throw new Error(
      `Cannot delete category. It contains ${productsCount} product(s). Please move or delete all products from this category first.`
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
}

export async function getAllCategories() {
  await requireAdminAuth();

  return await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
