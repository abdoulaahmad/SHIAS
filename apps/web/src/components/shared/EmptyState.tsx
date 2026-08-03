import * as React from "react";
import { cn } from "@/lib/utils";
import { SearchX } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title = "No results found", 
  description = "Adjust your search or filters to find what you're looking for.", 
  icon = <SearchX className="h-10 w-10 text-muted-foreground" />,
  className, 
  ...props 
}: EmptyStateProps) {
  return (
    <div 
      className={cn("flex flex-col items-center justify-center p-8 text-center min-h-[300px] border rounded-lg border-dashed bg-muted/20", className)} 
      {...props}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
    </div>
  );
}
