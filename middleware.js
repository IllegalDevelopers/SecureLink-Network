import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  // 🔥 protected routes
  const protectedPaths = ["/dashboard"];

  const isProtected = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  // 🔒 check auth cookie
  const token = req.cookies.get("authToken");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}