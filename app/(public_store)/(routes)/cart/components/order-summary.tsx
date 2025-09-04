"use client";
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useCart } from "@/store/use-cart";
import type { CartItem } from "@/store/use-cart";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { createStripeCheckout } from "@/actions/stripe-checkout";

export const OrderSummary = () => {
  const { data } = useSession();
  const { items } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const cartTotal = items.reduce(
    (total: number, item: CartItem) => total + item.price,
    0
  );

  const orderItems = items.map((product: CartItem) => product.id);

  const handleCheckout = async () => {
    try {
      if (!data?.user) {
        return toast.error("Please sign in to continue");
      }

      if (orderItems.length === 0) {
        return toast.error("Your cart is empty");
      }

      setIsLoading(true);

      const { sessionUrl } = await createStripeCheckout(orderItems);

      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="mt-16 rounded-lg bg-gray-100 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <div className={"w-full"}>
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-sm font-medium text-gray-900">
              {isMounted ? (
                formatPrice(cartTotal)
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-base font-medium text-gray-900">
              Order Total
            </div>
            <div className="text-base font-medium text-gray-900">
              {isMounted ? (
                formatPrice(cartTotal)
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            disabled={
              isLoading ||
              !isMounted ||
              !data?.user ||
              !orderItems.length ||
              !cartTotal
            }
            type="submit"
            className="w-full"
            size="lg"
            onClick={handleCheckout}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Pay with Stripe
          </Button>
        </div>

        {!data?.user && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Please sign in to place an order
          </p>
        )}
      </div>
    </section>
  );
};
