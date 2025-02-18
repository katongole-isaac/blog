import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import auth from "./lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("x-auth-token")?.value;

  if (req.method.toLowerCase() === "get" && req.nextUrl.pathname.startsWith("/api/auth/uploads")) return NextResponse.next();

  if (!token && req.nextUrl.pathname.startsWith("/d")) return NextResponse.redirect(new URL("/login", req.url));

  const decoded = await auth.verifyToken(token || "");

  // no need of logging in again
  if (decoded && req.nextUrl.pathname.startsWith("/login") && token) return NextResponse.redirect(new URL("/d", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/d/:path*", "/api/blogs/uploads/:path*", "/login"],
};
