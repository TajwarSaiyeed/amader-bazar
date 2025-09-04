import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutLoading() {
  return (
    <MaxWidthWrapper>
      <div className="py-12 space-y-16">
        {/* Hero Section Skeleton */}
        <section className="text-center space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 mx-auto rounded-full" />
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
            <Skeleton className="h-6 w-[500px] mx-auto" />
          </div>

          <Skeleton className="w-full max-w-4xl mx-auto h-96 rounded-2xl" />
        </section>

        {/* Story Section Skeleton */}
        <section className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-9 w-80" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8">
              <CardContent className="p-0 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="text-center space-y-2">
                      <Skeleton className="h-8 w-8 mx-auto rounded-full" />
                      <Skeleton className="h-6 w-16 mx-auto" />
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section Skeleton */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <Skeleton className="h-6 w-32 mx-auto rounded-full" />
            <Skeleton className="h-9 w-80 mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-[600px] mx-auto" />
              <Skeleton className="h-5 w-[500px] mx-auto" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0 space-y-4">
                  <Skeleton className="w-12 h-12 mx-auto rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 mx-auto" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Section Skeleton */}
        <section className="bg-muted/30 rounded-2xl p-8 md:p-12 text-center space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-28 mx-auto rounded-full" />
            <Skeleton className="h-9 w-96 mx-auto" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-[700px] mx-auto" />
              <Skeleton className="h-5 w-[600px] mx-auto" />
              <Skeleton className="h-5 w-[650px] mx-auto" />
            </div>
          </div>

          <div className="flex items-center justify-center pt-4">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
        </section>

        {/* Contact Section Skeleton */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-28 mx-auto rounded-full" />
            <Skeleton className="h-9 w-80 mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-[600px] mx-auto" />
              <Skeleton className="h-5 w-[500px] mx-auto" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-2xl mx-auto">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-6 text-center">
                <CardContent className="p-0 space-y-3">
                  <Skeleton className="w-10 h-10 mx-auto rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mx-auto mb-2" />
                    <Skeleton className="h-3 w-24 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MaxWidthWrapper>
  );
}
