"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <MaxWidthWrapper>
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-3xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. The page
              might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild variant="default">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              onClick={() => window.history.back()}
            >
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Need help? Contact our support team.</p>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
