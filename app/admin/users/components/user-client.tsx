"use client";

import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, UserColumn } from "./columns";

interface UserClientProps {
  data: UserColumn[];
}

const UserClient = ({ data }: UserClientProps) => {
  return (
    <>
      <div className={"flex items-center justify-between"}>
        <Heading
          title={`Users (${data.length})`}
          description={"Manage users and their roles"}
        />
      </div>
      <Separator />
      <DataTable searchKey={"name"} columns={columns} data={data} />
    </>
  );
};

export default UserClient;
