import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getOrderDetails } from "@/actions/order.actions";
import Image from "next/image";
import { dateFormatted } from "@/lib/utils";

type OrderDetailsProps = {
  params: Promise<{
    orderId: string;
  }>;
};

const OrderDetails = async ({ params }: OrderDetailsProps) => {
  const { orderId } = await params;
  const { order, error } = await getOrderDetails(orderId);

  if (error) {
    return (
      <MaxWidthWrapper>
        <div className={"flex-col"}>
          <div className={"flex-1 space-y-4 p-8 pt-6"}>
            <div className="text-center text-red-500">{error}</div>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  if (!order) {
    return (
      <MaxWidthWrapper>
        <div className={"flex-col"}>
          <div className={"flex-1 space-y-4 p-8 pt-6"}>
            <div className="text-center text-red-500">Order not found</div>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          <Card>
            <CardHeader>
              <CardTitle>Order #{orderId}</CardTitle>
              <span className="text-sm font-normal leading-none md:text-base">
                <Badge className="mr-1">Shipped</Badge>
                Your order has been shipped
              </span>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="grid gap-1 text-sm">
                    <div className="font-medium">Order Id</div>
                    <div>#{orderId}</div>
                  </div>
                </div>
                <div>
                  <div className="grid gap-1 text-sm">
                    <div className="font-medium">Order date</div>
                    <div>{dateFormatted(new Date(order.createdAt))}</div>
                  </div>
                </div>
                <div>
                  <div className="grid gap-1 text-sm">
                    <div className="font-medium">Shipping method</div>
                    <div>Standard shipping</div>
                  </div>
                </div>
                <div>
                  <div className="grid gap-1 text-sm">
                    <div className="font-medium">Transaction Id</div>
                    <div>{order.transactionId}</div>
                  </div>
                </div>
                <div>
                  <div className="grid gap-1 text-sm">
                    <div className="font-medium">Total amount</div>
                    <div>৳{order.total}</div>
                  </div>
                </div>
                <div>
                  <div className="grid gap-1 text-sm">
                    <div className="font-medium">Payment method</div>
                    <div>Bkash</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order &&
                      order.OrderItem.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                                <Image
                                  src={item.product.images[0].url}
                                  alt={item.product.name}
                                  fill
                                  sizes="64px"
                                  className={"object-cover rounded-lg"}
                                />
                              </div>
                              <div>
                                <div>{item.product.name}</div>
                                <div className="text-sm text-gray-500">
                                  {item.product.category.name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>1</TableCell>
                          <TableCell>৳{item.product.price}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default OrderDetails;
