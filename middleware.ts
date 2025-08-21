import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Public pages that do NOT require login
  const publicPages = ["/", "/login", "/register"];

  // If route is public, allow access
  if (publicPages.includes(pathname)) {
    if (token && (pathname === "/login" || pathname === "/register")) {
      // logged in user trying to access auth page → redirect home
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Otherwise, route is protected
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
