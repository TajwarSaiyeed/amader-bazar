"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserWishlist } from "@/actions/wishlist.actions";
import ProductListing from "@/components/product-listing";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/providers/wishlist-provider";
import type { Product, Category, ProductImage } from "@/generated/prisma";

interface WishlistItem {
  id: string;
  createdAt: Date;
  product: Product & {
    category: Category;
    images: ProductImage[];
  };
}

export function WishlistProductReel() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { wishlistCount } = useWishlist();

  const fetchWishlist = useCallback(async () => {
    const result = await getUserWishlist();
    if (result.success) {
      setWishlistItems(result.data);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    fetchWishlist();
  }, [wishlistCount, fetchWishlist]);

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Start adding products to your wishlist to keep track of items you love
        </p>
        <Link href="/products">
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}{" "}
          in your wishlist
        </p>
      </div>
      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {wishlistItems.map((item, i) => (
              <ProductListing
                key={item.id}
                index={i}
                product={{
                  ...item.product,
                  isInWishlist: true, // Since these are wishlist items, they're all in wishlist
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
