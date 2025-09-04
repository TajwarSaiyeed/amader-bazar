import { z } from "zod";

export const wishlistItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const addToWishlistSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export const removeFromWishlistSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export type WishlistItem = z.infer<typeof wishlistItemSchema>;
export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
export type RemoveFromWishlistInput = z.infer<typeof removeFromWishlistSchema>;
