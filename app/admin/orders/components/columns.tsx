"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dateFormatted, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Order, OrderItem, ProductImage, User } from "@/generated/prisma";

export type OrderColumn = Order & {
  user: User;
  OrderItem: (OrderItem & {
    product: { name: string; images: ProductImage[] };
  })[];
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    header: "Order",
    accessorKey: "OrderItem",
    cell: ({ row }) => {
      const firstItem = row.original.OrderItem[0];
      const image = firstItem?.product.images?.[0];
      const name = firstItem?.product.name ?? "Order";
      const totalProducts = row.original.OrderItem.length;
      const address = row.original.address;
      return (
        <div className={"flex flex-col items-start relative"}>
          <Avatar className={"w-12 h-12 rounded-lg"}>
            {image?.url ? (
              <AvatarImage
                src={image.url}
                alt={name}
                className={"rounded-lg"}
              />
            ) : null}
            <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <p>Total {totalProducts} products in this order</p>
          <p>Address : {address}</p>
          <Link
            href={`/admin/orders/${row.original.id}`}
            className={"absolute right-0 top-0"}
          >
            <Badge>View Order</Badge>
          </Link>
        </div>
      );
    },
  },
  {
    header: "User",
    accessorKey: "user",
    cell: ({ row }) => <span>{row.original.user?.name ?? ""}</span>,
  },
  {
    header: "Total",
    accessorKey: "total",
    cell: ({ row }) => <span>{formatPrice(row.original.total)}</span>,
  },
  {
    header: "Customer",
    accessorKey: "customerName",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {row.original.customerName || "N/A"}
        </span>
        <span className="text-sm text-gray-500">
          {row.original.customerEmail || "N/A"}
        </span>
        <span className="text-sm text-gray-500">
          {row.original.phoneNumber || "N/A"}
        </span>
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "orderStatus",
    cell: ({ row }) => {
      const status = row.original.orderStatus;
      const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800",
        PROCESSING: "bg-blue-100 text-blue-800",
        SHIPPED: "bg-purple-100 text-purple-800",
        DELIVERED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
      };

      return (
        <Badge className={statusColors[status as keyof typeof statusColors]}>
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Date",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span>{dateFormatted(new Date(row.original.createdAt))}</span>
    ),
  },
];
