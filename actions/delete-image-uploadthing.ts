"use server";

import { UTApi } from "uploadthing/server";

export const deleteImageUploadthings = async (image: string | string[]) => {
  const ut = new UTApi();
  
  if (Array.isArray(image)) {
    if (image.length === 0) {
      return { success: false, message: "No images found" };
    }
    
    try {
      await ut.deleteFiles(image.map((img) => img.split("/").pop() as string));
      return { success: true, message: "Images deleted successfully" };
    } catch (error) {
      console.error("Error deleting images:", error);
      return { success: false, message: "Failed to delete images" };
    }
  }

  const imgName = image?.split("/").pop();
  if (!imgName) {
    return { success: false, message: "No image found" };
  }

  try {
    await ut.deleteFiles(imgName);
    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, message: "Failed to delete image" };
  }
};