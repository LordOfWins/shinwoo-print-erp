"use client";

import { BankAccountList } from "@/components/settings/bank-account-list";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { CompanyInfoForm } from "@/components/settings/company-info-form";
import { EstimateManagerList } from "@/components/settings/estimate-manager-list";
import { StageOptionsList } from "@/components/settings/stage-options-list";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="시스템 설정"
        description="회사 정보, 계좌, 견적 진행단계, 견적 담당자, 비밀번호를 관리합니다."
      />
      <Tabs defaultValue="company" className="!flex !flex-col ">
        <TabsList className="inline-flex h-10 items-center justify-start gap-1 border-b bg-transparent p-0 rounded-none shrink-0">
          <TabsTrigger
            value="company"
            className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            회사 정보
          </TabsTrigger>
          <TabsTrigger
            value="accounts"
            className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            계좌 관리
          </TabsTrigger>
          <TabsTrigger
            value="stages"
            className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            견적 진행단계
          </TabsTrigger>
          <TabsTrigger
            value="managers"
            className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            견적 담당자
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            비밀번호
          </TabsTrigger>
        </TabsList>
        <TabsContent value="company" className="mt-6 ">
          <CompanyInfoForm />
        </TabsContent>
        <TabsContent value="accounts" className="mt-6 ">
          <BankAccountList />
        </TabsContent>
        <TabsContent value="stages" className="mt-6 ">
          <StageOptionsList />
        </TabsContent>
        <TabsContent value="managers" className="mt-6 ">
          <EstimateManagerList />
        </TabsContent>
        <TabsContent value="password" className="mt-6 ">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
