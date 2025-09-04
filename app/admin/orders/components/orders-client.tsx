"use client";
import { FC } from "react";

import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { columns, OrderColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrdersClient: FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <div className={"flex items-center justify-between"}>
        <Heading
          title={`Orders (${data.length})`}
          description={"Manage categories for your store"}
        />
      </div>
      <Separator />
      <DataTable searchKey={"customerName"} columns={columns} data={data} />
    </>
  );
};

export default OrdersClient;
