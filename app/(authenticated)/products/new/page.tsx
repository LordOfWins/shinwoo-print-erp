// src/app/(authenticated)/products/new/page.tsx
"use client";

import { ProductForm } from "@/components/products/product-form";
import { PageHeader } from "@/components/shared/page-header";
import type { ProductFormValues } from "@/lib/validators/product";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/products");
      } else {
        const error = await res.json();
        alert(error.message || "등록에 실패했습니다.");
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="품목 등록"
        description="새 품목 정보를 입력합니다."
        backHref="/products"
      />
      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="등록"
        loading={loading}
      />
    </div>
  );
}
