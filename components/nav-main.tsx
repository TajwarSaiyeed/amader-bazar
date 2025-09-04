"use client";

import { type Icon } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
  title,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  title?: string;
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      {title && (
        <div className="px-2 py-1">
          <div className="text-xs font-medium text-sidebar-foreground/70">
            {title}
          </div>
        </div>
      )}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={
                  pathname === item.url || pathname.startsWith(item.url + "/")
                }
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
