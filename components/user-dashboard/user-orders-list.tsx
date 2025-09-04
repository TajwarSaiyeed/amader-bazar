import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Package } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface UserOrder {
  id: string;
  total: number;
  createdAt: Date;
  address: string;
  phoneNumber: string;
  stripePaymentIntentId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  paymentStatus: string;
  orderStatus: string;
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

interface UserOrdersListProps {
  orders: UserOrder[];
}

export function UserOrdersList({ orders }: UserOrdersListProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-sm mb-6">
              You haven&apos;t placed any orders yet.
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Order #{order.id.slice(-8).toUpperCase()}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed on{" "}
                  {format(order.createdAt, "MMMM dd, yyyy 'at' HH:mm")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    order.orderStatus === "DELIVERED"
                      ? "default"
                      : order.orderStatus === "SHIPPED"
                      ? "default"
                      : order.orderStatus === "PROCESSING"
                      ? "secondary"
                      : order.orderStatus === "CANCELLED"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {order.orderStatus}
                </Badge>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {order.OrderItem.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-lg border overflow-hidden">
                    <Image
                      src={item.product.images[0]?.url || "/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ৳{item.product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Customer Info</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerName || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerEmail || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Payment Status</p>
                  <Badge
                    variant={
                      order.paymentStatus === "paid" ? "default" : "destructive"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Stripe Payment ID</p>
                  <p className="text-sm text-muted-foreground">
                    {order.stripePaymentIntentId
                      ? order.stripePaymentIntentId.slice(-8)
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">
                    ৳{order.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Invoice
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/orders/${order.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
