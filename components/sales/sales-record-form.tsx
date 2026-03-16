"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatAmount, parseAmount } from "@/lib/utils/format";
import { salesRecordFormSchema } from "@/lib/validators/sales";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// 매출 인쇄종류
const SALES_PRINT_TYPES = [
  "로터리인쇄",
  "디지털인쇄",
  "평압인쇄",
  "플렉소",
  "외주",
  "Zebra인쇄",
  "리본",
];

// 매입 인쇄종류
const PURCHASE_PRINT_TYPES = ["기타매입", "생산매입", "외주인쇄"];

// 매출 DATA종류
const SALES_DATA_TYPES = ["기존", "수정", "신규"];

// 매입 DATA종류
const PURCHASE_DATA_TYPES = ["정기매입", "수시매입"];

interface ClientOption {
  id: number;
  companyName: string;
}

interface SalesRecordFormProps {
  defaultValues?: {
    id?: number;
    year?: number;
    month?: number;
    transactionType?: string | null;
    dataType?: string | null;
    worker?: string | null;
    deliveryType?: string | null;
    deliveryRegion?: string | null;
    orderReceivedDate?: string | null;
    clientId?: number;
    client?: { id: number; companyName: string };
    printType?: string | null;
    productName?: string | null;
    sheets?: number | null;
    unitPrice?: string | null;
    supplyAmount?: string | null;
    requestedDueDate?: string | null;
    transactionDate?: string | null;
    taxInvoiceDate?: string | null;
    paymentDate?: string | null;
    note?: string | null;
  };
  editId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SalesRecordForm({
  defaultValues,
  editId,
  onSuccess,
  onCancel,
}: SalesRecordFormProps) {
  const isEdit = !!editId;
  const [loading, setLoading] = useState(false);

  // 폼 상태
  const [year, setYear] = useState(
    defaultValues?.year || new Date().getFullYear(),
  );
  const [month, setMonth] = useState(
    defaultValues?.month || new Date().getMonth() + 1,
  );
  const [transactionType, setTransactionType] = useState(
    defaultValues?.transactionType || "매출",
  );
  const [dataType, setDataType] = useState(defaultValues?.dataType || "");
  const [worker, setWorker] = useState(defaultValues?.worker || "");
  const [deliveryType, setDeliveryType] = useState(
    defaultValues?.deliveryType || "",
  );
  const [deliveryRegion, setDeliveryRegion] = useState(
    defaultValues?.deliveryRegion || "",
  );
  const [orderReceivedDate, setOrderReceivedDate] = useState(
    defaultValues?.orderReceivedDate || "",
  );
  const [clientId, setClientId] = useState(defaultValues?.clientId || 0);
  const [printType, setPrintType] = useState(defaultValues?.printType || "");
  const [productName, setProductName] = useState(
    defaultValues?.productName || "",
  );
  const [sheets, setSheets] = useState(
    defaultValues?.sheets !== null && defaultValues?.sheets !== undefined
      ? String(defaultValues.sheets)
      : "",
  );
  const [unitPrice, setUnitPrice] = useState(defaultValues?.unitPrice || "");
  const [supplyAmount, setSupplyAmount] = useState(
    defaultValues?.supplyAmount || "",
  );
  const [requestedDueDate, setRequestedDueDate] = useState(
    defaultValues?.requestedDueDate || "",
  );
  const [transactionDate, setTransactionDate] = useState(
    defaultValues?.transactionDate || "",
  );
  const [taxInvoiceDate, setTaxInvoiceDate] = useState(
    defaultValues?.taxInvoiceDate || "",
  );
  const [paymentDate, setPaymentDate] = useState(
    defaultValues?.paymentDate || "",
  );
  const [note, setNote] = useState(defaultValues?.note || "");

  // 거래처 검색
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientOpen, setClientOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const selectedClient = clients.find((c) => c.id === clientId);

  // 거래처 목록 조회
  const fetchClients = useCallback(async () => {
    try {
      const params = new URLSearchParams({ pageSize: "200" });
      if (clientSearch) params.set("search", clientSearch);
      const res = await fetch(`/api/clients?${params.toString()}`);
      if (!res.ok) return;
      const json = await res.json();
      setClients(
        json.data.map((c: { id: number; companyName: string }) => ({
          id: c.id,
          companyName: c.companyName,
        })),
      );
    } catch {
      /* ignore */
    }
  }, [clientSearch]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // 초기 로드 시 수정모드인 경우 기존 거래처를 clients에 포함
  useEffect(() => {
    if (defaultValues?.client && defaultValues.client.id) {
      setClients((prev) => {
        if (prev.find((c) => c.id === defaultValues.client!.id)) return prev;
        return [
          ...prev,
          {
            id: defaultValues.client!.id,
            companyName: defaultValues.client!.companyName,
          },
        ];
      });
    }
  }, [defaultValues?.client]);

  // 공급가액 자동계산: sheets × unitPrice
  useEffect(() => {
    const s = Number(sheets) || 0;
    const u = parseAmount(unitPrice);
    if (s > 0 && u > 0) {
      setSupplyAmount(String(s * u));
    }
  }, [sheets, unitPrice]);

  // 부가세포함 자동계산
  const taxIncluded = supplyAmount ? Math.round(Number(supplyAmount) * 1.1) : 0;

  // transactionType 변경 시 printType/dataType 초기화
  const handleTransactionTypeChange = (v: string) => {
    setTransactionType(v);
    setPrintType("");
    setDataType("");
  };

  // 드롭다운 옵션 분기
  const printTypeOptions =
    transactionType === "매출" ? SALES_PRINT_TYPES : PURCHASE_PRINT_TYPES;
  const dataTypeOptions =
    transactionType === "매출" ? SALES_DATA_TYPES : PURCHASE_DATA_TYPES;

  // 제출
  const handleSubmit = async () => {
    const formData = {
      year,
      month,
      transactionType,
      dataType,
      worker,
      deliveryType,
      deliveryRegion,
      orderReceivedDate,
      clientId,
      printType,
      productName,
      sheets,
      unitPrice: unitPrice ? String(parseAmount(unitPrice)) : "",
      supplyAmount: supplyAmount ? String(Number(supplyAmount)) : "",
      requestedDueDate,
      transactionDate,
      taxInvoiceDate,
      paymentDate,
      note,
    };

    const parsed = salesRecordFormSchema.safeParse(formData);
    if (!parsed.success) {
      const errors = parsed.error.flatten();
      const firstError =
        Object.values(errors.fieldErrors)[0]?.[0] || "입력값을 확인하세요";
      toast.error(firstError);
      return;
    }

    setLoading(true);
    try {
      const url = isEdit ? `/api/sales/${editId}` : "/api/sales";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "저장 실패");
      }

      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "저장에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1행: 연도/월/거래종류 */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-[0.9rem]">연도</Label>
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2025, 2026, 2027].map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[0.9rem]">매출월</Label>
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {m}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[0.9rem]">거래종류</Label>
          <Select
            value={transactionType}
            onValueChange={handleTransactionTypeChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="매출">매출</SelectItem>
              <SelectItem value="매입">매입</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2행: 발주일/거래처 Combobox */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[0.9rem]">발주일</Label>
          <Input
            type="date"
            value={orderReceivedDate}
            onChange={(e) => setOrderReceivedDate(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-[0.9rem]">거래처명 *</Label>
          <Popover open={clientOpen} onOpenChange={setClientOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={clientOpen}
                className="w-full justify-between font-normal"
              >
                {selectedClient ? selectedClient.companyName : "거래처 선택"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="거래처 검색"
                  value={clientSearch}
                  onValueChange={setClientSearch}
                />
                <CommandList>
                  <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
                  {clients.map((c) => (
                    <CommandItem
                      key={c.id}
                      value={c.companyName}
                      onSelect={() => {
                        setClientId(c.id);
                        setClientOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          clientId === c.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {c.companyName}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 3행: 인쇄종류/DATA종류 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[0.9rem]">인쇄종류</Label>
          <Select value={printType} onValueChange={setPrintType}>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {printTypeOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[0.9rem]">DATA종류</Label>
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {dataTypeOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4행: 품목 */}
      <div>
        <Label className="text-[0.9rem]">품목</Label>
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="품목명 입력"
        />
      </div>

      {/* 5행: 수량/단가/공급가액/부가세포함 */}
      <div className="grid grid-cols-4 gap-3">
        <div>
          <Label className="text-[0.9rem]">발주수량</Label>
          <Input
            type="number"
            value={sheets}
            onChange={(e) => setSheets(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <Label className="text-[0.9rem]">단가</Label>
          <Input
            value={unitPrice ? formatAmount(unitPrice) : ""}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              setUnitPrice(raw);
            }}
            placeholder="0"
            className="text-right"
          />
        </div>
        <div>
          <Label className="text-[0.9rem]">공급가액</Label>
          <Input
            value={supplyAmount ? formatAmount(supplyAmount) : ""}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              setSupplyAmount(raw);
            }}
            placeholder="자동계산"
            className="text-right"
          />
        </div>
        <div>
          <Label className="text-[0.9rem]">부가세포함</Label>
          <Input
            value={taxIncluded ? formatAmount(taxIncluded) : ""}
            readOnly
            className="bg-muted text-right"
            placeholder="자동계산"
          />
        </div>
      </div>

      {/* 6행: 날짜들 */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-[0.9rem]">납기요청일</Label>
          <Input
            type="date"
            value={requestedDueDate}
            onChange={(e) => setRequestedDueDate(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-[0.9rem]">거래명세표발급일</Label>
          <Input
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-[0.9rem]">세금계산서발급일</Label>
          <Input
            type="date"
            value={taxInvoiceDate}
            onChange={(e) => setTaxInvoiceDate(e.target.value)}
          />
        </div>
      </div>

      {/* 7행: 대금지급일/작업자 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[0.9rem]">대금지급일</Label>
          <Input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-[0.9rem]">작업자</Label>
          <Input
            value={worker}
            onChange={(e) => setWorker(e.target.value)}
            placeholder="작업자 입력"
          />
        </div>
      </div>

      {/* 8행: 배송종류/배송지역 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[0.9rem]">배송종류</Label>
          <Input
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
            placeholder="배송종류 입력"
          />
        </div>
        <div>
          <Label className="text-[0.9rem]">배송지역</Label>
          <Input
            value={deliveryRegion}
            onChange={(e) => setDeliveryRegion(e.target.value)}
            placeholder="배송지역 입력"
          />
        </div>
      </div>

      {/* 9행: 비고 */}
      <div>
        <Label className="text-[0.9rem]">비고</Label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="비고 (대금지급일 텍스트 등)"
          rows={2}
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="text-[0.95rem]"
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="text-[0.95rem]"
        >
          {loading ? "저장 중..." : isEdit ? "수정" : "등록"}
        </Button>
      </div>
    </div>
  );
}
