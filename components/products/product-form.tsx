// src/components/products/product-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validators/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface ProductFormProps {
  defaultValues?: ProductFormValues;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  submitLabel = "저장",
  loading = false,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues || {
      productName: "",
      spec: "",
      printType: "",
      material: "",
      unitPrice: "",
      memo: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* 품목명 (필수) */}
          <div className="space-y-2">
            <Label
              htmlFor="productName"
              className="text-[0.95rem] font-semibold"
            >
              품목명 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="productName"
              placeholder="품목명을 입력하세요"
              className="text-[0.95rem]"
              {...register("productName")}
            />
            {errors.productName && (
              <p className="text-destructive text-sm">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* 2열 레이아웃 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 규격 */}
            <div className="space-y-2">
              <Label htmlFor="spec" className="text-[0.95rem]">
                규격(mm)
              </Label>
              <Input
                id="spec"
                placeholder="예: 50×30"
                className="text-[0.95rem]"
                {...register("spec")}
              />
              {errors.spec && (
                <p className="text-destructive text-sm">
                  {errors.spec.message}
                </p>
              )}
            </div>

            {/* 인쇄종류 (텍스트 입력 — 추후 드롭다운 전환) */}
            <div className="space-y-2">
              <Label htmlFor="printType" className="text-[0.95rem]">
                인쇄종류
              </Label>
              <Input
                id="printType"
                placeholder="예: 디지털, 옵셋, 실크"
                className="text-[0.95rem]"
                {...register("printType")}
              />
              {errors.printType && (
                <p className="text-destructive text-sm">
                  {errors.printType.message}
                </p>
              )}
            </div>

            {/* 원단 (텍스트 입력 — 추후 드롭다운 전환) */}
            <div className="space-y-2">
              <Label htmlFor="material" className="text-[0.95rem]">
                원단
              </Label>
              <Input
                id="material"
                placeholder="예: 아트지, 모조지"
                className="text-[0.95rem]"
                {...register("material")}
              />
              {errors.material && (
                <p className="text-destructive text-sm">
                  {errors.material.message}
                </p>
              )}
            </div>

            {/* 기본단가 (숫자만) */}
            <div className="space-y-2">
              <Label htmlFor="unitPrice" className="text-[0.95rem]">
                기본단가 (원)
              </Label>
              <Input
                id="unitPrice"
                placeholder="0"
                className="text-[0.95rem]"
                inputMode="numeric"
                {...register("unitPrice")}
                onKeyDown={(e) => {
                  // 숫자, 백스페이스, 탭, 화살표, Delete만 허용
                  if (
                    !/[0-9]/.test(e.key) &&
                    ![
                      "Backspace",
                      "Tab",
                      "ArrowLeft",
                      "ArrowRight",
                      "Delete",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.unitPrice && (
                <p className="text-destructive text-sm">
                  {errors.unitPrice.message}
                </p>
              )}
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <Label htmlFor="memo" className="text-[0.95rem]">
              메모
            </Label>
            <Textarea
              id="memo"
              placeholder="메모를 입력하세요"
              rows={3}
              className="text-[0.95rem]"
              {...register("memo")}
            />
            {errors.memo && (
              <p className="text-destructive text-sm">{errors.memo.message}</p>
            )}
          </div>

          {/* 제출 */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px] text-[0.95rem]"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
