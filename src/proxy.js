import { NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/jwt";

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get(COOKIE_NAME)?.value;

    const isAdminLogin = pathname === "/admin/login";

    const isAdminRoute = pathname.startsWith("/admin");

    const isCustomerProtectedRoute = [
        "/profile",
        "/orders",
        "/checkout",
    ].some(
        (path) =>
            pathname === path ||
            pathname.startsWith(`${path}/`)
    );

    // Public pages do not need authentication
    if (!isAdminRoute && !isCustomerProtectedRoute) {
        return NextResponse.next();
    }

    // Allow access to admin login page
    if (isAdminLogin && !token) {
        return NextResponse.next();
    }

    // Verify token
    const decoded = token ? await verifyToken(token) : null;

    if (!decoded) {
        const response = NextResponse.redirect(
            new URL(
                isAdminRoute ? "/admin/login" : "/login",
                request.url
            )
        );

        response.cookies.delete(COOKIE_NAME);

        return response;
    }

    // Admin pages require admin role
    if (isAdminRoute && decoded.role !== "admin") {
        return NextResponse.redirect(
            new URL("/", request.url)
        );
    }

    // Admins visiting admin login can go to dashboard
    if (isAdminLogin && decoded.role === "admin") {
        return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/profile/:path*",
        "/orders/:path*",
        "/checkout/:path*",
    ],
};