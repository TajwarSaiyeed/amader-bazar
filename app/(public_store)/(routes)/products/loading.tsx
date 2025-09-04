import ProductReel from "@/components/product-reel";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  // Create empty products array for skeleton fallback
  const EMPTY_PRODUCTS: never[] = [];

  return (
    <MaxWidthWrapper>
      {/* Search bar skeleton */}
      <div className="py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Skeleton className="h-10 w-full sm:w-96 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Products reel with skeleton */}
      <ProductReel
        title="All Products"
        subtitle="All of our products."
        data={EMPTY_PRODUCTS}
        loading
        skeletonNumber={12}
      />
    </MaxWidthWrapper>
  );
}
