"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { billboardFormSchema } from "@/schemas/billboard-schemas";

const CreateBillboardSchema = billboardFormSchema;
const UpdateBillboardSchema = billboardFormSchema.extend({ id: z.string() });

export async function createBillboard(
  input: z.infer<typeof CreateBillboardSchema>
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const values = CreateBillboardSchema.parse(input);

  await prisma.billboard.create({
    data: values,
  });

  revalidatePath("/admin/billboards");
  redirect("/admin/billboards");
}

export async function updateBillboard(
  input: z.infer<typeof UpdateBillboardSchema>
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id, ...values } = UpdateBillboardSchema.parse(input);

  await prisma.billboard.update({
    where: { id },
    data: values,
  });

  revalidatePath("/admin/billboards");
  redirect("/admin/billboards");
}

export async function deleteBillboard(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.billboard.delete({
    where: { id },
  });

  revalidatePath("/admin/billboards");
}
