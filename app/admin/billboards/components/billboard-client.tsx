"use client";
import { Heading } from "@/components/heading";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { BillboardColumn, columns } from "./index";

interface BillboardClientProps {
  data: BillboardColumn[];
}

const BillboardClient = ({ data }: BillboardClientProps) => {
  return (
    <>
      <div className={"flex items-center justify-between"}>
        <Heading
          title={`Billboards (${data.length})`}
          description={"Manage billboards for your store"}
        />
        <Link className={buttonVariants()} href={`/admin/billboards/new`}>
          <Plus className={"mr-2 h-4 w-4"} />
          Add New
        </Link>
      </div>
      <Separator />
      <DataTable searchKey={"name"} columns={columns} data={data} />
    </>
  );
};

export default BillboardClient;
