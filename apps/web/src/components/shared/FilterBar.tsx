"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDefinition {
  paramName: string;
  placeholder: string;
  options: FilterOption[];
}

interface FilterBarProps {
  filters: FilterDefinition[];
}

export function FilterBar({ filters }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleValueChange = (paramName: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (value && value !== "all") {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    params.set("page", "1"); // Reset pagination
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const currentValue = searchParams?.get(filter.paramName) ?? "all";
        
        return (
          <div key={filter.paramName} className="w-[180px]">
            <Select 
              value={currentValue} 
              onValueChange={(value) => handleValueChange(filter.paramName, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.placeholder}</SelectItem>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
}
