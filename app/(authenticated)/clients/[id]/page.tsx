// src/app/(authenticated)/clients/[id]/page.tsx
"use client";

import { ClientForm } from "@/components/clients/client-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ClientFormValues } from "@/lib/validators/client";
import { Loader2, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type TabValue = "info" | "orders" | "estimates" | "transactions";

const tabs: { value: TabValue; label: string }[] = [
  { value: "info", label: "기본 정보" },
  { value: "orders", label: "발주 이력" },
  { value: "estimates", label: "견적 이력" },
  { value: "transactions", label: "거래명세서 이력" },
];

interface ClientData {
  id: number;
  companyName: string;
  contactName: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  address: string | null;
  businessNumber: string | null;
  businessType: string | null;
  businessItem: string | null;
  memo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("info");

  const fetchClient = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data);
      } else {
        alert("거래처를 찾을 수 없습니다.");
        router.push("/clients");
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
      router.push("/clients");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const handleSubmit = async (data: ClientFormValues) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("수정되었습니다.");
        await fetchClient();
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
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/clients");
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

  if (!client) return null;

  const defaultValues: ClientFormValues = {
    companyName: client.companyName,
    contactName: client.contactName || "",
    phone: client.phone || "",
    fax: client.fax || "",
    email: client.email || "",
    address: client.address || "",
    businessNumber: client.businessNumber || "",
    businessType: client.businessType || "",
    businessItem: client.businessItem || "",
    memo: client.memo || "",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.companyName}
        description="거래처 상세 정보를 확인하고 수정합니다."
        backHref="/clients"
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

      {/* 탭 버튼 영역 */}
      <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-md px-4 py-2.5 text-[0.95rem] font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 영역 */}
      {activeTab === "info" && (
        <ClientForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitLabel="수정"
          loading={saving}
        />
      )}

      {activeTab === "orders" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">발주 이력</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-[0.95rem]">
              발주 데이터가 없습니다 (발주 모듈 구현 후 연동됩니다)
            </p>
          </CardContent>
        </Card>
      )}

      {activeTab === "estimates" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">견적 이력</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-[0.95rem]">
              견적 데이터가 없습니다 (견적 모듈 구현 후 연동됩니다)
            </p>
          </CardContent>
        </Card>
      )}

      {activeTab === "transactions" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">거래명세서 이력</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-[0.95rem]">
              거래명세서 데이터가 없습니다 (거래명세서 모듈 구현 후 연동됩니다)
            </p>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="거래처 삭제"
        description={`"${client.companyName}" 거래처를 삭제하시겠습니까? 삭제된 거래처는 목록에서 표시되지 않습니다.`}
        confirmText="삭제"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
