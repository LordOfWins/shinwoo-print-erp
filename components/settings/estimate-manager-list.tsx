"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Manager {
  id: number;
  name: string;
  title: string | null;
  phone: string | null;
  email: string | null;
  isDefault: boolean;
}

interface FormData {
  name: string;
  title: string;
  phone: string;
  email: string;
  isDefault: boolean;
}

const emptyForm: FormData = {
  name: "",
  title: "",
  phone: "",
  email: "",
  isDefault: false,
};

export function EstimateManagerList() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Manager | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchManagers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/estimate-managers");
      if (res.ok) {
        const data = await res.json();
        setManagers(data);
      }
    } catch (error) {
      console.error("담당자 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("이름은 필수입니다");
      return;
    }
    setSaving(true);
    try {
      const url = editId
        ? `/api/estimate-managers/${editId}`
        : "/api/estimate-managers";
      const method = editId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowForm(false);
        setEditId(null);
        setForm(emptyForm);
        await fetchManagers();
      } else {
        const error = await res.json();
        alert(error.message || "저장에 실패했습니다");
      }
    } catch {
      alert("서버 오류가 발생했습니다");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (manager: Manager) => {
    setEditId(manager.id);
    setForm({
      name: manager.name,
      title: manager.title || "",
      phone: manager.phone || "",
      email: manager.email || "",
      isDefault: manager.isDefault,
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/estimate-managers/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchManagers();
      }
    } catch {
      alert("삭제에 실패했습니다");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">견적 담당자 관리</CardTitle>
        {!showForm && (
          <Button
            size="sm"
            onClick={() => {
              setEditId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
            className="text-[0.85rem]"
          >
            <Plus className="mr-1 h-3 w-3" />
            담당자 추가
          </Button>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="pt-6 space-y-4">
        {showForm && (
          <div className="rounded-lg border p-4 space-y-4 bg-muted/30">
            <h4 className="font-semibold text-[0.95rem]">
              {editId ? "담당자 수정" : "새 담당자 등록"}
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[0.85rem]">
                  이름 <span className="text-destructive">*</span>
                </Label>
                <Input
                  className="text-[0.9rem]"
                  placeholder="홍길동"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[0.85rem]">직함</Label>
                <Input
                  className="text-[0.9rem]"
                  placeholder="실장 / 대리 등"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[0.85rem]">연락처</Label>
                <Input
                  className="text-[0.9rem]"
                  placeholder="010-0000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[0.85rem]">이메일</Label>
                <Input
                  className="text-[0.9rem]"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                className="h-4 w-4 rounded border-gray-300"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({ ...form, isDefault: e.target.checked })
                }
              />
              <Label htmlFor="isDefault" className="text-[0.85rem]">
                기본 담당자로 설정
              </Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="text-[0.85rem]"
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="text-[0.85rem]"
              >
                {saving && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                {editId ? "수정" : "등록"}
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex h-24 items-center justify-center text-muted-foreground">
            불러오는 중...
          </div>
        ) : managers.length === 0 ? (
          <p className="text-muted-foreground text-[0.95rem]">
            등록된 담당자가 없습니다
          </p>
        ) : (
          <div className="space-y-2">
            {managers.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  {m.isDefault && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[0.95rem]">
                        {m.name}
                      </span>
                      {m.title && (
                        <Badge variant="outline" className="text-xs">
                          {m.title}
                        </Badge>
                      )}
                      {m.isDefault && (
                        <Badge className="text-xs bg-yellow-100 text-yellow-800" variant="outline">
                          기본
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground text-xs mt-0.5">
                      {[m.phone, m.email].filter(Boolean).join(" · ") || "-"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(m)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteTarget(m)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="담당자 삭제"
        description={`"${deleteTarget?.name}" 담당자를 삭제하시겠습니까?`}
        confirmText="삭제"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </Card>
  );
}
