// lib/utils/format.ts

/**
 * 숫자를 천단위 콤마 문자열로 변환
 * formatAmount(1000) -> "1,000"
 * formatAmount(null) -> ""
 */
export function formatAmount(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "";
  return num.toLocaleString("ko-KR");
}

/**
 * 콤마 문자열을 숫자로 변환
 * parseAmount("1,000") -> 1000
 */
export function parseAmount(value: string): number {
  return Number(value.replace(/,/g, "")) || 0;
}

/**
 * 날짜를 YYYY-MM-DD 포맷으로 변환
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}
