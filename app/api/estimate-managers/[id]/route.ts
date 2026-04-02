import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const managerId = Number(id);
    if (isNaN(managerId)) {
      return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, title, phone, email, isDefault } = body;

    if (isDefault) {
      await prisma.estimateManager.updateMany({
        where: { isDefault: true, id: { not: managerId } },
        data: { isDefault: false },
      });
    }

    const manager = await prisma.estimateManager.update({
      where: { id: managerId },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(title !== undefined ? { title: title?.trim() || null } : {}),
        ...(phone !== undefined ? { phone: phone?.trim() || null } : {}),
        ...(email !== undefined ? { email: email?.trim() || null } : {}),
        ...(isDefault !== undefined ? { isDefault } : {}),
      },
    });

    return NextResponse.json(manager);
  } catch (error) {
    console.error("견적 담당자 수정 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const managerId = Number(id);
    if (isNaN(managerId)) {
      return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
    }

    await prisma.estimateManager.update({
      where: { id: managerId },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "삭제되었습니다" });
  } catch (error) {
    console.error("견적 담당자 삭제 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
