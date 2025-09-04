"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getWishlistCount } from "@/actions/wishlist.actions";

interface WishlistContextType {
  wishlistCount: number;
  refreshWishlistCount: () => Promise<void>;
  updateWishlistCount: (delta: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistCount, setWishlistCount] = useState(0);
  const { data: session } = useSession();

  const refreshWishlistCount = async () => {
    if (session?.user?.id) {
      const result = await getWishlistCount();
      if (result.success) {
        setWishlistCount(result.count);
      }
    } else {
      setWishlistCount(0);
    }
  };

  const updateWishlistCount = (delta: number) => {
    setWishlistCount((prev) => Math.max(0, prev + delta));
  };

  useEffect(() => {
    refreshWishlistCount();
  }, [session?.user?.id]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        refreshWishlistCount,
        updateWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
