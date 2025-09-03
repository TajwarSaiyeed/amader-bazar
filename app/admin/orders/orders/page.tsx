import MaxWidthWrapper from "@/components/max-width-wrapper";
import prisma from "@/lib/prisma";
import OrdersClient from "./components/orders-client";

const OrdersPage = async () => {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      OrderItem: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          {orders && <OrdersClient data={orders} />}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
export const dynamic = "force-dynamic";
export default OrdersPage;
