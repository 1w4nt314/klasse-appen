import { NextResponse, type NextRequest } from "next/server";

// Holdes i sync med SESSION_COOKIE i lib/session.ts (proxy må ikke importere databasen).
const COOKIE = "klasse_session";

/**
 * Optimistisk tjek: uden session-cookie sendes man direkte til login.
 * Den egentlige kontrol af sessionen sker på siderne (requireTeacher).
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(COOKIE);
  const { pathname } = request.nextUrl;

  if (!hasSession && pathname.startsWith("/apps")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/apps/:path*"],
};
