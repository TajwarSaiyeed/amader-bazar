"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HelpCircle,
  Package,
  RefreshCw,
  MessageCircle,
  Shield,
  FileText,
} from "lucide-react";

const helpNavItems = [
  {
    title: "Help Center",
    href: "/help",
    icon: HelpCircle,
  },
  {
    title: "Shipping Info",
    href: "/shipping",
    icon: Package,
  },
  {
    title: "Returns & Exchanges",
    href: "/returns",
    icon: RefreshCw,
  },
  {
    title: "FAQ",
    href: "/faq",
    icon: MessageCircle,
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    icon: Shield,
  },
  {
    title: "Terms of Service",
    href: "/terms",
    icon: FileText,
  },
];

export function HelpNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mb-8">
      <div className="flex flex-wrap gap-2">
        {helpNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
