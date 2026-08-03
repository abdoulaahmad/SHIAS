"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

const variantStyles: Record<ToastVariant, string> = {
  default: "border bg-background text-foreground",
  destructive: "border-destructive bg-destructive text-destructive-foreground",
  success: "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400",
  warning: "border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400",
  info: "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400",
};

const iconColorStyles: Record<ToastVariant, string> = {
  default: "text-blue-500",
  destructive: "text-red-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};

const variantIcons: Record<ToastVariant, React.ElementType> = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title?: string;
  description?: string;
  onClose?: () => void;
}

export function Toast({ className, variant = "default", title, description, onClose, ...props }: ToastProps) {
  const Icon = variantIcons[variant];

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variantStyles[variant],
        className
      )}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <div className="flex items-start gap-4">
        <Icon className={cn("mt-0.5 h-5 w-5", iconColorStyles[variant])} />
        <div className="flex flex-col gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
