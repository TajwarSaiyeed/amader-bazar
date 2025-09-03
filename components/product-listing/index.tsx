"use client";
import { IProduct } from "@/types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import ProductImageSlider from "@/components/product-image-slider";

interface ProductListingProps extends IProduct {
  index: number;
}

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 75 * index);

    return () => clearTimeout(timer);
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  if (isVisible && product) {
    const images = product.images.map((image: { url: string }) => image.url);

    return (
      <Link
        href={`/products/${product.id}`}
        className={cn("invisible h-full w-full cursor-pointer", {
          "visible animate-in fade-in-5": isVisible,
        })}
      >
        <div className={"flex flex-col w-full relative"}>
          <ProductImageSlider images={images} />
          <h3
            className={
              "mt-4 font-medium text-sm text-gray-700 dark:text-gray-300"
            }
          >
            {product.name}
          </h3>
          <p className={"mt-1 text-sm text-gray-500"}>
            {product.category.name}
          </p>
          <p
            className={
              "mt-1 font-medium text-sm text-gray-900 dark:text-gray-100"
            }
          >
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }
};

const ProductPlaceholder = () => {
  return (
    <div className={"flex flex-col w-full"}>
      <div
        className={
          "relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl"
        }
      >
        <Skeleton className={"w-full h-full"} />
      </div>
      <Skeleton className={"mt-4 w-2/3 h-4 rounded-lg"} />
      <Skeleton className={"mt-2 w-20 h-4 rounded-lg"} />
      <Skeleton className={"mt-2 w-12 h-4 rounded-lg"} />
    </div>
  );
};

export default ProductListing;
