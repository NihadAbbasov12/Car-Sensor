import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "carsensor_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = pathname.startsWith("/cars");
  const isLoginRoute = pathname.startsWith("/login");
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && token) {
    const carsUrl = new URL("/cars", request.url);
    return NextResponse.redirect(carsUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/cars/:path*"],
};
