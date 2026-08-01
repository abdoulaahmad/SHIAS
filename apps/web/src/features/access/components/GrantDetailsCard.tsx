import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AccessGrant } from '../types';
import { GrantStatusBadge } from './GrantStatusBadge';
import { PurposeBadge } from './PurposeBadge';
import { format } from 'date-fns';
import { FileText, Clock, User, Fingerprint, CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface GrantDetailsCardProps {
  grant: AccessGrant;
}

export function GrantDetailsCard({ grant }: GrantDetailsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Grant Information</CardTitle>
        <GrantStatusBadge status={grant.status} />
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Fingerprint className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Grant ID</p>
              <p className="text-sm text-muted-foreground">{grant.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Patient</p>
              <p className="text-sm text-muted-foreground">{grant.patientId}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Fingerprint className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Consent ID</p>
              <p className="text-sm text-muted-foreground">{grant.consentId}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-5 w-5 flex items-center justify-center">
              <PurposeBadge purpose={grant.purpose} showIcon={true} />
            </div>
            <div className="space-y-1 ml-4">
              <p className="text-sm font-medium leading-none">Purpose of Use</p>
              <p className="text-sm text-muted-foreground">This access is granted exclusively for this purpose.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Accessible Records</p>
              <p className="text-sm text-muted-foreground">{grant.pointerIds.length} Pointers authorized</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Issued Date</p>
              <p className="text-sm text-muted-foreground">{format(new Date(grant.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Expiration Date</p>
              <p className="text-sm text-muted-foreground">{format(new Date(grant.expiresAt), 'MMM d, yyyy')}</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
