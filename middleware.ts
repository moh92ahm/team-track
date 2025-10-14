// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("payload-token")?.value;
  const path = req.nextUrl.pathname;

  // Allow Payload admin panel & API
  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return NextResponse.next();
  }

  // Protect everything else on team.elaramedical.com
  if (!token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|admin|_next|static|favicon.ico).*)"],
};
