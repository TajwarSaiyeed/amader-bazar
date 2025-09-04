import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ShoppingCart } from "lucide-react";
import { format } from "date-fns";

interface RecentOrder {
  id: string;
  total: number;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
  } | null;
  OrderItem: Array<{
    product: {
      name: string;
      price: number;
    };
  }>;
}

interface RecentOrdersProps {
  recentOrders: RecentOrder[];
}

export function RecentOrders({ recentOrders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Orders
        </CardTitle>
        <CardDescription>Latest customer orders and activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {order.user?.name || "Guest User"}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {order.OrderItem.length} items
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {order.user?.email || "No email"}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {order.OrderItem.slice(0, 2).map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {item.product.name}
                      </Badge>
                    ))}
                    {order.OrderItem.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{order.OrderItem.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    ৳{order.total.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(order.createdAt, "MMM dd, HH:mm")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent orders found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
