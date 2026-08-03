"use client";

import { useState } from "react";
import { Pointer } from "../../types";
import { PointerStatusBadge } from "./PointerStatusBadge";
import { format } from "@/lib/date-fns";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useUpdatePointerMutation, useArchivePointerMutation } from "../hooks";
import { Archive, ShieldOff } from "lucide-react";

export function PointerTable({ pointers, providerId }: { pointers: Pointer[], providerId: string }) {
  const updateMutation = useUpdatePointerMutation(providerId);
  const archiveMutation = useArchivePointerMutation(providerId);

  const [dialogConfig, setDialogConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    action: () => {},
  });

  const handleRevoke = (id: string) => setDialogConfig({
    open: true,
    title: "Revoke Pointer",
    description: "Are you sure you want to revoke this pointer? It will no longer be active.",
    action: () => updateMutation.mutate({ pointerId: id, data: { status: "REVOKED" } }),
  });

  const handleArchive = (id: string) => setDialogConfig({
    open: true,
    title: "Archive Pointer",
    description: "Are you sure you want to archive this pointer? This action cannot be undone easily.",
    action: () => archiveMutation.mutate(id),
  });

  if (pointers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-xl border-dashed bg-muted/20">
        <div className="text-muted-foreground text-center">
          <p className="font-medium">No pointers found</p>
          <p className="text-sm">Register a new pointer to make records available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 border-b">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Patient</th>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Record Type</th>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">System ID</th>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Created</th>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pointers.map((pointer) => (
              <tr key={pointer.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium whitespace-nowrap">{pointer.patientId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pointer.metadata.recordType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pointer.metadata.externalSystemId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(pointer.createdAt), "MMM d, yyyy")}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PointerStatusBadge status={pointer.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {pointer.status === "ACTIVE" && (
                      <Button 
                        className="h-8 gap-1 bg-transparent border border-yellow-200 text-yellow-700 hover:bg-yellow-100 px-2" 
                        onClick={() => handleRevoke(pointer.id)}
                        disabled={updateMutation.isPending}
                      >
                        <ShieldOff className="h-3 w-3" />
                        Revoke
                      </Button>
                    )}
                    {pointer.status !== "ARCHIVED" && (
                      <Button 
                        className="h-8 gap-1 bg-transparent border border-destructive/50 text-destructive hover:bg-destructive/10 px-2" 
                        onClick={() => handleArchive(pointer.id)}
                        disabled={archiveMutation.isPending}
                      >
                        <Archive className="h-3 w-3" />
                        Archive
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <AlertDialog 
        open={dialogConfig.open} 
        onOpenChange={(open) => setDialogConfig(prev => ({ ...prev, open }))}
        title={dialogConfig.title}
        description={dialogConfig.description}
        isDestructive={true}
        onConfirm={dialogConfig.action}
      />
    </div>
  );
}
