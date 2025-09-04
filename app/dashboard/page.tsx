import { Suspense } from "react";
import { getUserDashboardData } from "@/actions/user-dashboard.actions";
import { Heading } from "@/components/heading";
import { UserMetricCards } from "@/components/user-dashboard/user-metric-cards";
import { UserOrdersChart } from "@/components/user-dashboard/user-orders-chart";
import { UserRecentOrders } from "@/components/user-dashboard/user-recent-orders";
import { UserQuickActions } from "@/components/user-dashboard/user-quick-actions";
import {
  MetricCardSkeleton,
  ChartSkeleton,
  RecentOrdersSkeleton,
} from "@/components/dashboard/loading-skeletons";

export const dynamic = "force-dynamic";

async function UserDashboardContent() {
  const dashboardData = await getUserDashboardData();

  const {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalSpent,
    wishlistCount,
    recentOrders,
    chartData,
  } = dashboardData;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title="My Dashboard"
          description="Track your orders, spending, and account activity"
        />
      </div>

      {/* Quick Actions */}
      <UserQuickActions />

      {/* Metric Cards */}
      <UserMetricCards
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        completedOrders={completedOrders}
        totalSpent={totalSpent}
        wishlistCount={wishlistCount}
      />

      {/* Charts and Recent Orders */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Order Trends Chart */}
        <div className="lg:col-span-2">
          <UserOrdersChart chartData={chartData} />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Order</span>
                <span className="font-medium">
                  ৳{totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">This Month</span>
                <span className="font-medium">
                  {chartData.reduce((sum, day) => sum + day.orders, 0)} orders
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Savings</span>
                <span className="font-medium text-green-600">৳0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <UserRecentOrders recentOrders={recentOrders} />
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col space-y-6">
          <Heading
            title="My Dashboard"
            description="Loading your dashboard..."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ChartSkeleton className="lg:col-span-2" />
            <div className="rounded-lg border p-4 animate-pulse">
              <div className="h-6 w-24 bg-muted rounded mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 bg-muted rounded" />
                    <div className="h-4 w-12 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <RecentOrdersSkeleton />
        </div>
      }
    >
      <UserDashboardContent />
    </Suspense>
  );
}
