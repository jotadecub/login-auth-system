import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware function in all routes
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Determining routes for role
    const adminRoutes = ["/admin", "/dashboard/users", "/dashboard/roles"]
    const editorRoutes = ["/dashboard/content", "/dashboard/posts"]
    const authRoutes = ["/login", "/register", "/forgot-password"]
                        
    // Obtening the session cookie
    const sessionCookie = request.cookies.get("session");

    // Redirecting the authenticated user out of the auth routes
    if (!sessionCookie) {
        // If not have a session and this route requires authentication
        if (
            (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/profile")) &&
            !authRoutes.includes(pathname)
        ) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        return NextResponse.next()
    }

    try {
        // Parsing the session
        const session = JSON.parse(atob(sessionCookie.value.split(".")[1]));
        const userRole = session.role

        // Verify permissions based on the user role
        if (adminRoutes.some((route) => pathname.startsWith(route)) && 
        !["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
            return NextResponse.redirect(new URL("/unauthorized", request.url))
        }

        if (editorRoutes.some((route) => pathname.startsWith(route)) &&
        !["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
            return NextResponse.redirect(new URL("/unauthorized", request.url))
        }

        // Rediecting the authenticated user out of the auth routes
        if (authRoutes.some((route) => pathname.startsWith(route))) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
    } catch (error) {
        // If exists an error to parse the session, delete the cookie
        request.cookies.delete("session")
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

// Configuring in which routes the middleware will run
export const config = {
    matcher: [
        // Protected routes
        "/dashboard/:path*",
        "/admin/:path*",
        "/profile/:path*",
        // Auth routes
        "/login/:path*",
        "/register/:path*",
        "/forgot-password/:path*",
    ]
}