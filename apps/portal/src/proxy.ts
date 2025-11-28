import { NextRequest, NextResponse } from "next/server";

import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const publicPaths = [
    "/register",
    "/login",
    "/onboarding",
    "/verify",
    "/api/auth",
    "/reset-password",
    "/forgot-password",
  ];
  const { pathname } = new URL(request.url);

  // Allow unauthenticated access to public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "ziron",
  });
  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|.*\\.png$).*)"], // Specify the routes the middleware applies to
};

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/api/auth/:path*",
//   ],
// };
