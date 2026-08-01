import { Card, CardContent } from '@/components/ui/card';
import { PurposeBadge } from './PurposeBadge';
import { ConsentPurpose } from '../../consent/types';
import { Pointer } from '../../pointer/types';
import { FileText, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AccessRequestSummaryProps {
  patientId: string;
  pointers: Pointer[];
  purpose: ConsentPurpose;
}

export function AccessRequestSummary({ patientId, pointers, purpose }: AccessRequestSummaryProps) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center gap-4">
          <User className="h-8 w-8 text-muted-foreground p-1.5 bg-background rounded-full border" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Patient</h4>
            <p className="text-sm text-muted-foreground">{patientId}</p>
          </div>
        </div>
        
        <Separator />

        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-muted-foreground p-1.5 bg-background rounded-full border" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Requested Records</h4>
            <p className="text-sm text-muted-foreground">{pointers.length} Pointers Selected</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-4">
          <div className="h-8 w-8 text-muted-foreground p-1.5 bg-background rounded-full border flex items-center justify-center">
            <PurposeBadge purpose={purpose} showIcon={true} />
          </div>
          <div className="space-y-1 ml-4">
            <h4 className="text-sm font-semibold">Purpose</h4>
            <p className="text-sm text-muted-foreground">This request is solely for the stated purpose.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
