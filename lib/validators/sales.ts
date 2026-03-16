import { z } from "zod";

export const salesRecordFormSchema = z.object({
  year: z.number({ error: "연도는 필수입니다" }).min(2020).max(2099),
  month: z.number({ error: "월은 필수입니다" }).min(1).max(12),
  transactionType: z.enum(["매출", "매입"], {
    error: "거래종류를 선택하세요",
  }),
  dataType: z.string().max(20).optional().or(z.literal("")),
  worker: z.string().max(50).optional().or(z.literal("")),
  deliveryType: z.string().max(20).optional().or(z.literal("")),
  deliveryRegion: z.string().max(50).optional().or(z.literal("")),
  orderReceivedDate: z.string().optional().or(z.literal("")),
  clientId: z
    .number({ error: "거래처는 필수입니다" })
    .min(1, "거래처를 선택하세요"),
  printType: z.string().max(50).optional().or(z.literal("")),
  productName: z.string().max(200).optional().or(z.literal("")),
  sheets: z
    .union([z.number(), z.null(), z.string()])
    .optional()
    .transform((val) => {
      if (val === null || val === undefined || val === "") return null;
      const n = Number(val);
      if (isNaN(n)) return null;
      return n < 0 ? 0 : n;
    }),
  unitPrice: z.string().optional().or(z.literal("")),
  supplyAmount: z.string().optional().or(z.literal("")),
  requestedDueDate: z.string().optional().or(z.literal("")),
  transactionDate: z.string().optional().or(z.literal("")),
  taxInvoiceDate: z.string().optional().or(z.literal("")),
  paymentDate: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
});

export const salesTargetFormSchema = z.object({
  year: z.number({ error: "연도는 필수입니다" }).min(2020).max(2099),
  month: z.number({ error: "월은 필수입니다" }).min(1).max(12),
  targetAmount: z.string().min(1, "목표금액을 입력하세요"),
});

export type SalesRecordFormValues = z.infer<typeof salesRecordFormSchema>;
export type SalesTargetFormValues = z.infer<typeof salesTargetFormSchema>;
