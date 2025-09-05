import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default function ProductFormLoading() {
  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Form skeleton */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic info fields */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-24 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>

                  {/* Images section */}
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-16" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className="aspect-square w-full rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings sidebar skeleton */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
