import {
  getDashboardData,
  getProductsByCategory,
} from "@/actions/dashboard.actions";
import { Heading } from "@/components/heading";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { RecentOrders } from "@/components/dashboard/recent-orders";
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
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <Heading
          title="Overview"
          description="Admin dashboard with key metrics and analytics"
        />
        <div className="flex-shrink-0">
          <DashboardRefresh />
        </div>
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
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          <DashboardContent />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
