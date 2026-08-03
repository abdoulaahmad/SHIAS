import * as React from "react";
import { cn } from "@/lib/utils";

interface MetricsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MetricsGrid({ children, className, ...props }: MetricsGridProps) {
  return (
    <div 
      className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
