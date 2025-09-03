"use client";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { Cart } from "@/components/cart";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SearchBar from "./search-bar";
import Image from "next/image";
import { Suspense } from "react";

const Navbar = () => {
  const session = useSession();
  const pathName = usePathname();
  return (
    <div className="bg-white dark:bg-popover sticky z-50 top-0 inset-x-0 h-20">
      <header className="relative bg-white dark:bg-popover">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200 flex justify-between items-center">
            <div className="flex h-16 items-center gap-4">
              <Link
                href="/"
                className="font-bold uppercase text-primary flex items-center gap-2"
              >
                <Image
                  src="/logo.png"
                  alt="Amader Bazar"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-contain dark:bg-white"
                  priority
                />
                <span className="hidden sm:block">Online Hut</span>
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
              <div className="hidden md:block">
                <Suspense fallback={<div className="w-32 h-9 bg-slate-100 rounded animate-pulse" />}>
                  <SearchBar />
                </Suspense>
              </div>
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
              {session.data?.user?.role !== "ADMIN" && <Cart />}
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
