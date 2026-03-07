// src/app/(authenticated)/layout.tsx
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 왼쪽 사이드바 (고정 240px) */}
      <Sidebar />

      {/* 오른쪽: 헤더 + 메인 콘텐츠 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
