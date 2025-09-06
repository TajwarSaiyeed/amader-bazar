"use client";

import { useState } from "react";
import { Search, ShoppingCart, Heart, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/use-cart";
import { useWishlist } from "@/providers/wishlist-provider";
import Link from "next/link";

interface FABProps {
  onSearchClick?: () => void;
}

export function FloatingActionButton({ onSearchClick }: FABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const { wishlistCount } = useWishlist();

  const toggleFAB = () => setIsOpen(!isOpen);

  const fabItems = [
    {
      icon: Search,
      label: "Search",
      onClick: onSearchClick,
      href: undefined,
      count: undefined,
    },
    {
      icon: ShoppingCart,
      label: "Cart",
      onClick: undefined,
      href: "/cart",
      count: items.length,
    },
    {
      icon: Heart,
      label: "Wishlist",
      onClick: undefined,
      href: "/dashboard/wishlist",
      count: wishlistCount,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      {/* FAB Items */}
      <div
        className={cn(
          "flex flex-col-reverse items-end space-y-reverse space-y-3 mb-3 transition-all duration-300",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {fabItems.map((item) => {
          const IconComponent = item.icon;
          const content = (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-2",
                "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                "transition-all duration-200 transform hover:scale-110"
              )}
              onClick={item.onClick}
            >
              <div className="relative">
                <IconComponent className="h-5 w-5" />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {item.count > 99 ? "99+" : item.count}
                  </span>
                )}
              </div>
              <span className="sr-only">{item.label}</span>
            </Button>
          );

          return (
            <div key={item.label} className="relative group">
              {/* Tooltip */}
              <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.label}
              </div>

              {item.href ? <Link href={item.href}>{content}</Link> : content}
            </div>
          );
        })}
      </div>

      {/* Main FAB Button */}
      <Button
        onClick={toggleFAB}
        className={cn(
          "h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90",
          "transition-all duration-300 transform hover:scale-110",
          isOpen && "rotate-45"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <Plus className="h-6 w-6 text-primary-foreground" />
        )}
        <span className="sr-only">Quick Actions</span>
      </Button>
    </div>
  );
}
