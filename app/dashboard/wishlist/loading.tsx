import { WishlistSkeleton } from "./components/wishlist-skeleton";

export default function WishlistLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64" />
      </div>
      <WishlistSkeleton />
    </div>
  );
}
