import { Consent } from "../../types";
import { format } from "@/lib/date-fns";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConsentTimeline({ consent }: { consent: Consent }) {
  const events = [];

  events.push({
    title: "Request Created",
    date: new Date(consent.createdAt),
    description: `Provider requested access for: ${consent.purpose}`,
    icon: Clock,
    color: "text-blue-500",
  });

  if (consent.status === 'ACTIVE' || consent.status === 'REVOKED' || consent.status === 'EXPIRED') {
    events.push({
      title: "Consent Approved",
      date: new Date(consent.updatedAt),
      description: "You approved the consent request.",
      icon: CheckCircle2,
      color: "text-green-500",
    });
  }

  if (consent.status === 'REJECTED') {
    events.push({
      title: "Consent Rejected",
      date: new Date(consent.updatedAt),
      description: "You rejected the consent request.",
      icon: XCircle,
      color: "text-gray-500",
    });
  }

  if (consent.status === 'REVOKED' && consent.revokedAt) {
    events.push({
      title: "Consent Revoked",
      date: new Date(consent.revokedAt),
      description: "You revoked the provider's access.",
      icon: AlertCircle,
      color: "text-red-500",
    });
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const Icon = event.icon;
        return (
          <div key={index} className="flex gap-4 relative">
            {index !== events.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-[-16px] w-px bg-border" />
            )}
            <div className="relative mt-1 bg-background">
              <Icon className={cn("h-8 w-8 p-1.5 rounded-full bg-muted", event.color)} />
            </div>
            <div className="flex flex-col pb-4">
              <h4 className="text-sm font-semibold">{event.title}</h4>
              <span className="text-xs text-muted-foreground">{format(event.date, "MMM d, yyyy 'at' h:mm a")}</span>
              <p className="text-sm mt-1">{event.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
