import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const managers = await prisma.estimateManager.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json(managers);
  } catch (error) {
    console.error("견적 담당자 목록 조회 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, phone, email, isDefault } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: "이름은 필수입니다" },
        { status: 400 }
      );
    }

    if (isDefault) {
      await prisma.estimateManager.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const manager = await prisma.estimateManager.create({
      data: {
        name: name.trim(),
        title: title?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(manager, { status: 201 });
  } catch (error) {
    console.error("견적 담당자 등록 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
