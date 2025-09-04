import { Suspense } from "react";
import {
  getDashboardData,
  getProductsByCategory,
} from "@/actions/dashboard.actions";
import { Heading } from "@/components/heading";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import {
  MetricCardSkeleton,
  ChartSkeleton,
  RecentOrdersSkeleton,
} from "@/components/dashboard/loading-skeletons";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { DashboardRefresh } from "@/components/dashboard/dashboard-refresh";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Main dashboard content
async function DashboardContent() {
  const [dashboardData, categoryData] = await Promise.all([
    getDashboardData(),
    getProductsByCategory(),
  ]);

  const {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
    weeklyUsers,
    weeklyOrders,
    monthlyRevenue,
    chartData,
  } = dashboardData;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Overview"
          description="Admin dashboard with key metrics and analytics"
        />
        <DashboardRefresh />
      </div>

      {/* Metric Cards */}
      <MetricCards
        totalUsers={totalUsers}
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        totalRevenue={totalRevenue}
        weeklyUsers={weeklyUsers}
        weeklyOrders={weeklyOrders}
        monthlyRevenue={monthlyRevenue}
        categoryCount={categoryData.length}
      />

      {/* Charts Section */}
      <DashboardCharts chartData={chartData} categoryData={categoryData} />

      {/* Recent Activity */}
      <RecentOrders recentOrders={recentOrders} />
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <MaxWidthWrapper>
        <div className={"flex-col"}>
          <div className={"flex-1 space-y-4 p-8 pt-6"}>
            <DashboardContent />
          </div>
        </div>
      </MaxWidthWrapper>
    </Suspense>
  );
}
