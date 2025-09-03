"use client";

import { Heading } from "@/components/heading";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, ProductColumn } from "./columns";

interface ProductClientProps {
  data: ProductColumn[];
}

const ProductClient = ({ data }: ProductClientProps) => {
  return (
    <>
      <div className={"flex items-center justify-between"}>
        <Heading
          title={`Products (${data.length})`}
          description={"Manage products for your store"}
        />
        <Link className={buttonVariants()} href={`/admin/products/new`}>
          <Plus className={"mr-2 h-4 w-4"} />
          Add New
        </Link>
      </div>
      <Separator />
      <DataTable searchKey={"name"} columns={columns} data={data} />
    </>
  );
};

export default ProductClient;
