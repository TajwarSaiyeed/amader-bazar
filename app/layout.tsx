import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/auth-provider";
import { WishlistProvider } from "@/providers/wishlist-provider";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalFooter } from "@/components/conditional-footer";
import { OrderSuccessHandler } from "@/components/order-success-handler";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amader Bazar",
  description: "An online marketplace for buying your daily needs.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <AuthProvider>
          <WishlistProvider>
            <Suspense>
              <OrderSuccessHandler />
            </Suspense>
            <main className={"relative flex flex-col min-h-screen"}>
              <div className={"flex-grow flex-1"}>
                {children}
                <Toaster richColors />
              </div>
              <ConditionalFooter />
            </main>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
