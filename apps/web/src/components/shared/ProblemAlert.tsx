import * as React from "react";
import { AlertCircle } from "lucide-react";

interface ProblemAlertProps {
  error: any;
  title?: string;
}

export function ProblemAlert({ error, title = "An error occurred" }: ProblemAlertProps) {
  if (!error) return null;

  const message = error?.message || error?.detail || error?.toString() || "Unknown error";

  return (
    <div className="relative w-full rounded-lg border border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10 p-4 flex gap-3 items-start">
      <AlertCircle className="h-5 w-5 mt-0.5" />
      <div className="flex flex-col gap-1">
        <h5 className="font-medium leading-none tracking-tight">{title}</h5>
        <div className="text-sm opacity-90">{message}</div>
      </div>
    </div>
  );
}
