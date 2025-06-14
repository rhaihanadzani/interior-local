import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default function withAuth(middleware, requireAuth) {
  return async (req, next) => {
    const pathname = req.nextUrl.pathname;

    // Cek apakah path termasuk yang memerlukan autentikasi
    const isProtectedPath = requireAuth.some((protectedPath) =>
      pathname.startsWith(protectedPath)
    );

    if (isProtectedPath) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      // Handle untuk route auth (login/register)
      if (pathname.startsWith("/auth")) {
        if (token) {
          // Jika sudah login, redirect ke dashboard
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        // Jika belum login, biarkan akses route auth
        return middleware(req, next);
      }

      // Handle untuk route dashboard
      if (pathname.startsWith("/dashboard")) {
        if (!token) {
          // Jika belum login, redirect ke login
          const url = new URL("/auth/login", req.url);
          url.searchParams.set("callbackUrl", encodeURI(req.url));
          return NextResponse.redirect(url);
        }

        // Cek akses admin
        const isAdminRoute = pathname.startsWith("/dashboard/admin");
        const isAdminUser =
          token.role === "admin" || token.role === "superAdmin";

        if (isAdminRoute && !isAdminUser) {
          // Jika bukan admin tapi mencoba akses route admin
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // if (!isAdminRoute && isAdminUser && pathname === "/dashboard") {
        //   // Jika admin mengakses dashboard utama, redirect ke dashboard admin
        //   return NextResponse.redirect(new URL("/dashboard/admin", req.url));
        // }
      }
    }

    return middleware(req, next);
  };
}
