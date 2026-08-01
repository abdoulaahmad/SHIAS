"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { RegisterPointerForm } from "@/features/pointer/components/RegisterPointerForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function RegisterPointerPage() {
  return (
    <AppShell allowedRoles={["PROVIDER_STAFF"]}>
      <div className="mb-4">
        <Link href="/provider/pointers" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Pointers
        </Link>
      </div>

      <PageHeader 
        title="Register Pointer" 
        description="Register a new clinical pointer to make a patient record accessible via SHIAS."
      />

      <div className="mt-6">
        <RegisterPointerForm />
      </div>
    </AppShell>
  );
}
