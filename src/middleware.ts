import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /lib routes
  if (!pathname.startsWith("/lib")) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/lib" || pathname === "/lib/";

  // Retrieve admin token from cookies
  const adminToken =
    req.cookies.get("admin_token")?.value ||
    req.cookies.get("adminToken")?.value ||
    req.cookies.get("token")?.value;

  const apiUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:5000/api";

  // Function to verify token with the backend server
  async function verifyAdminToken(token: string): Promise<boolean> {
    try {
      const res = await fetch(`${apiUrl}/admin/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(3500),
      });

      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data?.success && data?.data?.user?.role === "ADMIN");
    } catch {
      return false;
    }
  }

  // 1. If accessing the Admin Login page (/lib)
  if (isLoginPage) {
    if (adminToken) {
      const isValid = await verifyAdminToken(adminToken);
      if (isValid) {
        // Already authenticated as admin, redirect directly to dashboard
        return NextResponse.redirect(new URL("/lib/orders", req.url));
      }
    }
    // No valid token, allow seeing login form
    return NextResponse.next();
  }

  // 2. If accessing any protected admin route (/lib/orders, /lib/products, /lib/cashier, etc.)
  if (!adminToken) {
    const loginUrl = new URL("/lib", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the token with backend server
  const isValidAdmin = await verifyAdminToken(adminToken);

  if (!isValidAdmin) {
    const loginUrl = new URL("/lib", req.url);
    const response = NextResponse.redirect(loginUrl);
    // Securely wipe invalid admin cookies
    response.cookies.delete("admin_token");
    response.cookies.delete("adminToken");
    response.cookies.delete("token");
    return response;
  }

  // Authorized Admin -> Proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/lib/:path*"],
};
