import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Heading } from "@/components/heading";
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
            <Heading title="Overview" description="Loading dashboard..." />
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
