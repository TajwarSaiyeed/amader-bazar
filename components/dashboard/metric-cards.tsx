import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface MetricCardsProps {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  weeklyUsers: number;
  weeklyOrders: number;
  monthlyRevenue: number;
  categoryCount: number;
}

export function MetricCards({
  totalUsers,
  totalProducts,
  totalOrders,
  totalRevenue,
  weeklyUsers,
  weeklyOrders,
  monthlyRevenue,
  categoryCount,
}: MetricCardsProps) {
  const userGrowth = totalUsers > 0 ? (weeklyUsers / totalUsers) * 100 : 0;
  const orderGrowth = totalOrders > 0 ? (weeklyOrders / totalOrders) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalUsers.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            <span
              className={`inline-flex items-center ${
                userGrowth > 0 ? "text-green-600" : "text-gray-500"
              }`}
            >
              {userGrowth > 0 && <TrendingUp className="h-3 w-3 mr-1" />}+
              {weeklyUsers} this week
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalProducts.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Across {categoryCount} categories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalOrders.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            <span
              className={`inline-flex items-center ${
                orderGrowth > 0 ? "text-green-600" : "text-gray-500"
              }`}
            >
              {weeklyOrders > 0 && <TrendingUp className="h-3 w-3 mr-1" />}+
              {weeklyOrders} this week
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ৳{totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            ৳{monthlyRevenue.toLocaleString()} this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
