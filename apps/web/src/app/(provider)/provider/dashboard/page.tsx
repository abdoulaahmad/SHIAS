"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ProblemAlert } from "@/components/shared/ProblemAlert";
import { ActivityFeed } from "@/components/shared/ActivityFeed";
import { useAuthStore } from "@/features/auth/store";
import { useProviderPointers } from "@/features/pointer/hooks";
import { useProviderGrants, useProviderAccessRequests } from "@/features/access/hooks";
import { PointerTable } from "@/features/pointer/components/PointerTable";
import { GrantStatusBadge } from "@/features/access/components/GrantStatusBadge";
import { Database, FileText, CheckCircle, Clock, Ban, Key } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "@/lib/date-fns";

export default function ProviderDashboard() {
  const user = useAuthStore((state) => state.user);
  
  const { data: pointers, isLoading: isLoadingPointers, error: pointerError } = useProviderPointers(user?.providerId || '');
  const { data: grants = [], isLoading: isLoadingGrants, error: grantsError } = useProviderGrants(user?.providerId || '');
  const { data: requests = [], isLoading: isLoadingRequests, error: requestsError } = useProviderAccessRequests(user?.providerId || '');

  const isLoading = isLoadingPointers || isLoadingGrants || isLoadingRequests;
  const error = pointerError || grantsError || requestsError;

  const activePointersCount = pointers?.filter(p => p.status === 'ACTIVE').length || 0;
  
  const activeGrantsCount = grants.filter(g => g.status === 'ACTIVE').length;
  const expiredGrantsCount = grants.filter(g => g.status === 'EXPIRED').length;
  const pendingRequestsCount = requests.length;

  const recentPointers = pointers?.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5) || [];

  const activityItems = [
    ...grants.map(g => ({
      id: `grant-${g.id}`,
      title: `Access Grant ${g.status.toLowerCase()}`,
      description: `Purpose: ${g.purpose}`,
      timestamp: format(new Date(g.createdAt), 'MMM d, h:mm a'),
      rawDate: new Date(g.createdAt).getTime(),
      icon: <Key className="h-4 w-4" />,
      statusNode: <GrantStatusBadge status={g.status} />
    })),
    ...requests.map(r => ({
      id: `req-${r.id}`,
      title: `Access Requested`,
      description: `Purpose: ${r.purpose}`,
      timestamp: format(new Date(r.createdAt), 'MMM d, h:mm a'),
      rawDate: new Date(r.createdAt).getTime(),
      icon: <Clock className="h-4 w-4" />,
      statusNode: <GrantStatusBadge status="PENDING" />
    }))
  ].sort((a, b) => b.rawDate - a.rawDate).slice(0, 10);

  return (
    <AppShell allowedRoles={["PROVIDER"]}>
      <PageHeader 
        title="Provider Dashboard" 
        description="Overview of your registered pointers and patient access."
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/provider/pointers/new">Register Pointer</Link>
            </Button>
            <Button asChild>
              <Link href="/provider/access/new">Request Access</Link>
            </Button>
          </div>
        }
      />

      {error && <ProblemAlert error={error} title="Failed to load dashboard data" />}

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-64 rounded-xl bg-muted animate-pulse" />
            <div className="md:col-span-1 h-64 rounded-xl bg-muted animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Active Pointers" 
              value={activePointersCount} 
              icon={<Database className="text-primary" />}
              description="Records registered"
            />
            <StatCard 
              title="Pending Approval" 
              value={pendingRequestsCount} 
              icon={<Clock className="text-amber-500" />}
              description="Awaiting patient consent"
            />
            <StatCard 
              title="Active Grants" 
              value={activeGrantsCount} 
              icon={<CheckCircle className="text-green-500" />}
              description="Current access grants"
            />
            <StatCard 
              title="Expired Grants" 
              value={expiredGrantsCount} 
              icon={<Ban className="text-red-500" />}
              description="Past access grants"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Recent Pointers</h2>
                <Link href="/provider/pointers" className="text-sm text-primary hover:underline">
                  View all pointers
                </Link>
              </div>
              {user?.providerId ? (
                <PointerTable pointers={recentPointers} providerId={user.providerId} />
              ) : (
                <div className="text-sm text-muted-foreground p-4 text-center border rounded-lg bg-card">
                  Please log out and log back in to sync your provider profile.
                </div>
              )}
            </div>
            <div className="md:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold tracking-tight">Access Activity</h2>
                <Link href="/provider/access" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              <ActivityFeed items={activityItems} />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
