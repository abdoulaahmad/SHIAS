import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { AccessGrant } from '../types';
import { GrantStatusBadge } from './GrantStatusBadge';
import { PurposeBadge } from './PurposeBadge';
import { format } from 'date-fns';
import { FileText, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AccessGrantCardProps {
  grant: AccessGrant;
}

export function AccessGrantCard({ grant }: AccessGrantCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">Patient: {grant.patientId.substring(0, 8)}...</CardTitle>
          <GrantStatusBadge status={grant.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <PurposeBadge purpose={grant.purpose} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{grant.pointerIds.length} Pointers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Expires: {format(new Date(grant.expiresAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/provider/access/${grant.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
