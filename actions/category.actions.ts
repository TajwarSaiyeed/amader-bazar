"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { categoryFormSchema } from "@/schemas/category-schemas";

const CreateCategorySchema = categoryFormSchema;
const UpdateCategorySchema = categoryFormSchema.extend({ id: z.string() });

export async function createCategory(
  input: z.infer<typeof CreateCategorySchema>
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const values = CreateCategorySchema.parse(input);

  await prisma.category.create({
    data: values,
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(
  input: z.infer<typeof UpdateCategorySchema>
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id, ...values } = UpdateCategorySchema.parse(input);

  await prisma.category.update({
    where: { id },
    data: values,
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
}

export async function getAllCategories() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
