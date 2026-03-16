import { prisma } from "@/lib/prisma";
import { salesRecordFormSchema } from "@/lib/validators/sales";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

function serializeRecord(record: {
  id: number;
  year: number;
  month: number;
  transactionType: string | null;
  dataType: string | null;
  worker: string | null;
  deliveryType: string | null;
  deliveryRegion: string | null;
  orderReceivedDate: Date | null;
  clientId: number;
  client: { id: number; companyName: string };
  printType: string | null;
  productName: string | null;
  sheets: number | null;
  unitPrice: unknown;
  supplyAmount: unknown;
  taxIncludedAmount: unknown;
  requestedDueDate: Date | null;
  transactionDate: Date | null;
  taxInvoiceDate: Date | null;
  paymentDate: Date | null;
  note: string | null;
}) {
  return {
    id: record.id,
    year: record.year,
    month: record.month,
    transactionType: record.transactionType,
    dataType: record.dataType,
    worker: record.worker,
    deliveryType: record.deliveryType,
    deliveryRegion: record.deliveryRegion,
    orderReceivedDate: record.orderReceivedDate
      ? record.orderReceivedDate.toISOString().split("T")[0]
      : "",
    clientId: record.clientId,
    client: record.client,
    printType: record.printType,
    productName: record.productName,
    sheets: record.sheets,
    unitPrice: record.unitPrice ? String(record.unitPrice) : "",
    supplyAmount: record.supplyAmount ? String(record.supplyAmount) : "",
    taxIncludedAmount: record.taxIncludedAmount
      ? String(record.taxIncludedAmount)
      : "",
    requestedDueDate: record.requestedDueDate
      ? record.requestedDueDate.toISOString().split("T")[0]
      : "",
    transactionDate: record.transactionDate
      ? record.transactionDate.toISOString().split("T")[0]
      : "",
    taxInvoiceDate: record.taxInvoiceDate
      ? record.taxInvoiceDate.toISOString().split("T")[0]
      : "",
    paymentDate: record.paymentDate
      ? record.paymentDate.toISOString().split("T")[0]
      : "",
    note: record.note,
  };
}

/**
 * GET /api/sales/[id] — 매출/매입 상세
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const recordId = Number(id);

    if (isNaN(recordId)) {
      return NextResponse.json(
        { message: "유효하지 않은 ID입니다" },
        { status: 400 },
      );
    }

    const record = await prisma.salesRecord.findUnique({
      where: { id: recordId },
      include: {
        client: {
          select: { id: true, companyName: true },
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { message: "매출/매입 데이터를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(serializeRecord(record));
  } catch (error) {
    console.error("매출/매입 상세 조회 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/sales/[id] — 매출/매입 수정
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const recordId = Number(id);

    if (isNaN(recordId)) {
      return NextResponse.json(
        { message: "유효하지 않은 ID입니다" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = salesRecordFormSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || "유효성 검사 실패";
      return NextResponse.json(
        { message: firstError, errors: parsed.error.issues },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const existing = await prisma.salesRecord.findUnique({
      where: { id: recordId },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "매출/매입 데이터를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    const supplyAmount = data.supplyAmount ? Number(data.supplyAmount) : null;
    const taxIncludedAmount =
      supplyAmount !== null ? Math.round(supplyAmount * 1.1) : null;

    const record = await prisma.salesRecord.update({
      where: { id: recordId },
      data: {
        year: data.year,
        month: data.month,
        transactionType: data.transactionType,
        dataType: data.dataType || null,
        worker: data.worker || null,
        deliveryType: data.deliveryType || null,
        deliveryRegion: data.deliveryRegion || null,
        orderReceivedDate: data.orderReceivedDate
          ? new Date(data.orderReceivedDate)
          : null,
        clientId: data.clientId,
        printType: data.printType || null,
        productName: data.productName || null,
        sheets: data.sheets ?? null,
        unitPrice: data.unitPrice ? Number(data.unitPrice) : null,
        supplyAmount,
        taxIncludedAmount,
        requestedDueDate: data.requestedDueDate
          ? new Date(data.requestedDueDate)
          : null,
        transactionDate: data.transactionDate
          ? new Date(data.transactionDate)
          : null,
        taxInvoiceDate: data.taxInvoiceDate
          ? new Date(data.taxInvoiceDate)
          : null,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
        note: data.note || null,
      },
      include: {
        client: { select: { id: true, companyName: true } },
      },
    });

    return NextResponse.json(serializeRecord(record));
  } catch (error) {
    console.error("매출/매입 수정 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/sales/[id] — 매출/매입 삭제
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const recordId = Number(id);

    if (isNaN(recordId)) {
      return NextResponse.json(
        { message: "유효하지 않은 ID입니다" },
        { status: 400 },
      );
    }

    const existing = await prisma.salesRecord.findUnique({
      where: { id: recordId },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "매출/매입 데이터를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    await prisma.salesRecord.delete({ where: { id: recordId } });

    return NextResponse.json({ message: "매출/매입 데이터가 삭제되었습니다" });
  } catch (error) {
    console.error("매출/매입 삭제 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
