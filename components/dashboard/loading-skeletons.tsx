import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </CardTitle>
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1" />
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-[250px] bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function RecentOrdersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-56 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 w-48 bg-muted rounded animate-pulse mb-2" />
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-6 w-16 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
