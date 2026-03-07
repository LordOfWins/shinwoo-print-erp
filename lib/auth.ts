// src/lib/auth.ts
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "shinwoo_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-key";

/**
 * 간단한 HMAC-like 토큰 생성 (crypto 사용)
 * 환경변수 비밀번호가 맞으면 이 토큰을 쿠키에 저장
 */
export function generateSessionToken(): string {
  const payload = `authenticated:${AUTH_SECRET}`;
  // 간단한 해시: Base64 인코딩
  return Buffer.from(payload).toString("base64");
}

/**
 * 세션 토큰 검증
 */
export function verifySessionToken(token: string): boolean {
  const expected = generateSessionToken();
  return token === expected;
}

/**
 * 비밀번호 검증
 */
export function verifyPassword(password: string): boolean {
  const correctPassword = process.env.AUTH_PASSWORD;
  if (!correctPassword) {
    console.error("AUTH_PASSWORD 환경변수가 설정되지 않았습니다.");
    return false;
  }
  return password === correctPassword;
}

/**
 * 서버 컴포넌트에서 인증 상태 확인
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!sessionCookie?.value) return false;
  return verifySessionToken(sessionCookie.value);
}

export { AUTH_COOKIE_NAME };

