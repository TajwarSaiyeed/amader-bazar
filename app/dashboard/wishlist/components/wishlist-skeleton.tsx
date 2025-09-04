import { Skeleton } from "@/components/ui/skeleton";

export function WishlistSkeleton() {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col w-full">
                <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
                  <Skeleton className="w-full h-full" />
                </div>
                <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
                <Skeleton className="mt-2 w-20 h-4 rounded-lg" />
                <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
