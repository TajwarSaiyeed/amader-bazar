"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";
import type { Product, Category, ProductImage } from "@/generated/prisma";

interface AddToCartButtonProps {
  product: Product & { category: Category; images: ProductImage[] };
  size?: "sm" | "default" | "lg" | "icon" | null;
  className?: string;
}

const AddToCartButton = ({
  product,
  size = "lg",
  className,
}: AddToCartButtonProps) => {
  const { addItem, items } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isSuccess]);

  const handleAddToCart = useCallback(() => {
    if (items.some((p) => p.id === product.id)) {
      toast.error("Error", {
        description: "Already in cart",
        duration: 2000,
        position: "top-right",
      });
      return;
    }
    addItem(product);
    setIsSuccess(true);
  }, [items, addItem, product]);

  return (
    <Button
      onClick={handleAddToCart}
      size={size}
      className={`w-full ${className}`}
    >
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
