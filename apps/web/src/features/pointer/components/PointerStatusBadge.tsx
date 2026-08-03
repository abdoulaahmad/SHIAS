import { PointerStatus } from "../../types";
import { cn } from "@/lib/utils";

export function PointerStatusBadge({ status }: { status: PointerStatus }) {
  const styles: Record<PointerStatus, string> = {
    ACTIVE: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    REVOKED: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    ARCHIVED: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", styles[status])}>
      {status}
    </span>
  );
}
