"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";
import type { Product, Category, ProductImage } from "@/generated/prisma";

const AddToCartButton = ({
  product,
}: {
  product: Product & { category: Category; images: ProductImage[] };
}) => {
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
    <Button onClick={handleAddToCart} size="lg" className="w-full">
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
