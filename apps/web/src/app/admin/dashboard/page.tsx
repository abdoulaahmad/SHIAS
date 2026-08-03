"use client";

import { useDashboardMetrics } from "@/features/admin/hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricsGrid } from "@/components/shared/MetricsGrid";
import { StatCard } from "@/components/shared/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserRound, Shield, FileText } from "lucide-react";

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboardMetrics();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Dashboard" 
        description="System overview and operational metrics" 
      />

      <MetricsGrid>
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard 
              title="Total Users" 
              value={data?.totalUsers || 0} 
              icon={<Users className="h-4 w-4" />} 
            />
            <StatCard 
              title="Total Providers" 
              value={data?.totalProviders || 0} 
              icon={<UserRound className="h-4 w-4" />} 
            />
            <StatCard 
              title="Active Grants" 
              value={data?.activeGrants || 0} 
              icon={<Shield className="h-4 w-4 text-green-500" />} 
            />
            <StatCard 
              title="Pending Requests" 
              value={data?.pendingRequests || 0} 
              icon={<FileText className="h-4 w-4 text-orange-500" />} 
            />
          </>
        )}
      </MetricsGrid>
    </div>
  );
}
