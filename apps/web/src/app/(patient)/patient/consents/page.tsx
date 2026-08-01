"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProblemAlert } from "@/components/shared/ProblemAlert";
import { useAuthStore } from "@/features/auth/store";
import { usePatientConsents } from "@/features/consent/hooks";
import { ConsentTable } from "@/features/consent/components/ConsentTable";
import { Input } from "@/components/ui/input";
import { ConsentStatus } from "@/features/consent/types";

export default function PatientConsentsList() {
  const user = useAuthStore((state) => state.user);
  const { data: consents, isLoading, error } = usePatientConsents(user?.id);
  const [filter, setFilter] = useState<ConsentStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filteredConsents = consents?.filter(c => {
    if (filter !== "ALL" && c.status !== filter) return false;
    if (search && !c.providerId.toLowerCase().includes(search.toLowerCase()) && !c.purpose.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) || [];

  return (
    <AppShell allowedRoles={["PATIENT"]}>
      <PageHeader 
        title="Consent Management" 
        description="View and manage who has access to your medical records."
      />

      <ProblemAlert error={error} />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input 
          placeholder="Search by provider or purpose..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md bg-background"
        />
        <div className="flex bg-muted p-1 rounded-md overflow-x-auto">
          {["ALL", "PENDING", "ACTIVE", "REVOKED", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm whitespace-nowrap transition-all ${
                filter === status ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 w-full rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <ConsentTable consents={filteredConsents} />
      )}
    </AppShell>
  );
}
