"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { billboardFormSchema } from "@/schemas/billboard-schemas";
import { deleteImageUploadthings } from "@/actions/delete-image-uploadthing";

const CreateBillboardSchema = billboardFormSchema;
const UpdateBillboardSchema = billboardFormSchema.extend({ id: z.string() });

export async function createBillboard(
  input: z.infer<typeof CreateBillboardSchema>
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { ok: false, error: "Unauthorized" };
    }

    const values = CreateBillboardSchema.parse(input);

    const billboard = await prisma.billboard.create({
      data: values,
    });

    revalidatePath("/admin/billboards");
    return { ok: true, id: billboard.id };
  } catch (error: unknown) {
    return { ok: false, error: (error as Error).message };
  }
}

export async function updateBillboard(
  input: z.infer<typeof UpdateBillboardSchema>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { ok: false, error: "Unauthorized" };
    }

    const { id, ...values } = UpdateBillboardSchema.parse(input);

    await prisma.billboard.update({
      where: { id },
      data: values,
    });

    revalidatePath("/admin/billboards");
    return { ok: true };
  } catch (error: unknown) {
    return { ok: false, error: (error as Error).message };
  }
}

export async function deleteBillboard(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // First, get the billboard to access the image URL
  const billboard = await prisma.billboard.findUnique({
    where: { id },
    select: { image: true },
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
