import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  parseTokens,
  sessionCookieOptions,
  validSessionValues,
} from "@/lib/auth";

/**
 * Защита всего демо-стенда.
 * Без валидной httpOnly cookie "demo_session" доступны только:
 * /login, /api/login, публичные акты /act/*, robots.txt и статика.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isPublic =
    pathname === "/robots.txt" ||
    pathname.startsWith("/act/") ||
    pathname.startsWith("/api/login");

  if (isPublic) return NextResponse.next();

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const authorized = !!session && validSessionValues().has(session);

  if (pathname === "/login") {
    // Персональная ссылка лида: /login?token=xxxx — валидный токен
    // сразу ставит cookie на 72 часа и уводит на дашборд.
    const token = searchParams.get("token");
    if (token) {
      const label = parseTokens(process.env.DEMO_TOKENS).get(token);
      if (label) {
        const response = NextResponse.redirect(
          new URL("/dashboard", request.url),
        );
        response.cookies.set(SESSION_COOKIE, label, sessionCookieOptions());
        return response;
      }
    }
    if (authorized) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!authorized) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png).*)"],
};
