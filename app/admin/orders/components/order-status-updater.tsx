"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { updateOrderStatus } from "@/actions/order.actions";
import { toast } from "sonner";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

const statusOptions = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "PROCESSING",
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: OrderStatusUpdaterProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const currentStatusOption = statusOptions.find(
    (option) => option.value === currentStatus
  );

  const handleStatusUpdate = () => {
    if (selectedStatus === currentStatus) {
      toast.error("Please select a different status");
      return;
    }

    startTransition(async () => {
      const result = await updateOrderStatus(
        orderId,
        selectedStatus as OrderStatus
      );

      if (result.success) {
        toast.success(`Order status updated to ${selectedStatus}`);
      } else {
        toast.error(result.error || "Failed to update order status");
        setSelectedStatus(currentStatus);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Current Status:</span>
        <Badge className={currentStatusOption?.color}>
          {currentStatusOption?.label}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      option.color.split(" ")[0]
                    }`}
                  />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleStatusUpdate}
          disabled={isPending || selectedStatus === currentStatus}
          size="sm"
        >
          {isPending ? "Updating..." : "Update Status"}
        </Button>
      </div>
    </div>
  );
}
