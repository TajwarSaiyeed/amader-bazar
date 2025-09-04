import prisma from "@/lib/prisma";
import { subDays, format } from "date-fns";

export async function getDashboardData() {
  try {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sevenDaysAgo = subDays(now, 7);

    // Get basic counts
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      weeklyUsers,
      weeklyOrders,
      monthlyRevenue,
      salesData,
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),

      // Recent orders with user and product info
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          OrderItem: {
            include: {
              product: { select: { name: true, price: true } },
            },
          },
        },
      }),

      // Weekly growth
      prisma.user.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),

      prisma.order.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),

      // Monthly revenue
      prisma.order.aggregate({
        where: { createdAt: { gte: thirtyDaysAgo } },
        _sum: { total: true },
      }),

      // Sales data for chart (last 30 days)
      prisma.order.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: {
          createdAt: true,
          total: true,
          OrderItem: {
            select: { id: true }, // Just need to count items
          },
        },
      }),
    ]);

    // Process sales data for chart
    const salesByDate: Record<
      string,
      { revenue: number; orders: number; items: number }
    > = {};

    // Initialize all days with zero values
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(now, i), "yyyy-MM-dd");
      salesByDate[date] = { revenue: 0, orders: 0, items: 0 };
    }

    // Populate with actual data
    salesData.forEach((order) => {
      const date = format(order.createdAt, "yyyy-MM-dd");
      if (salesByDate[date]) {
        salesByDate[date].revenue += order.total;
        salesByDate[date].orders += 1;
        salesByDate[date].items += order.OrderItem.length; // Count of OrderItems
      }
    });

    // Convert to chart data format
    const chartData = Object.entries(salesByDate).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
      items: data.items,
    }));

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
      weeklyUsers,
      weeklyOrders,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
      chartData,
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
      weeklyUsers: 0,
      weeklyOrders: 0,
      monthlyRevenue: 0,
      chartData: [],
    };
  }
}

export async function getProductsByCategory() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        products: {
          _count: "desc",
        },
      },
    });

    return categories.map((category) => ({
      category: category.name,
      products: category._count.products,
      fill: `hsl(var(--chart-${(categories.indexOf(category) % 5) + 1}))`,
    }));
  } catch (error) {
    console.error("Products by category fetch error:", error);
    return [];
  }
}
