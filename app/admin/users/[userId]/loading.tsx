import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default function UserDetailsLoading() {
  return (
    <MaxWidthWrapper>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* User Info Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="text-center space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>

                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-48" />
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics and Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="space-y-2 text-right">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
