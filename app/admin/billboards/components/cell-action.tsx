"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { BillboardColumn } from "./columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { AlertModal } from "@/components/alert-modal";
import { onCopy } from "@/lib/utils";
import { deleteBillboard } from "@/actions/billboard.actions";

interface CellActionProps {
  data: BillboardColumn;
}

export const CellAction: FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteBillboard(data.id);
      toast.success("Billboard deleted.");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className={"h-8 w-8 p-0"}>
            <span className={"sr-only"}>Open menu</span>
            <MoreHorizontal className={"h-4 w-4"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={"end"}>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.name)}>
            <Copy className={"mr-2 h-4 w-4"} /> Copy Name
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/billboards/${data.id}`}>
              <Edit className={"mr-2 h-4 w-4"} /> Update
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className={"mr-2 h-4 w-4"} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
    </>
  );
};
