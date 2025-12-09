import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Proxy function for request handling
 *
 * NOTE: Page visit tracking is handled in server components using server actions
 * (see apps/client/src/app/[slug]/page.tsx). This proxy is kept for potential
 * future use cases like request logging, rate limiting, or other middleware needs.
 *
 * Page visits are tracked via the trackPageVisit() server action in the page component,
 * which provides proper access to cardId and uses the after() function for non-blocking logging.
 */
export function proxy(_request: NextRequest, _event: NextFetchEvent) {
	// Page visit tracking is handled in server components via trackPageVisit() server action
	// This ensures we have access to cardId and proper context
	// No need to track here to avoid conflicts and duplicate tracking

	return NextResponse.next();
}

/**
 * Matcher configuration - only run proxy on specific paths
 * Exclude API routes, static files, and Next.js internals
 */
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
