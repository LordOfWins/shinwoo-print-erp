"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "모든 항목을 입력해주세요" });
      return;
    }

    if (newPassword.length < 4) {
      setMessage({
        type: "error",
        text: "새 비밀번호는 최소 4자 이상이어야 합니다",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "새 비밀번호와 확인이 일치하지 않습니다",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "비밀번호가 변경되었습니다" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.message || "변경에 실패했습니다" });
      }
    } catch {
      setMessage({ type: "error", text: "서버 오류가 발생했습니다" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          비밀번호 변경
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-[0.95rem]">
              현재 비밀번호 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="currentPassword"
              type="password"
              className="text-[0.95rem]"
              placeholder="현재 비밀번호를 입력하세요"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-[0.95rem]">
              새 비밀번호 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="newPassword"
              type="password"
              className="text-[0.95rem]"
              placeholder="새 비밀번호 (최소 4자)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[0.95rem]">
              새 비밀번호 확인 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="text-[0.95rem]"
              placeholder="새 비밀번호를 다시 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {message && (
            <div
              className={`rounded-md p-3 text-[0.9rem] ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[140px] text-[0.95rem]"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              비밀번호 변경
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
