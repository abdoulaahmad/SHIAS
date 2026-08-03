import { Consent } from "../../types";
import { ConsentStatusBadge } from "./ConsentStatusBadge";
import { format } from "@/lib/date-fns";
import Link from "next/link";
import { Calendar, FileText, ArrowRight } from "lucide-react";

export function ConsentCard({ consent }: { consent: Consent }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold text-lg">Provider Request: {consent.providerId}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{consent.purpose}</p>
        </div>
        <ConsentStatusBadge status={consent.status} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>Requested: {format(new Date(consent.createdAt), "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          <span>{consent.scope.length} record type(s)</span>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 flex justify-end">
        <Link 
          href={`/patient/consents/${consent.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
