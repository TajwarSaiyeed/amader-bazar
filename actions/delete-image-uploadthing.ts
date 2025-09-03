"use server";

import { UTApi } from "uploadthing/server";

const extractKey = (input: string): string | null => {
  if (!input) return null;
  if (!input.includes("/")) return input.split(/[?#]/)[0] || null;
  try {
    const maybeUrl = new URL(input);
    const last = maybeUrl.pathname.split("/").pop() || "";
    return last.split(/[?#]/)[0] || null;
  } catch {
    const last = input.split("/").pop() || "";
    return last.split(/[?#]/)[0] || null;
  }
};

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 600
): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (retries <= 0) throw err;
    await new Promise((r) => setTimeout(r, delayMs));
    return withRetry(fn, retries - 1, Math.min(delayMs * 2, 3000));
  }
}

export const deleteImageUploadthings = async (image: string | string[]) => {
  const ut = new UTApi();

  if (Array.isArray(image)) {
    const keys = image.map(extractKey).filter((k): k is string => !!k);

    if (keys.length === 0) {
      return { success: false, message: "No images found" };
    }

    try {
      await withRetry(() => ut.deleteFiles(keys));
      return { success: true, message: "Images deleted successfully" };
    } catch (error) {
      console.error("Error deleting images:", error);
      return { success: false, message: "Failed to delete images" };
    }
  }

  const imgKey = extractKey(image);
  if (!imgKey) {
    return { success: false, message: "No image found" };
  }

  try {
    await withRetry(() => ut.deleteFiles(imgKey));
    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, message: "Failed to delete image" };
  }
};
