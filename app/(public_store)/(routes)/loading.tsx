import ProductReel from "@/components/product-reel";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  // Create empty products array for skeleton fallback
  const EMPTY_PRODUCTS: never[] = [];

  return (
    <MaxWidthWrapper>
      {/* Hero section skeleton */}
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <div className="relative w-full h-80 bg-zinc-100 rounded-xl mb-8 overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
      </div>

      {/* Brand new section skeleton */}
      <ProductReel
        title="Brand New"
        subtitle="The latest and greatest from our store."
        href="/products"
        data={EMPTY_PRODUCTS}
        loading
        skeletonNumber={4}
      />

      {/* Category sections skeleton with skeleton loading state */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="py-12">
          <div className="md:flex md:items-center md:justify-between mb-4">
            <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="relative">
            <div className="mt-6 flex items-center w-full">
              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="group">
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-5 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </MaxWidthWrapper>
  );
}
