"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import "@uploadthing/react/styles.css";
import { Button } from "@/components/ui/button";
import { deleteImageUploadthings } from "@/actions/delete-image-uploadthing";

interface FileUploadProps {
  disabled?: boolean;
  endpoint: "imageUrl" | "productImages";
  onChange?: (url?: string) => void;
  value?: string;
  productImages?: string[];
  onProductImagesChange?: (url: string[]) => void;
}

export const FileUpload = ({
  onChange,
  value,
  endpoint,
  productImages,
  onProductImagesChange,
}: FileUploadProps) => {
  if (value && endpoint === "imageUrl") {
    return (
      <div
        className={"relative h-[300px] w-[300px] rounded-md overflow-hidden"}
      >
        <Image
          fill
          src={value}
          alt={"upload"}
          className={"rounded-md object-cover"}
        />
        <div className="absolute top-2 right-2 cursor-pointer z-10">
          <Button
            variant={"destructive"}
            size={"icon"}
            onClick={async () => {
              try {
                const result = await deleteImageUploadthings(value);
                if (result.success) {
                  onChange?.("");
                  toast.success("Image deleted successfully");
                } else {
                  toast.error(result.message || "Failed to delete image");
                }
              } catch (error) {
                console.error("Error deleting image:", error);
                toast.error("Failed to delete image");
              }
            }}
            type={"button"}
          >
            <Trash className={"h-4 w-4"} />
          </Button>
        </div>
      </div>
    );
  }

  if (
    productImages &&
    productImages.length > 0 &&
    endpoint === "productImages"
  ) {
    return (
      <div className="space-y-4">
        {/* Existing Images */}
        <div className="flex flex-wrap gap-4">
          {productImages.map((image, index) => (
            <div
              key={index}
              className={
                "relative h-[300px] w-[300px] bg-zinc-400 rounded-md overflow-hidden"
              }
            >
              <Image
                fill
                src={image}
                alt={"upload"}
                className={"rounded-md object-cover"}
              />
              <div className="absolute top-2 right-2 cursor-pointer z-10">
                <Button
                  variant={"destructive"}
                  size={"icon"}
                  onClick={async () => {
                    try {
                      const result = await deleteImageUploadthings(image);
                      if (result.success) {
                        onProductImagesChange &&
                          onProductImagesChange(
                            productImages.filter((img, i) => i !== index)
                          );
                        toast.success("Image deleted successfully");
                      } else {
                        toast.error(result.message || "Failed to delete image");
                      }
                    } catch (error) {
                      console.error("Error deleting image:", error);
                      toast.error("Failed to delete image");
                    }
                  }}
                  type={"button"}
                >
                  <Trash className={"h-4 w-4"} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Widget */}
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            if (endpoint === "productImages" && onProductImagesChange) {
              const newImageUrls = res?.map((image) => image.url) || [];
              const updatedImages = [...productImages, ...newImageUrls];
              onProductImagesChange(updatedImages);
            }
          }}
          onUploadError={(err: Error) => {
            console.error(err);
          }}
        />
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (endpoint === "imageUrl") {
          const imageUrl = res?.[0]?.url;
          if (onChange) {
            onChange(imageUrl);
          }
        } else if (endpoint === "productImages" && onProductImagesChange) {
          const imageUrls = res?.map((image) => image.url) || [];
          onProductImagesChange(imageUrls);
        }
      }}
      onUploadError={(err: Error) => {
        console.error(err);
      }}
    />
  );
};
