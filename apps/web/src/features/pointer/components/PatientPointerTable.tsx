"use client";

import { Pointer } from "../../types";
import { PointerStatusBadge } from "./PointerStatusBadge";
import { format } from "@/lib/date-fns";
import { FileText } from "lucide-react";

export function PatientPointerTable({ pointers }: { pointers: Pointer[] }) {
  if (!pointers.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card text-muted-foreground">
        <FileText className="h-8 w-8 mb-4 text-muted-foreground/50" />
        <p>No medical records found.</p>
        <p className="text-sm mt-1">Providers you visit will register your records here.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Record Type</th>
              <th className="px-4 py-3 font-medium">Provider ID</th>
              <th className="px-4 py-3 font-medium">Date of Record</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pointers.map((pointer) => (
              <tr key={pointer.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">
                  {pointer.metadata.recordType.replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{pointer.providerId.split('-')[0]}...</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {format(new Date(pointer.metadata.recordCreatedAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <PointerStatusBadge status={pointer.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
