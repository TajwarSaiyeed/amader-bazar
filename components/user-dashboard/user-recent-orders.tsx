import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Package } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface UserRecentOrder {
  id: string;
  total: number;
  createdAt: Date;
  address: string;
  OrderItem: Array<{
    product: {
      name: string;
      price: number;
      images: Array<{
        url: string;
      }>;
    };
  }>;
}

interface UserRecentOrdersProps {
  recentOrders: UserRecentOrder[];
}

export function UserRecentOrders({ recentOrders }: UserRecentOrdersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <CardDescription>
            Your latest purchases and order status
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/orders">View All Orders</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Product Images */}
                <div className="flex -space-x-2">
                  {order.OrderItem.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="relative h-12 w-12 rounded-lg border-2 border-background overflow-hidden"
                    >
                      <Image
                        src={item.product.images[0]?.url || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ))}
                  {order.OrderItem.length > 3 && (
                    <div className="h-12 w-12 rounded-lg border-2 border-background bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">
                        +{order.OrderItem.length - 3}
                      </span>
                    </div>
                  )}
                </div>

                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm mb-1">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(order.createdAt, "MMM dd, yyyy 'at' HH:mm")}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Processing
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {order.OrderItem.slice(0, 2).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                      >
                        {item.product.name}
                      </span>
                    ))}
                    {order.OrderItem.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{order.OrderItem.length - 2} more items
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg">
                        ৳{order.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {order.address}
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders found</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
