import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getStatusConfig = (orderStatus: string) => {
    const configs = {
      PENDING: {
        variant: "outline" as const,
        label: "Pending",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      PROCESSING: {
        variant: "secondary" as const,
        label: "Processing",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      SHIPPED: {
        variant: "default" as const,
        label: "Shipped",
        className: "bg-purple-50 text-purple-700 border-purple-200",
      },
      DELIVERED: {
        variant: "default" as const,
        label: "Delivered",
        className: "bg-green-50 text-green-700 border-green-200",
      },
      CANCELLED: {
        variant: "destructive" as const,
        label: "Cancelled",
        className: "bg-red-50 text-red-700 border-red-200",
      },
    };

    return (
      configs[orderStatus as keyof typeof configs] || {
        variant: "outline" as const,
        label: orderStatus,
        className: "bg-gray-50 text-gray-700 border-gray-200",
      }
    );
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
}
