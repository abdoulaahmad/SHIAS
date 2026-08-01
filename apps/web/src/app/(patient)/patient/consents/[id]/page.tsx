"use client";

import { use } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProblemAlert } from "@/components/shared/ProblemAlert";
import { useConsentDetails } from "@/features/consent/hooks";
import { ConsentDetailsCard } from "@/features/consent/components/ConsentDetailsCard";
import { ConsentTimeline } from "@/features/consent/components/ConsentTimeline";
import { ConsentActions } from "@/features/consent/components/ConsentActions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PatientConsentDetails({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, dynamic route params should be unwrapped with `use()`
  const resolvedParams = use(params);
  const { data: consent, isLoading, error } = useConsentDetails(resolvedParams.id);

  return (
    <AppShell allowedRoles={["PATIENT"]}>
      <div className="mb-4">
        <Link href="/patient/consents" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Consents
        </Link>
      </div>

      <PageHeader 
        title="Consent Request" 
        action={consent && <ConsentActions consent={consent} />}
      />

      <ProblemAlert error={error} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="h-64 rounded-xl bg-muted animate-pulse" />
          </div>
          <div className="space-y-6 border-l pl-8">
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : consent ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <ConsentDetailsCard consent={consent} />
          </div>
          <div className="space-y-6 border-l pl-0 md:pl-8 pt-6 md:pt-0 border-t md:border-t-0 mt-6 md:mt-0">
            <h3 className="font-semibold text-lg">Activity Timeline</h3>
            <ConsentTimeline consent={consent} />
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
