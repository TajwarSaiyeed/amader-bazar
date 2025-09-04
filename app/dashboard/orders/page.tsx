import { Suspense } from "react";
import { getUserOrders } from "@/actions/user-dashboard.actions";
import { Heading } from "@/components/heading";
import { UserOrdersList } from "@/components/user-dashboard/user-orders-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function UserOrdersContent() {
  const orders = await getUserOrders();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title="My Orders"
          description="Track and manage all your orders"
        />
        <Button asChild>
          <Link href="/products">
            <Plus className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <UserOrdersList orders={orders} />
    </div>
  );
}

export default function UserOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col space-y-6">
          <Heading title="My Orders" description="Loading your orders..." />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                  <div className="h-6 w-20 bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <UserOrdersContent />
    </Suspense>
  );
}
