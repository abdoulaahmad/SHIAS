"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchToolbarProps {
  placeholder?: string;
  paramName?: string;
}

export function SearchToolbar({ 
  placeholder = "Search...", 
  paramName = "search" 
}: SearchToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams?.get(paramName) ?? "";
  const [value, setValue] = React.useState(initialSearch);
  const debouncedValue = useDebounce(value, 300);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (debouncedValue) {
      params.set(paramName, debouncedValue);
      params.set("page", "1"); // Reset to page 1 on search
    } else {
      params.delete(paramName);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedValue, pathname, router, searchParams, paramName]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9 bg-background"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
