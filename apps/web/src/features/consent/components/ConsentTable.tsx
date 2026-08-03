import { Consent } from "../../types";
import { ConsentStatusBadge } from "./ConsentStatusBadge";
import { format } from "@/lib/date-fns";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function ConsentTable({ consents }: { consents: Consent[] }) {
  if (consents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-xl border-dashed bg-muted/20">
        <div className="text-muted-foreground text-center">
          <p className="font-medium">No consents found</p>
          <p className="text-sm">You do not have any consent requests matching this criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 border-b">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Provider</th>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Purpose</th>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Requested Date</th>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th scope="col" className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {consents.map((consent) => (
              <tr key={consent.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium whitespace-nowrap">{consent.providerId}</td>
                <td className="px-6 py-4 truncate max-w-[200px]" title={consent.purpose}>{consent.purpose}</td>
                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(consent.createdAt), "MMM d, yyyy")}</td>
                <td className="px-6 py-4 whitespace-nowrap"><ConsentStatusBadge status={consent.status} /></td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/patient/consents/${consent.id}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">View Details</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
