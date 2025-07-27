import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "droovo_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isPublicPath = ["/login", "/register"].some((path) =>
    pathname.startsWith(path)
  );

  const hasSession = Boolean(sessionCookie && sessionCookie !== "");

  // Si pas de session et essaie d'accéder à une route protégée
  if (!hasSession && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si session présente mais essaie d'accéder à /login ou /register
  if (hasSession && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|login|register).*)",
  ],
};
