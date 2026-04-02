import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "shinwoo_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-key";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");
  return `${salt}:${hash}`;
}

export function verifyHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");
  return computed === hash;
}

export function generateSessionToken(): string {
  const payload = `authenticated:${AUTH_SECRET}`;
  return Buffer.from(payload).toString("base64");
}

export function verifySessionToken(token: string): boolean {
  const expected = generateSessionToken();
  return token === expected;
}

export async function verifyPassword(password: string): Promise<boolean> {
  try {
    const company = await prisma.companyInfo.findFirst({
      where: { id: 1 },
      select: { passwordHash: true },
    });

    if (company?.passwordHash) {
      return verifyHash(password, company.passwordHash);
    }
  } catch {
    // DB 조회 실패 시 .env 폴백
  }

  const correctPassword = process.env.AUTH_PASSWORD;
  if (!correctPassword) {
    console.error("AUTH_PASSWORD 환경변수가 설정되지 않았습니다.");
    return false;
  }
  return password === correctPassword;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!sessionCookie?.value) return false;
  return verifySessionToken(sessionCookie.value);
}

export { AUTH_COOKIE_NAME };
