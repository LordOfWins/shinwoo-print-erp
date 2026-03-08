// src/lib/validators/product.ts
import { z } from "zod";

export const productFormSchema = z.object({
  productName: z
    .string()
    .min(1, "품목명은 필수입니다.")
    .max(200, "품목명은 200자 이내로 입력하세요."),
  spec: z
    .string()
    .max(100, "규격은 100자 이내로 입력하세요.")
    .optional()
    .or(z.literal("")),
  printType: z
    .string()
    .max(50, "인쇄종류는 50자 이내로 입력하세요.")
    .optional()
    .or(z.literal("")),
  material: z
    .string()
    .max(50, "원단은 50자 이내로 입력하세요.")
    .optional()
    .or(z.literal("")),
  unitPrice: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^\d+$/.test(val),
      "단가는 숫자만 입력 가능합니다."
    ),
  memo: z.string().optional().or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
