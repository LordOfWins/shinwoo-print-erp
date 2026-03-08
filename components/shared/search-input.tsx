// src/components/shared/search-input.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  defaultValue?: string;
  debounceMs?: number;
}

export function SearchInput({
  placeholder = "검색어를 입력하세요",
  onSearch,
  defaultValue = "",
  debounceMs = 300,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  const debouncedSearch = useCallback(
    (searchValue: string) => {
      const timer = setTimeout(() => {
        onSearch(searchValue);
      }, debounceMs);
      return () => clearTimeout(timer);
    },
    [onSearch, debounceMs],
  );

  useEffect(() => {
    const cleanup = debouncedSearch(value);
    return cleanup;
  }, [value, debouncedSearch]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 pr-9 text-[0.95rem]"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
