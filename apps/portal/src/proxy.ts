import { NextRequest, NextResponse } from "next/server";

import { getSession } from "./features/auth/actions/user";

export async function proxy(request: NextRequest) {
  const session = await getSession();

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Required for auth.api calls
  matcher: ["/dashboard"], // Specify the routes the middleware applies to
};

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/api/auth/:path*",
//   ],
// };
