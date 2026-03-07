// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "shinwoo_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 로그인 페이지, API 인증 경로, 정적 파일은 통과
  const isPublicPath =
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 세션 쿠키 확인
  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!sessionToken) {
    // 쿠키 없으면 로그인 페이지로 리다이렉트
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 쿠키가 있으면 통과 (토큰 유효성은 간단히 존재 여부로 체크)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 경로에서 실행:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
