"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { billboardFormSchema } from "@/schemas/billboard-schemas";
import { deleteImageUploadthings } from "@/actions/delete-image-uploadthing";

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

  // First, get the billboard to access the image URL
  const billboard = await prisma.billboard.findUnique({
    where: { id },
    select: { image: true }
  });

  if (!billboard) {
    throw new Error("Billboard not found");
  }

  // Delete the image from UploadThing if it exists
  if (billboard.image) {
    try {
      await deleteImageUploadthings(billboard.image);
    } catch (error) {
      console.error("Failed to delete image from UploadThing:", error);
      // Continue with billboard deletion even if image deletion fails
    }
  }

  // Delete the billboard from database
  await prisma.billboard.delete({
    where: { id },
  });

  revalidatePath("/admin/billboards");
}
