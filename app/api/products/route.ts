// src/app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { productFormSchema } from "@/lib/validators/product";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/products — 품목 목록 (검색 + 페이지네이션)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") || "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
    const skip = (page - 1) * pageSize;

    const where = {
      isActive: true,
      ...(search
        ? {
            OR: [
              { productName: { contains: search } },
              { spec: { contains: search } },
            ],
          }
        : {}),
    };

    const [data, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { id: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    // Decimal → string 변환 (JSON 직렬화 문제 방지)
    const serialized = data.map((item) => ({
      ...item,
      unitPrice: item.unitPrice ? item.unitPrice.toString() : null,
    }));

    return NextResponse.json({
      data: serialized,
      totalCount,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("품목 목록 조회 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products — 품목 등록
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = productFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "유효성 검사 실패", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const product = await prisma.product.create({
      data: {
        productName: data.productName,
        spec: data.spec || null,
        printType: data.printType || null,
        material: data.material || null,
        unitPrice: data.unitPrice ? Number(data.unitPrice) : null,
        memo: data.memo || null,
      },
    });

    return NextResponse.json(
      {
        ...product,
        unitPrice: product.unitPrice ? product.unitPrice.toString() : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("품목 등록 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
