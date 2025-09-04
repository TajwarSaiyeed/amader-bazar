"use client";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { Cart } from "@/components/cart";
import { WishlistIcon } from "@/components/wishlist-icon";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconHeart,
} from "@tabler/icons-react";

const Navbar = () => {
  const session = useSession();
  const pathName = usePathname();
  const user = session.data?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="bg-white dark:bg-popover sticky z-50 top-0 inset-x-0 h-20">
      <header className="relative bg-white dark:bg-popover">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200 flex justify-between items-center">
            <div className="flex h-16 items-center gap-4">
              <Link
                href="/"
                className="font-bold uppercase text-primary flex items-center gap-2 justify-center"
              >
                <Image
                  src="/logo.png"
                  alt="Amader Bazar"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-contain dark:bg-white"
                  priority
                />
                <span className="hidden sm:block">Amader Bazar</span>
              </Link>
              <nav className="mx-6 hidden sm:flex items-center space-x-4 lg:space-x-6">
                <Link
                  href="/products"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    {
                      "text-primary font-semibold": pathName === "/products",
                      "text-muted-foreground": pathName !== "/products",
                    }
                  )}
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    {
                      "text-primary font-semibold": pathName === "/about",
                      "text-muted-foreground": pathName !== "/about",
                    }
                  )}
                >
                  About
                </Link>
              </nav>
            </div>
            <div className="flex gap-2 items-center">
              {!session.data?.user && (
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "text-primary border-primary hover:bg-primary hover:text-white transition-colors",
                  })}
                  href="/sign-in"
                >
                  Sign in
                </Link>
              )}
              {session.data?.user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent focus:outline-none">
                      <Avatar className="h-8 w-8 rounded-lg grayscale">
                        <AvatarImage
                          src={user?.image || "/logo.png"}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:grid text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user?.name || "User"}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {user?.email || ""}
                        </span>
                      </div>
                      <IconDotsVertical className="ml-1 hidden sm:block size-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={user?.image || "/logo.png"}
                            alt={user?.name || "User"}
                          />
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {user?.name || "User"}
                          </span>
                          <span className="text-muted-foreground truncate text-xs">
                            {user?.email || ""}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <IconUserCircle />
                          My Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/wishlist"
                          className="cursor-pointer"
                        >
                          <IconHeart />
                          My Wishlist
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconCreditCard />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconNotification />
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <IconLogout />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <WishlistIcon />
              {session.data?.user?.role !== "ADMIN" && <Cart />}
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
