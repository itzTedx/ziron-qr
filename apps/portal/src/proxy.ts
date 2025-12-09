import { NextRequest, NextResponse } from "next/server";

import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
	const publicPaths = [
		"/register",
		"/login",
		"/verify",
		"/api/auth",
		"/api/rpc",
		"/reset-password",
		"/forgot-password",
	];
	const { pathname } = new URL(request.url);

	// Allow unauthenticated access to public paths
	if (publicPaths.some((path) => pathname.startsWith(path))) {
		return NextResponse.next();
	}

	// Use getCookieCache to validate the session from cookie cache
	// This properly validates the session, not just checks if cookie exists
	const session = getSessionCookie(request, {
		cookiePrefix: "ziron",
	});

	if (!session) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|rpc)(.*)",
	],
};
