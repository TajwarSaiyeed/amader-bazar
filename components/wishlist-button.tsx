"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/actions/wishlist.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/providers/wishlist-provider";

interface WishlistButtonProps {
  productId: string;
  initialWishlistState?: boolean;
  variant?: "default" | "icon";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function WishlistButton({
  productId,
  initialWishlistState = false,
  variant = "icon",
  size = "default",
  className,
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(initialWishlistState);
  const [isPending, startTransition] = useTransition();
  const { updateWishlistCount } = useWishlist();

  const handleToggleWishlist = () => {
    startTransition(async () => {
      const result = await toggleWishlist(productId);

      if (result.success) {
        const newWishlistState = result.inWishlist ?? false;
        setIsInWishlist(newWishlistState);

        // Update the wishlist count in the context
        if (newWishlistState) {
          updateWishlistCount(1);
        } else {
          updateWishlistCount(-1);
        }

        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleWishlist}
        disabled={isPending}
        className={cn(
          "absolute top-2 right-2 z-10 bg-white/80 hover:bg-white transition-all duration-200",
          className
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleToggleWishlist}
      disabled={isPending}
      className={cn("gap-2", className)}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
        )}
      />
      {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
}
