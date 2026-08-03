"use client";

import { useState } from "react";
import { Consent } from "../../types";
import { useApproveConsent, useRejectConsent, useRevokeConsent } from "../hooks";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Check, X, ShieldAlert } from "lucide-react";

export function ConsentActions({ consent }: { consent: Consent }) {
  const approveMutation = useApproveConsent();
  const rejectMutation = useRejectConsent();
  const revokeMutation = useRevokeConsent();

  const [dialogConfig, setDialogConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
    isDestructive?: boolean;
    confirmText?: string;
  }>({
    open: false,
    title: "",
    description: "",
    action: () => {},
  });

  const handleApprove = () => setDialogConfig({
    open: true,
    title: "Approve Consent Request",
    description: "Are you sure you want to approve this request? The provider will gain access to the specified medical records.",
    confirmText: "Approve Access",
    action: () => approveMutation.mutate(consent.id),
  });

  const handleReject = () => setDialogConfig({
    open: true,
    title: "Reject Consent Request",
    description: "Are you sure you want to reject this request? The provider will not be granted access.",
    confirmText: "Reject Request",
    isDestructive: true,
    action: () => rejectMutation.mutate(consent.id),
  });

  const handleRevoke = () => setDialogConfig({
    open: true,
    title: "Revoke Active Consent",
    description: "Are you sure you want to revoke this consent? The provider will immediately lose access to the specified medical records.",
    confirmText: "Revoke Consent",
    isDestructive: true,
    action: () => revokeMutation.mutate(consent.id),
  });

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {consent.status === 'PENDING' && (
        <>
          <Button onClick={handleApprove} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" disabled={approveMutation.isPending || rejectMutation.isPending}>
            <Check className="h-4 w-4" />
            {approveMutation.isPending ? "Approving..." : "Approve"}
          </Button>
          <Button onClick={handleReject} className="gap-2 bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" disabled={approveMutation.isPending || rejectMutation.isPending}>
            <X className="h-4 w-4" />
            {rejectMutation.isPending ? "Rejecting..." : "Reject"}
          </Button>
        </>
      )}
      
      {consent.status === 'ACTIVE' && (
        <Button onClick={handleRevoke} className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={revokeMutation.isPending}>
          <ShieldAlert className="h-4 w-4" />
          {revokeMutation.isPending ? "Revoking..." : "Revoke Access"}
        </Button>
      )}

      <AlertDialog 
        open={dialogConfig.open} 
        onOpenChange={(open) => setDialogConfig(prev => ({ ...prev, open }))}
        title={dialogConfig.title}
        description={dialogConfig.description}
        confirmText={dialogConfig.confirmText}
        isDestructive={dialogConfig.isDestructive}
        onConfirm={dialogConfig.action}
      />
    </div>
  );
}
