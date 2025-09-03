"use client";

import * as React from "react";
import {
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconReport,
} from "@tabler/icons-react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/admin/overview",
      icon: IconDashboard,
    },
    {
      title: "Billboards",
      url: "/admin/billboards",
      icon: IconReport,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: IconFolder,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: IconReport,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: IconListDetails,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Amader Bazar"
                  width={50}
                  height={50}
                />
                <span className="text-base font-semibold">Amader Bazar</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "User",
            email: (user as { email?: string })?.email ?? "",
            avatar: (user as { image?: string })?.image ?? "/logo.png",
          }}
          onLogout={handleLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
