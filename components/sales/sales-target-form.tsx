"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAmount, parseAmount } from "@/lib/utils/format";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SalesTargetFormProps {
  year: number;
  month: number;
  currentTarget: string;
  onSaved: () => void;
}

export function SalesTargetForm({
  year,
  month,
  currentTarget,
  onSaved,
}: SalesTargetFormProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentTarget);
  const [loading, setLoading] = useState(false);

  // currentTarget이 외부에서 바뀌면 value 동기화 + 편집모드 해제
  useEffect(() => {
    setValue(currentTarget);
    setEditing(false);
  }, [currentTarget, year, month]);

  const handleStartEdit = () => {
    setValue(currentTarget);
    setEditing(true);
  };

  const handleSave = async () => {
    const amount = parseAmount(value);
    if (amount < 0) {
      toast.error("유효하지 않은 금액입니다");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sales/targets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          month,
          targetAmount: String(amount),
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "저장 실패");
      }

      setEditing(false);
      onSaved();
      toast.success(`${month}월 목표가 저장되었습니다`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "목표 저장에 실패했습니다",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(currentTarget);
    setEditing(false);
  };

  if (!editing) {
    return (
      <Button variant="outline" size="sm" onClick={handleStartEdit}>
        목표 설정: {formatAmount(currentTarget)}원
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={formatAmount(value)}
        onChange={(e) => {
          const raw = e.target.value.replace(/,/g, "");
          if (raw === "" || !isNaN(Number(raw))) {
            setValue(raw);
          }
        }}
        className="w-[180px] text-right"
        placeholder="목표금액"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") handleCancel();
        }}
      />
      <span className="text-sm">원</span>
      <Button size="sm" onClick={handleSave} disabled={loading}>
        <Save className="mr-1 h-4 w-4" />
        {loading ? "저장 중" : "저장"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCancel}
        disabled={loading}
      >
        취소
      </Button>
    </div>
  );
}
