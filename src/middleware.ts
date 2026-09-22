import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";
    const isApiAdmin = req.nextUrl.pathname.startsWith("/api/admin");

    // Allow login page without auth
    if (isLoginPage) {
      if (token) {
        // Already logged in → redirect to dashboard
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    // Protect all /admin/* and /api/admin/*
    if ((isAdminRoute || isApiAdmin) && !token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Optional: check role
    if (token && token.role !== "ADMIN" && token.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Let the middleware function handle the logic
        // For login page we allow even without token
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
