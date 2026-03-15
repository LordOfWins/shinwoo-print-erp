// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME || "shinwoo_session";

const PUBLIC_PATHS = ["/login", "/api/auth"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일 스킵
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 공개 경로 허용
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 인증 확인
  const session = request.cookies.get(AUTH_COOKIE);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // "/" 또는 "/dashboard" -> "/orders" 리다이렉트
  if (pathname === "/" || pathname === "/dashboard") {
    const ordersUrl = new URL("/orders", request.url);
    return NextResponse.redirect(ordersUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 요청에 대해 실행:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
