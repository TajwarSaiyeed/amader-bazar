import { getUserOrderById } from "@/actions/user-dashboard.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Package, Truck } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface OrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { orderId } = await params;
  const order = await getUserOrderById(orderId);

  if (!order) {
    notFound();
  }

  const getOrderStatusBadge = (orderStatus: string) => {
    const statusConfig = {
      PENDING: { variant: "outline" as const, label: "Pending" },
      PROCESSING: { variant: "secondary" as const, label: "Processing" },
      SHIPPED: { variant: "default" as const, label: "Shipped" },
      DELIVERED: { variant: "default" as const, label: "Delivered" },
      CANCELLED: { variant: "destructive" as const, label: "Cancelled" },
    };

    return (
      statusConfig[orderStatus as keyof typeof statusConfig] || {
        variant: "outline" as const,
        label: orderStatus,
      }
    );
  };

  const orderStatusConfig = getOrderStatusBadge(order.orderStatus);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                Order #{order.id.slice(-8).toUpperCase()}
              </CardTitle>
              <CardDescription>
                Placed on{" "}
                {format(order.createdAt, "MMMM dd, yyyy 'at' hh:mm a")}
              </CardDescription>
            </div>
            <Badge variant={orderStatusConfig.variant}>
              {orderStatusConfig.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Order Total</p>
                <p className="text-lg font-bold">৳{order.total.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Order Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(order.createdAt, "MMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground">
                  {orderStatusConfig.label}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.OrderItem.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.OrderItem.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="relative aspect-square w-16 h-16 rounded-lg overflow-hidden">
                    {item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-5">
                      {item.product.name}
                    </h4>
                    {item.product.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        Price: ৳{item.product.price}
                      </span>
                      <span className="font-medium">
                        ৳{item.product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.OrderItem.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product.name}</span>
                  <span>৳{item.product.price.toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-muted-foreground">
                      {format(order.createdAt, "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                  </div>
                </div>

                {order.orderStatus !== "PENDING" && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div>
                      <p className="text-sm font-medium">Order Confirmed</p>
                      <p className="text-xs text-muted-foreground">
                        {format(order.updatedAt, "MMM dd, yyyy 'at' hh:mm a")}
                      </p>
                    </div>
                  </div>
                )}

                {["SHIPPED", "DELIVERED"].includes(order.orderStatus) && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div>
                      <p className="text-sm font-medium">Shipped</p>
                      <p className="text-xs text-muted-foreground">
                        {format(order.updatedAt, "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                )}

                {order.orderStatus === "DELIVERED" && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Delivered
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(order.updatedAt, "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                )}

                {order.orderStatus === "CANCELLED" && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div>
                      <p className="text-sm font-medium text-red-600">
                        Cancelled
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(order.updatedAt, "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user.email}
                  </p>
                </div>
                {order.address && (
                  <div>
                    <p className="text-sm font-medium">Delivery Address</p>
                    <p className="text-sm text-muted-foreground">
                      {order.address}
                    </p>
                  </div>
                )}
                {order.phoneNumber && (
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {order.phoneNumber}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
