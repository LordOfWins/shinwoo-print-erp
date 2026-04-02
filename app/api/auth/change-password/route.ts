import { hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "모든 항목을 입력해주세요" },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { message: "새 비밀번호는 최소 4자 이상이어야 합니다" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "새 비밀번호와 확인이 일치하지 않습니다" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(currentPassword);
    if (!isValid) {
      return NextResponse.json(
        { message: "현재 비밀번호가 올바르지 않습니다" },
        { status: 401 }
      );
    }

    const newHash = hashPassword(newPassword);

    await prisma.companyInfo.update({
      where: { id: 1 },
      data: { passwordHash: newHash },
    });

    return NextResponse.json(
      { message: "비밀번호가 변경되었습니다" },
      { status: 200 }
    );
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
