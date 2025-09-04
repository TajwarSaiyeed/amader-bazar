"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/providers/wishlist-provider";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function WishlistIcon() {
  const { wishlistCount } = useWishlist();
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <Link href="/dashboard/wishlist">
      <Button variant="ghost" size="icon" className="relative hover:bg-accent">
        <Heart className="h-5 w-5" />
        {wishlistCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {wishlistCount > 99 ? "99+" : wishlistCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
