"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ProblemAlert } from "@/components/shared/ProblemAlert";
import { useAuthStore } from "@/features/auth/store";
import { usePatientConsents } from "@/features/consent/hooks";
import { ConsentCard } from "@/features/consent/components/ConsentCard";
import { ShieldAlert, CheckCircle2, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PatientDashboard() {
  const user = useAuthStore((state) => state.user);
  const { data: consents, isLoading, error } = usePatientConsents(user?.id);

  const pendingCount = consents?.filter(c => c.status === 'PENDING').length || 0;
  const activeCount = consents?.filter(c => c.status === 'ACTIVE').length || 0;
  const revokedCount = consents?.filter(c => c.status === 'REVOKED').length || 0;
  const uniqueProviders = new Set(consents?.map(c => c.providerId)).size || 0;

  const recentConsents = consents?.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3) || [];

  return (
    <AppShell allowedRoles={["PATIENT"]}>
      <PageHeader 
        title="Dashboard" 
        description="Welcome back. Here is an overview of your health data access."
        action={
          <Button asChild>
            <Link href="/patient/consents">View All Consents</Link>
          </Button>
        }
      />

      <ProblemAlert error={error} title="Failed to load dashboard data" />

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
              title="Pending Requests" 
              value={pendingCount} 
              icon={<ShieldAlert className="text-yellow-500" />}
              description="Requires your attention"
            />
            <StatCard 
              title="Active Consents" 
              value={activeCount} 
              icon={<CheckCircle2 className="text-green-500" />}
              description="Providers with access"
            />
            <StatCard 
              title="Revoked" 
              value={revokedCount} 
              icon={<AlertCircle className="text-red-500" />}
              description="Historical revokes"
            />
            <StatCard 
              title="Providers" 
              value={uniqueProviders} 
              icon={<Users className="text-blue-500" />}
              description="Total connected providers"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
            </div>
            {recentConsents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentConsents.map(consent => (
                  <ConsentCard key={consent.id} consent={consent} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border rounded-xl border-dashed bg-muted/20">
                <p className="text-muted-foreground">No recent consent activity.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
