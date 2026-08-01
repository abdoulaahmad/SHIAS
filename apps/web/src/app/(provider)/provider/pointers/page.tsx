"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProblemAlert } from "@/components/shared/ProblemAlert";
import { useAuthStore } from "@/features/auth/store";
import { useProviderPointers } from "@/features/pointer/hooks";
import { PointerTable } from "@/features/pointer/components/PointerTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProviderPointersList() {
  const user = useAuthStore((state) => state.user);
  const { data: pointers, isLoading, error } = useProviderPointers(user?.id);

  return (
    <AppShell allowedRoles={["PROVIDER_STAFF"]}>
      <PageHeader 
        title="Pointer Management" 
        description="Manage the clinical pointers registered by your organization."
        action={
          <Button asChild>
            <Link href="/provider/pointers/new">Register New Pointer</Link>
          </Button>
        }
      />

      <ProblemAlert error={error} />

      {isLoading ? (
        <div className="space-y-4 mt-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 w-full rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <PointerTable pointers={pointers || []} providerId={user!.id} />
        </div>
      )}
    </AppShell>
  );
}
