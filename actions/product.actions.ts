"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { productFormSchema } from "@/schemas/product-schemas";
import { deleteImageUploadthings } from "@/actions/delete-image-uploadthing";

const CreateProductSchema = productFormSchema;
const UpdateProductSchema = productFormSchema.extend({ id: z.string() });

export async function createProduct(
  input: z.infer<typeof CreateProductSchema>
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { ok: false, error: "Unauthorized" };
    }

    const values = CreateProductSchema.parse(input);

    const product = await prisma.product.create({
      data: {
        name: values.name,
        description: values.description,
        price: values.price,
        categoryId: values.categoryId,
        isFeatured: values.isFeatured,
        isArchived: values.isArchived,
        images: {
          createMany: {
            data: values.images.map((image: { url: string }) => ({
              url: image.url,
            })),
          },
        },
      },
    });

    revalidatePath("/admin/products");
    return { ok: true, id: product.id };
  } catch (error: unknown) {
    return { ok: false, error: (error as Error).message };
  }
}

export async function updateProduct(
  input: z.infer<typeof UpdateProductSchema>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { ok: false, error: "Unauthorized" };
    }

    const { id, images, ...values } = UpdateProductSchema.parse(input);

    await prisma.product.update({
      where: { id },
      data: {
        ...values,
        images: {
          deleteMany: {},
          createMany: {
            data: images.map((image: { url: string }) => ({
              url: image.url,
            })),
          },
        },
      },
    });

    revalidatePath("/admin/products");
    return { ok: true };
  } catch (error: unknown) {
    return { ok: false, error: (error as Error).message };
  }
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Check if product is in any orders
  const orderItemsCount = await prisma.orderItem.count({
    where: { productId: id },
  });

  if (orderItemsCount > 0) {
    throw new Error(
      `Cannot delete product. It is referenced in ${orderItemsCount} order(s). Products that have been ordered cannot be deleted to maintain order history.`
    );
  }

  // Check if product is in any wishlists
  const wishlistCount = await prisma.wishlist.count({
    where: { productId: id },
  });

  if (wishlistCount > 0) {
    throw new Error(
      `Cannot delete product. It is in ${wishlistCount} user's wishlist(s). Please remove from all wishlists first or archive the product instead.`
    );
  }

  // First, get the product with its images to delete them from UploadThing
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Delete images from UploadThing if they exist
  if (product.images && product.images.length > 0) {
    try {
      const imageUrls = product.images.map((img) => img.url);
      await deleteImageUploadthings(imageUrls);
    } catch (error) {
      console.error("Failed to delete images from UploadThing:", error);
      // Continue with product deletion even if image deletion fails
    }
  }

  // Delete the product (images will be cascade deleted)
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
}

export async function getAllProducts() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllCategories() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}
