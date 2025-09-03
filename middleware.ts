import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require auth
  const publicRoutes = ["/", "/sign-in", "/api/auth"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const adminPrefix = "/admin";
  const isAdminRoute =
    pathname === adminPrefix || pathname.startsWith(adminPrefix + "/");

  if (isPublicRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  if (isAdminRoute && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set(
      "callbackUrl",
      nextUrl.pathname + nextUrl.search
    );
    return NextResponse.redirect(signInUrl);
  }

  if (pathname === "/sign-in" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/overview", req.url));
  }

  if (pathname === "/admin" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/overview", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
