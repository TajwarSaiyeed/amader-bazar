import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default function BillboardsLoading() {
  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          {/* Header skeleton - matches BillboardClient */}
          <div className={"flex items-center justify-between"}>
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" /> {/* Title */}
              <Skeleton className="h-4 w-80" /> {/* Description */}
            </div>
            <Skeleton className="h-10 w-24" /> {/* Add New button */}
          </div>

          <Separator />

          {/* Data table skeleton */}
          <div className="space-y-4">
            {/* Search bar */}
            <div className="flex items-center py-4">
              <Skeleton className="h-10 w-80" />
            </div>

            {/* Table header */}
            <div className="rounded-md border">
              <div className="border-b">
                <div className="flex h-12 items-center space-x-4 px-4">
                  <Skeleton className="h-4 w-32" /> {/* Name column */}
                  <Skeleton className="h-4 w-24" /> {/* Created At column */}
                  <Skeleton className="h-4 w-16" /> {/* Actions column */}
                </div>
              </div>

              {/* Table rows skeleton */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-16 items-center space-x-4 px-4 border-b last:border-b-0"
                >
                  <Skeleton className="h-4 w-40" /> {/* Name */}
                  <Skeleton className="h-4 w-28" /> {/* Created date */}
                  <Skeleton className="h-8 w-8" /> {/* Actions dropdown */}
                </div>
              ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" /> {/* Results count */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" /> {/* Previous button */}
                <Skeleton className="h-8 w-8" /> {/* Page number */}
                <Skeleton className="h-8 w-8" /> {/* Next button */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
