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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
  IconHeart,
} from "@tabler/icons-react";
import { Menu, Home, Package, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { getCategories } from "@/actions/get-categories";

const Navbar = () => {
  const session = useSession();
  const pathName = usePathname();
  const user = session.data?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { categories: fetchedCategories } = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.log(e);
    }
  };

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };
  return (
    <div className="bg-white dark:bg-popover sticky z-50 top-0 inset-x-0 h-20">
      <header className="relative bg-white dark:bg-popover">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200 flex justify-between items-center">
            <div className="flex h-16 items-center gap-4">
              {/* Mobile Menu Trigger */}
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden p-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="px-6 pt-6 pb-4">
                    <SheetTitle className="flex items-center gap-2">
                      <Image
                        src="/logo.png"
                        alt="Amader Bazar"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-contain dark:bg-white"
                      />
                      Amader Bazar
                    </SheetTitle>
                    <SheetDescription>
                      Navigate through our store
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex flex-col space-y-6 px-6 pb-6 overflow-y-scroll flex-1">
                    {/* Main Navigation */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                        Navigation
                      </h3>
                      <div className="space-y-2">
                        <Link
                          href="/"
                          onClick={handleLinkClick}
                          className={cn(
                            "flex items-center gap-3 text-sm font-medium py-3 px-4 rounded-lg transition-colors hover:bg-accent",
                            {
                              "bg-accent text-accent-foreground":
                                pathName === "/",
                            }
                          )}
                        >
                          <Home className="h-4 w-4" />
                          Home
                        </Link>
                        <Link
                          href="/products"
                          onClick={handleLinkClick}
                          className={cn(
                            "flex items-center gap-3 text-sm font-medium py-3 px-4 rounded-lg transition-colors hover:bg-accent",
                            {
                              "bg-accent text-accent-foreground":
                                pathName === "/products",
                            }
                          )}
                        >
                          <Package className="h-4 w-4" />
                          All Products
                        </Link>
                        <Link
                          href="/about"
                          onClick={handleLinkClick}
                          className={cn(
                            "flex items-center gap-3 text-sm font-medium py-3 px-4 rounded-lg transition-colors hover:bg-accent",
                            {
                              "bg-accent text-accent-foreground":
                                pathName === "/about",
                            }
                          )}
                        >
                          <Info className="h-4 w-4" />
                          About
                        </Link>
                      </div>
                    </div>

                    {/* Categories */}
                    {categories.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                          Categories
                        </h3>
                        <div className="space-y-1">
                          {categories.slice(0, 6).map((category) => (
                            <Link
                              key={category.id}
                              href={`/products?category=${category.id}`}
                              onClick={handleLinkClick}
                              className="flex items-center text-sm py-3 px-4 rounded-lg transition-colors hover:bg-accent"
                            >
                              {category.name}
                            </Link>
                          ))}
                          {categories.length > 6 && (
                            <Link
                              href="/products"
                              onClick={handleLinkClick}
                              className="flex items-center text-sm py-3 px-4 rounded-lg transition-colors hover:bg-accent text-muted-foreground"
                            >
                              View all categories →
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* User Actions */}
                    {!session.data?.user && (
                      <div className="space-y-4 pt-6 mt-6 border-t">
                        <Link
                          href="/sign-in"
                          onClick={handleLinkClick}
                          className={buttonVariants({
                            className:
                              "w-full text-primary border-primary hover:bg-primary hover:text-white",
                          })}
                        >
                          Sign In
                        </Link>
                      </div>
                    )}

                    {session.data?.user && (
                      <div className="space-y-4 pt-6 mt-6 border-t">
                        <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user?.image || "/logo.png"}
                              alt={user?.name || "User"}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-sm">
                            <p className="font-medium">
                              {user?.name || "User"}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {user?.email || ""}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Link
                            href="/dashboard"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-lg transition-colors hover:bg-accent"
                          >
                            <IconUserCircle className="h-4 w-4" />
                            My Dashboard
                          </Link>
                          <Link
                            href="/dashboard/wishlist"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-lg transition-colors hover:bg-accent"
                          >
                            <IconHeart className="h-4 w-4" />
                            My Wishlist
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              handleLinkClick();
                            }}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-lg transition-colors hover:bg-accent w-full text-left"
                          >
                            <IconLogout className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

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
              <nav className="mx-6 hidden md:flex items-center space-x-4 lg:space-x-6">
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
