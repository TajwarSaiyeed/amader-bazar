"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";

export function OrderSuccessHandler() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const canceled = searchParams.get("canceled");

    if (success === "true" && sessionId) {
      // Payment was successful
      clearCart();
      toast.success("Payment successful! Your order has been placed.", {
        duration: 5000,
      });

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.toString());
    }

    if (canceled === "true") {
      // Payment was canceled
      toast.info("Payment was canceled. Your cart items are still saved.", {
        duration: 5000,
      });

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("canceled");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, clearCart]);

  return null; // This component doesn't render anything
}
