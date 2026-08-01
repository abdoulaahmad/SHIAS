import { Consent } from "../../types";
import { format } from "date-fns";
import { ConsentStatusBadge } from "./ConsentStatusBadge";

export function ConsentDetailsCard({ consent }: { consent: Consent }) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-6 pb-4 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Consent Details</h2>
          <p className="text-sm text-muted-foreground mt-1">ID: {consent.id}</p>
        </div>
        <ConsentStatusBadge status={consent.status} />
      </div>
      
      <div className="p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-muted-foreground">Provider</dt>
            <dd className="mt-1 text-base">{consent.providerId}</dd>
          </div>
          
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-muted-foreground">Purpose of Request</dt>
            <dd className="mt-1 text-base">{consent.purpose}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">Requested Date</dt>
            <dd className="mt-1 text-base">{format(new Date(consent.createdAt), "MMMM d, yyyy")}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">Expiration</dt>
            <dd className="mt-1 text-base">
              {consent.expiresAt ? format(new Date(consent.expiresAt), "MMMM d, yyyy") : "Never expires"}
            </dd>
          </div>

          <div className="sm:col-span-2 mt-2">
            <dt className="text-sm font-medium text-muted-foreground border-b pb-2 mb-2">Requested Record Types</dt>
            <dd className="mt-2">
              <ul className="list-disc pl-5 space-y-1">
                {consent.scope.map((s, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium">{s.action}</span> - {s.resourceType}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
