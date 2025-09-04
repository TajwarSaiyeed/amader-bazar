"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Edit,
  MoreHorizontal,
  Trash,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { AlertModal } from "@/components/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteUser, updateUserRole } from "@/actions/user.actions";

import { UserColumn } from "./columns";

interface CellActionProps {
  data: UserColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteUser(data.id);

      if (result.success) {
        toast.success("User deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("User ID copied to clipboard");
  };

  const onUpdateRole = (newRole: "USER" | "ADMIN") => {
    startTransition(async () => {
      const result = await updateUserRole(data.id, newRole);

      if (result.success) {
        toast.success(`User role updated to ${newRole}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update role");
      }
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/users/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {data.role === "USER" ? (
            <DropdownMenuItem
              onClick={() => onUpdateRole("ADMIN")}
              disabled={isPending}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Make Admin
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => onUpdateRole("USER")}
              disabled={isPending}
            >
              <UserX className="mr-2 h-4 w-4" />
              Remove Admin
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
