import { Badge } from '@/components/ui/badge';
import { ConsentPurpose } from '../../consent/types';
import { PurposeConfig } from '../utils/purposeConfig';
import * as Icons from 'lucide-react';

interface PurposeBadgeProps {
  purpose: ConsentPurpose;
  showIcon?: boolean;
}

export function PurposeBadge({ purpose, showIcon = true }: PurposeBadgeProps) {
  const config = PurposeConfig[purpose] || { label: purpose, icon: 'HelpCircle' };
  
  // @ts-ignore - Dynamic icon
  const IconComponent = Icons[config.icon] || Icons.HelpCircle;

  return (
    <Badge variant="outline" className="flex items-center gap-1.5 font-normal text-muted-foreground">
      {showIcon && <IconComponent className="h-3.5 w-3.5" />}
      <span>{config.label}</span>
    </Badge>
  );
}
