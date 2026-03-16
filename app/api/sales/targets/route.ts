import { prisma } from "@/lib/prisma";
import { salesTargetFormSchema } from "@/lib/validators/sales";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/sales/targets?year=2026 — 해당 연도 12개월 목표 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const year = Number(searchParams.get("year")) || new Date().getFullYear();

    const targets = await prisma.salesTarget.findMany({
      where: { year },
      orderBy: { month: "asc" },
    });

    // 12개월 전체 배열로 반환 (없는 월은 0)
    const result = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = targets.find((t) => t.month === month);
      return {
        year,
        month,
        targetAmount: found ? found.targetAmount.toString() : "0",
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("매출 목표 조회 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/sales/targets — 목표금액 upsert (year + month)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = salesTargetFormSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || "유효성 검사 실패";
      return NextResponse.json(
        { message: firstError, errors: parsed.error.issues },
        { status: 400 },
      );
    }

    const { year, month, targetAmount } = parsed.data;
    const amount = Number(targetAmount);

    if (isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { message: "유효하지 않은 금액입니다" },
        { status: 400 },
      );
    }

    const target = await prisma.salesTarget.upsert({
      where: { year_month: { year, month } },
      update: { targetAmount: amount },
      create: { year, month, targetAmount: amount },
    });

    return NextResponse.json({
      year: target.year,
      month: target.month,
      targetAmount: target.targetAmount.toString(),
    });
  } catch (error) {
    console.error("매출 목표 저장 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
