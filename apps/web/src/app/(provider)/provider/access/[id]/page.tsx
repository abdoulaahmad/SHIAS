'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAccessGrant, useRevokeAccessGrant } from '@/features/access/hooks';
import { GrantDetailsCard } from '@/features/access/components/GrantDetailsCard';
import { AccessTimeline } from '@/features/access/components/AccessTimeline';
import { GrantDetailsSkeleton } from '@/features/access/components/Skeletons';
import { ProblemAlert } from '@/components/shared/ProblemAlert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ban } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function GrantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const grantId = params.id as string;

  const { data: grant, isLoading, error } = useAccessGrant(grantId);
  const { mutateAsync: revokeGrant, isPending: isRevoking } = useRevokeAccessGrant(grant?.providerId);

  const handleRevoke = async () => {
    try {
      await revokeGrant(grantId);
    } catch (error) {
      console.error('Failed to revoke grant', error);
    }
  };

  if (isLoading) {
    return <GrantDetailsSkeleton />;
  }

  if (error || !grant) {
    return <ProblemAlert error={error || new Error('Grant not found')} />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/provider/access')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Access List
        </Button>

        {grant.status === 'ACTIVE' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Ban className="mr-2 h-4 w-4" /> Revoke Access
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke Access Grant?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. You will immediately lose access to the patient's records associated with this grant.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRevoke} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {isRevoking ? 'Revoking...' : 'Yes, Revoke Access'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <GrantDetailsCard grant={grant} />
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Access Timeline</h3>
          <AccessTimeline grant={grant} />
        </div>
      </div>
    </div>
  );
}
