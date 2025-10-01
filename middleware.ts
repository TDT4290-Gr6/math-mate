// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Example auth check
function isAuthenticated(req: NextRequest) {
  return false; // true if user is logged in
}

/* export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip /login
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // If not authenticated, redirect locally to /login
  if (!isAuthenticated(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
} */

// Run on all routes except login and API
export const config = {
  matcher: ["/((?!login|api).*)"],
};
