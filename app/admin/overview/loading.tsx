import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Heading } from "@/components/heading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MetricCardSkeleton,
  ChartSkeleton,
  RecentOrdersSkeleton,
} from "@/components/dashboard/loading-skeletons";

export default function OverviewLoading() {
  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <Heading title="Overview" description="Loading dashboard..." />
              <div className="flex-shrink-0">
                {/* DashboardRefresh skeleton */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground order-2 lg:order-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20 sm:w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between gap-4 order-1 lg:order-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-9 rounded-full" />
                      <Skeleton className="h-4 w-16 sm:w-20" />
                    </div>
                    <Skeleton className="h-8 w-16 sm:w-20 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <MetricCardSkeleton key={i} />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <ChartSkeleton className="col-span-4" />
              <ChartSkeleton className="col-span-3" />
            </div>
            <RecentOrdersSkeleton />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
