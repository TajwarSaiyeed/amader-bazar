import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { subDays, format } from "date-fns";

export async function getUserDashboardData() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);

    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSpent,
      wishlistCount,
      recentOrders,
      monthlyOrders,
      orderHistory,
    ] = await Promise.all([
      // Total orders count
      prisma.order.count({
        where: { userId },
      }),

      // Pending orders (you might want to add status field to Order model)
      prisma.order.count({
        where: {
          userId,
          // createdAt: { gte: subDays(now, 7) } // Recent orders as "pending"
        },
      }),

      // Completed orders (older than 7 days)
      prisma.order.count({
        where: {
          userId,
          // createdAt: { lt: subDays(now, 7) }
        },
      }),

      // Total amount spent
      prisma.order.aggregate({
        where: { userId },
        _sum: { total: true },
      }),

      // Wishlist items count
      prisma.wishlist.count({
        where: { userId },
      }),

      // Recent orders with details
      prisma.order.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          OrderItem: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                  images: { take: 1 },
                },
              },
            },
          },
        },
      }),

      // Monthly orders for chart
      prisma.order.findMany({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
        select: {
          createdAt: true,
          total: true,
          OrderItem: {
            select: { id: true },
          },
        },
      }),

      // Order history for chart (last 12 months)
      prisma.order.groupBy({
        by: ["createdAt"],
        where: {
          userId,
          createdAt: {
            gte: subDays(now, 365),
          },
        },
        _sum: {
          total: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    // Process monthly data for chart
    const ordersByDate: Record<string, { amount: number; orders: number }> = {};

    // Initialize all days with zero values
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(now, i), "yyyy-MM-dd");
      ordersByDate[date] = { amount: 0, orders: 0 };
    }

    // Populate with actual data
    monthlyOrders.forEach((order) => {
      const date = format(order.createdAt, "yyyy-MM-dd");
      if (ordersByDate[date]) {
        ordersByDate[date].amount += order.total;
        ordersByDate[date].orders += 1;
      }
    });

    // Convert to chart data format
    const chartData = Object.entries(ordersByDate).map(([date, data]) => ({
      date,
      amount: data.amount,
      orders: data.orders,
    }));

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSpent: totalSpent._sum.total || 0,
      wishlistCount,
      recentOrders,
      chartData,
    };
  } catch (error) {
    console.error("User dashboard data fetch error:", error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalSpent: 0,
      wishlistCount: 0,
      recentOrders: [],
      chartData: [],
    };
  }
}

export async function getUserOrders() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        OrderItem: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: { take: 1 },
              },
            },
          },
        },
      },
    });

    return orders;
  } catch (error) {
    console.error("User orders fetch error:", error);
    return [];
  }
}

export async function getUserProfile() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("User profile fetch error:", error);
    return null;
  }
}

export async function getUserOrderById(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id, // Ensure user can only access their own orders
      },
      include: {
        OrderItem: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                images: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return order;
  } catch (error) {
    console.error("User order by ID fetch error:", error);
    return null;
  }
}
