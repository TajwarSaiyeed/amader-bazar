"use client";

import { useEffect, useState } from "react";
import { getUserWishlist } from "@/actions/wishlist.actions";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/actions/wishlist.actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/add-to-cart-button";
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

export function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const { updateWishlistCount } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setIsLoading(true);
    const result = await getUserWishlist();
    if (result.success) {
      setWishlistItems(result.data);
    }
    setIsLoading(false);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingIds((prev) => new Set(prev).add(productId));

    const result = await toggleWishlist(productId);

    if (result.success) {
      setWishlistItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
      updateWishlistCount(-1);
      toast.success("Product removed from wishlist");
    } else {
      toast.error(result.message);
    }

    setRemovingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 w-2/3" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}{" "}
          in your wishlist
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <Link href={`/products/${item.product.id}`}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFromWishlist(item.product.id)}
                disabled={removingIds.has(item.product.id)}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              {item.product.isFeatured && (
                <Badge className="absolute top-2 left-2 bg-green-500">
                  Featured
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <Link href={`/products/${item.product.id}`}>
                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                  {item.product.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {item.product.category.name}
                </p>
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-3">
                  {formatPrice(item.product.price)}
                </p>
              </Link>

              <div className="space-y-2">
                <AddToCartButton
                  product={item.product}
                  size="sm"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
