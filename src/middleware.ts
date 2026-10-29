import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getApiUrl } from "@/src/lib/apiUrl";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/lib")) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/lib" || pathname === "/lib/";

  const adminToken =
    req.cookies.get("admin_token")?.value ||
    req.cookies.get("adminToken")?.value ||
    req.cookies.get("token")?.value;

  const apiUrl = getApiUrl();

  async function verifyAdminToken(token: string): Promise<boolean> {
    try {
      const res = await fetch(`${apiUrl}/admin/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(3500),
      });

      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data?.success && data?.data?.user?.role === "ADMIN");
    } catch {
      return false;
    }
  }

  if (isLoginPage) {
    if (adminToken) {
      const isValid = await verifyAdminToken(adminToken);
      if (isValid) {
        return NextResponse.redirect(new URL("/lib/orders", req.url));
      }
    }

    return NextResponse.next();
  }

  if (!adminToken) {
    const loginUrl = new URL("/lib", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const isValidAdmin = await verifyAdminToken(adminToken);

  if (!isValidAdmin) {
    const loginUrl = new URL("/lib", req.url);
    const response = NextResponse.redirect(loginUrl);

    response.cookies.delete("admin_token");
    response.cookies.delete("adminToken");
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/lib/:path*"],
};
