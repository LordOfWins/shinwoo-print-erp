// src/app/(authenticated)/products/[id]/page.tsx
"use client";

import { ProductForm } from "@/components/products/product-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import type { ProductFormValues } from "@/lib/validators/product";
import { Loader2, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ProductData {
  id: number;
  productName: string;
  spec: string | null;
  printType: string | null;
  material: string | null;
  unitPrice: string | null;
  memo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        alert("품목을 찾을 수 없습니다.");
        router.push("/products");
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
      router.push("/products");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleSubmit = async (data: ProductFormValues) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("수정되었습니다.");
        await fetchProduct();
      } else {
        const error = await res.json();
        alert(error.message || "수정에 실패했습니다.");
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/products");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const defaultValues: ProductFormValues = {
    productName: product.productName,
    spec: product.spec || "",
    printType: product.printType || "",
    material: product.material || "",
    unitPrice: product.unitPrice || "",
    memo: product.memo || "",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.productName}
        description="품목 상세 정보를 확인하고 수정합니다."
        backHref="/products"
        actions={
          <Button
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
            className="text-[0.95rem]"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        }
      />

      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="수정"
        loading={saving}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="품목 삭제"
        description={`"${product.productName}" 품목을 삭제하시겠습니까? 삭제된 품목은 목록에서 표시되지 않습니다.`}
        confirmText="삭제"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
