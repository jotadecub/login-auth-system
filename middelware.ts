import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware function in all routes
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthRoute = pathname.startsWith("/login") ||
                        pathname.startsWith("/register") ||
                        pathname.startsWith("/forgot-password");
                        
    // Obtening the session cookie
    const sessionCookie = request.cookies.get("session");
    const isAuthenticated = !!sessionCookie;

    // Redirecting the authenticated user out of the auth routes
    if (isAuthenticated && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirecting the unauthenticated user to the login page
    if (!isAuthenticated && 
        !isAuthRoute &&
        !pathname.startsWith("/api") &&
        !pathname.startsWith("/_next") &&
        pathname !== "/") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// Configuring in which routes the middleware will run
export const config = {
    matcher: [
        // Protected routes
        "/dashboard/:path*",
        "/profile/:path*",
        "/settings/:path*",

        // Auth routes
        "/login/:path*",
        "/register/:path*",
        "/forgot-password/:path*",
    ]
}