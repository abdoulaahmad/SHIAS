"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ProblemAlert } from "@/components/shared/ProblemAlert";
import { useAuthStore } from "@/features/auth/store";
import { useProviderPointers } from "@/features/pointer/hooks";
import { PointerTable } from "@/features/pointer/components/PointerTable";
import { Database, FileText, Activity, Pill } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProviderDashboard() {
  const user = useAuthStore((state) => state.user);
  const { data: pointers, isLoading, error } = useProviderPointers(user?.id);

  const activeCount = pointers?.filter(p => p.status === 'ACTIVE').length || 0;
  const docCount = pointers?.filter(p => p.metadata.recordType === 'DOCUMENT').length || 0;
  const labCount = pointers?.filter(p => p.metadata.recordType === 'LAB_RESULT').length || 0;
  const rxCount = pointers?.filter(p => p.metadata.recordType === 'PRESCRIPTION').length || 0;

  const recentPointers = pointers?.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5) || [];

  return (
    <AppShell allowedRoles={["PROVIDER_STAFF"]}>
      <PageHeader 
        title="Provider Dashboard" 
        description="Manage your registered clinical pointers."
        action={
          <Button asChild>
            <Link href="/provider/pointers/new">Register New Pointer</Link>
          </Button>
        }
      />

      <ProblemAlert error={error} title="Failed to load pointers" />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-muted animate-pulse" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Active Pointers" 
              value={activeCount} 
              icon={<Database className="text-primary" />}
              description="Records available for access"
            />
            <StatCard 
              title="Documents" 
              value={docCount} 
              icon={<FileText className="text-blue-500" />}
            />
            <StatCard 
              title="Lab Results" 
              value={labCount} 
              icon={<Activity className="text-green-500" />}
            />
            <StatCard 
              title="Prescriptions" 
              value={rxCount} 
              icon={<Pill className="text-orange-500" />}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold tracking-tight">Recent Pointers</h2>
              <Link href="/provider/pointers" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <PointerTable pointers={recentPointers} providerId={user!.id} />
          </div>
        </div>
      )}
    </AppShell>
  );
}
