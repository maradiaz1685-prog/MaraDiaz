import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_API_PREFIXES = [
  "/api/services",
  "/api/courses",
  "/api/products",
  "/api/employees",
  "/api/settings",
  "/api/schedule",
  "/api/upload",
  "/api/distributors",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isProtectedApi = PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminPage = pathname.startsWith("/admin");

  if (isProtectedApi || isAdminPage) {
    const { response, user } = await updateSession(req);

    if (!user) {
      if (isProtectedApi) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/services/:path*",
    "/api/courses/:path*",
    "/api/products/:path*",
    "/api/employees/:path*",
    "/api/settings/:path*",
    "/api/schedule/:path*",
    "/api/upload/:path*",
    "/api/distributors/:path*",
  ],
};
