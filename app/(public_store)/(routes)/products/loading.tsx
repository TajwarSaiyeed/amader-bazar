import ProductReel from "@/components/product-reel";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  // Create empty products array for skeleton fallback
  const EMPTY_PRODUCTS: never[] = [];

  return (
    <MaxWidthWrapper>
      {/* Search bar skeleton */}
      <div className="relative mt-4">
        <Skeleton className="h-10 w-full md:max-w-[500px] rounded-lg" />
      </div>

      {/* Filter button skeleton */}
      <div className="w-full mb-6 mt-6">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Quick filters skeleton - mobile */}
      <div className="flex flex-wrap gap-3 mb-6 md:hidden">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </div>

      {/* Products grid skeleton */}
      <ProductReel
        title="Loading Products..."
        subtitle="Please wait while we load your products."
        data={EMPTY_PRODUCTS}
        loading
        skeletonNumber={8}
      />
    </MaxWidthWrapper>
  );
}
