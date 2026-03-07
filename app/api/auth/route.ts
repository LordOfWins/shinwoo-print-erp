// src/app/api/auth/route.ts
import {
  AUTH_COOKIE_NAME,
  generateSessionToken,
  verifyPassword,
} from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth — 로그인
 * Body: { password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, message: "비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { success: false, message: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 세션 토큰 생성
    const token = generateSessionToken();

    // 응답에 쿠키 설정
    const response = NextResponse.json(
      { success: true, message: "로그인 성공" },
      { status: 200 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth — 로그아웃
 */
export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: "로그아웃 완료" },
    { status: 200 }
  );

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // 즉시 만료
  });

  return response;
}
