'use client';

import { useAuthStore } from '@/features/auth/store';
import { useProviderGrants, useProviderAccessRequests } from '@/features/access/hooks';
import { PageHeader } from '@/components/shared/PageHeader';
import { AccessGrantCard } from '@/features/access/components/AccessGrantCard';
import { AccessTableSkeleton } from '@/features/access/components/Skeletons';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProblemAlert } from '@/components/shared/ProblemAlert';

export default function ProviderAccessPage() {
  const { user } = useAuthStore();
  
  const { 
    data: grants = [], 
    isLoading: isLoadingGrants,
    error: grantsError
  } = useProviderGrants(user?.providerId || '');

  const {
    data: requests = [],
    isLoading: isLoadingRequests,
    error: requestsError
  } = useProviderAccessRequests(user?.providerId || '');

  const activeGrants = grants.filter(g => g.status === 'ACTIVE');
  const pastGrants = grants.filter(g => ['EXPIRED', 'REVOKED'].includes(g.status));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Access Grants" 
        description="Manage your access to patient records."
      >
        <Link href="/provider/access/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Request Access
          </Button>
        </Link>
      </PageHeader>

      {(grantsError || requestsError) && (
        <ProblemAlert error={grantsError || requestsError} />
      )}

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Grants ({activeGrants.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests ({requests.length})</TabsTrigger>
          <TabsTrigger value="past">Past Grants ({pastGrants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoadingGrants ? (
            <AccessTableSkeleton />
          ) : activeGrants.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center bg-muted/20">
              <p className="text-sm text-muted-foreground mb-4">You do not have any active access grants.</p>
              <Link href="/provider/access/new">
                <Button variant="outline">Request Access</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeGrants.map(grant => (
                <AccessGrantCard key={grant.id} grant={grant} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {isLoadingRequests ? (
            <AccessTableSkeleton />
          ) : requests.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center bg-muted/20">
              <p className="text-sm text-muted-foreground">You have no pending access requests.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* For simplicity we are mapping requests to a generic card or just using the grant card visually but they don't have grant status yet, so ideally a separate RequestCard is needed. For now we just show them in a basic card layout */}
              {requests.map(request => (
                <div key={request.id} className="rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="font-semibold mb-2">Patient: {request.patientId.substring(0,8)}...</h3>
                  <p className="text-sm text-muted-foreground mb-4">Purpose: {request.purpose}</p>
                  <div className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded">
                    Status: Pending Patient Approval
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {isLoadingGrants ? (
            <AccessTableSkeleton />
          ) : pastGrants.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center bg-muted/20">
              <p className="text-sm text-muted-foreground">You do not have any past access grants.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastGrants.map(grant => (
                <AccessGrantCard key={grant.id} grant={grant} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
