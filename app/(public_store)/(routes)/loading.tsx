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

      {/* Category sections skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <ProductReel
          key={i}
          title={`Category ${i + 1}`}
          subtitle="Top picks in this category."
          href="/products"
          data={EMPTY_PRODUCTS}
          loading
          skeletonNumber={4}
        />
      ))}
    </MaxWidthWrapper>
  );
}
