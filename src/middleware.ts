import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Log environment status on first load
console.log("[Middleware] 🔧 Environment check:", {
    hasClerkPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
    clerkPublishableKeyPrefix: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 10) + "...",
    nodeEnv: process.env.NODE_ENV,
});

const clerk = clerkMiddleware();

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Log all API requests for debugging
    if (pathname.startsWith("/api/")) {
        console.log(`[Middleware] ➡️  ${req.method} ${pathname}`, {
            contentType: req.headers.get("content-type")?.substring(0, 50),
            contentLength: req.headers.get("content-length"),
            hasAuth: !!req.headers.get("authorization") || !!req.cookies.get("__session"),
        });
    }

    try {
        const response = await clerk(req, {} as any);
        if (pathname.startsWith("/api/")) {
            console.log(`[Middleware] ✅ ${pathname} - Clerk passed`);
        }
        return response;
    } catch (error: any) {
        console.error(`[Middleware] ❌ ${pathname} - Clerk error:`, error?.message || error);
        // Don't block the request if Clerk fails - let the route handler decide
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
