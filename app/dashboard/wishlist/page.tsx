import { Suspense } from "react";
import { WishlistProductReel } from "./components/wishlist-product-reel";
import { WishlistSkeleton } from "./components/wishlist-skeleton";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Wishlist | Amader Bazar",
  description: "View and manage your wishlist items",
};

export default function WishlistPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          My Wishlist
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your favorite products
        </p>
      </div>

      <Suspense fallback={<WishlistSkeleton />}>
        <WishlistProductReel />
      </Suspense>
    </div>
  );
}
