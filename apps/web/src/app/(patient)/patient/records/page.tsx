"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProblemAlert } from "@/components/shared/ProblemAlert";
import { useAuthStore } from "@/features/auth/store";
import { usePatientPointers } from "@/features/pointer/hooks";
import { PatientPointerTable } from "@/features/pointer/components/PatientPointerTable";

export default function PatientRecordsPage() {
  const user = useAuthStore((state) => state.user);
  const { data: pointers, isLoading, error } = usePatientPointers(user?.id);

  return (
    <AppShell allowedRoles={["PATIENT"]}>
      <PageHeader 
        title="My Medical Records" 
        description="View all clinical data pointers registered to your profile by your healthcare providers."
      />

      <ProblemAlert error={error} />

      {isLoading ? (
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 w-full rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <PatientPointerTable pointers={pointers || []} />
        </div>
      )}
    </AppShell>
  );
}
