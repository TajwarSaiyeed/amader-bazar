"use client";

import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import type { Product, Category, ProductImage } from "@/generated/prisma";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/use-cart";

export interface CartItemProps {
  product: Product & {
    category: Category;
    images: ProductImage[];
  };
}

const CartItem = ({ product }: CartItemProps) => {
  const image = product?.images?.[0];
  const { removeItem } = useCart();
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded border">
            {image?.url ? (
              <Image
                src={image.url}
                alt={product?.name || "Product"}
                fill
                className="absolute object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product?.name || "Untitled Product"}
            </span>

            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
              {product?.category?.name || "Uncategorized"}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                onClick={() => product?.id && removeItem(product.id)}
                className="flex items-center gap-0.5"
              >
                <X className="w-3 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(Number(product?.price ?? 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
