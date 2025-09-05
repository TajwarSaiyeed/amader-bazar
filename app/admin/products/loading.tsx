import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default function ProductsLoading() {
  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          {/* Header and action buttons skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>

          <Separator />

          {/* Data table skeleton */}
          <div className="space-y-4">
            {/* Search bar skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-64 rounded-md" />
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>

            {/* Table skeleton */}
            <div className="rounded-md border">
              {/* Table header skeleton */}
              <div className="border-b p-4">
                <div className="grid grid-cols-6 gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              {/* Table rows skeleton */}
              <div className="divide-y">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-4 items-center p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
