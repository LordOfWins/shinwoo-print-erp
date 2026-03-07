// src/components/header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.push("/login");
      router.refresh();
    } catch {
      // 실패해도 로그인 페이지로 이동
      router.push("/login");
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <h1 className="text-lg font-semibold">신우씨링 영업관리</h1>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        로그아웃
      </Button>
    </header>
  );
}
