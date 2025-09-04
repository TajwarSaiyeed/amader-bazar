import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          {/* Image Skeleton - Left Side */}
          <div className="flex flex-col">
            <div className="aspect-square rounded-lg bg-gray-100">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          </div>

          {/* Product Details Skeleton - Right Side */}
          <div className="mt-10 lg:mt-0">
            {/* Product Title Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-8 w-1/2" />
            </div>

            {/* Price and Category Skeleton */}
            <div className="mb-6">
              <div className="flex items-center">
                <Skeleton className="h-8 w-24" />
                <div className="ml-4 border-l border-gray-300 pl-4">
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-6 w-24 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            {/* Delivery Info Skeleton */}
            <div className="mb-8 flex items-center">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="ml-2 h-4 w-48" />
            </div>

            {/* Add to Cart Button Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Skeleton */}
      <div className="mt-16">
        <SimilarProductsSkeleton />
      </div>
    </>
  );
}

function SimilarProductsSkeleton() {
  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="hidden md:block h-4 w-32" />
      </div>

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductSkeletonCard() {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="w-full h-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-20 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
}
