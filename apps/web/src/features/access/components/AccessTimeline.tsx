import { Timeline, TimelineItem } from '@/components/shared/Timeline';
import { AccessGrant } from '../types';
import { format } from "@/lib/date-fns";

interface AccessTimelineProps {
  grant: AccessGrant;
}

export function AccessTimeline({ grant }: AccessTimelineProps) {
  const events = [];

  // Assuming consent createdAt is roughly the request creation time
  events.push({
    title: 'Access Requested',
    time: format(new Date(grant.createdAt), 'MMM d, yyyy h:mm a'),
    description: `Provider requested access for purpose: ${grant.purpose}`,
    isActive: false,
  });

  events.push({
    title: 'Consent Granted',
    time: format(new Date(grant.createdAt), 'MMM d, yyyy h:mm a'),
    description: `Patient approved the consent request`,
    isActive: grant.status === 'ACTIVE',
  });

  if (grant.revokedAt) {
    events.push({
      title: 'Access Revoked',
      time: format(new Date(grant.revokedAt), 'MMM d, yyyy h:mm a'),
      description: `The access grant was manually revoked`,
      isActive: grant.status === 'REVOKED',
    });
  }

  const isExpired = new Date(grant.expiresAt) < new Date();
  if (isExpired && !grant.revokedAt) {
    events.push({
      title: 'Access Expired',
      time: format(new Date(grant.expiresAt), 'MMM d, yyyy h:mm a'),
      description: `The time limit for this access grant was reached`,
      isActive: grant.status === 'EXPIRED',
    });
  }

  return (
    <Timeline>
      {events.map((event, index) => (
        <TimelineItem
          key={index}
          title={event.title}
          time={event.time}
          description={event.description}
          isActive={event.isActive}
        />
      ))}
    </Timeline>
  );
}
