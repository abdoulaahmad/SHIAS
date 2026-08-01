import { Badge } from '@/components/ui/badge';
import { AccessStatus } from '../types';

interface GrantStatusBadgeProps {
  status: AccessStatus;
}

const statusConfig: Record<AccessStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  ACTIVE: { label: 'Active', variant: 'default' },
  REVOKED: { label: 'Revoked', variant: 'destructive' },
  EXPIRED: { label: 'Expired', variant: 'outline' },
  DENIED: { label: 'Denied', variant: 'destructive' },
};

export function GrantStatusBadge({ status }: GrantStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'outline' };

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  );
}
