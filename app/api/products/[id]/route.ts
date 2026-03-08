// src/app/api/products/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { productFormSchema } from "@/lib/validators/product";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/products/[id] — 품목 상세
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "유효하지 않은 ID입니다." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: "품목을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...product,
      unitPrice: product.unitPrice ? product.unitPrice.toString() : null,
    });
  } catch (error) {
    console.error("품목 상세 조회 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/products/[id] — 품목 수정
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "유효하지 않은 ID입니다." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = productFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "유효성 검사 실패", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        productName: data.productName,
        spec: data.spec || null,
        printType: data.printType || null,
        material: data.material || null,
        unitPrice: data.unitPrice ? Number(data.unitPrice) : null,
        memo: data.memo || null,
      },
    });

    return NextResponse.json({
      ...product,
      unitPrice: product.unitPrice ? product.unitPrice.toString() : null,
    });
  } catch (error) {
    console.error("품목 수정 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id] — 품목 삭제 (소프트 삭제)
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "유효하지 않은 ID입니다." },
        { status: 400 }
      );
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "품목이 삭제되었습니다." });
  } catch (error) {
    console.error("품목 삭제 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
