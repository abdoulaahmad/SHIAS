"use client";

import { useAuditEvent } from "@/features/admin/hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminAuditDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading, isError } = useAuditEvent(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <Button variant="outline" asChild>
          <Link href="/admin/audit">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Audit Logs
          </Link>
        </Button>
        <EmptyState title="Audit Event not found" description="The event you are looking for does not exist." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/audit">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader 
          title={data.action} 
          description={data.id} 
          className="pb-0"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="font-mono text-sm">{data.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Severity</p>
              <Badge variant={data.severity === "CRITICAL" ? "destructive" : data.severity === "WARNING" ? "secondary" : "outline"}>
                {data.severity}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p>{data.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
              <p>{new Date(data.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Actor ID</p>
              <p className="font-mono text-sm">{data.actorId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Actor Role</p>
              <p>{data.actorRole}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resource Type</p>
              <p>{data.resourceType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resource ID</p>
              <p className="font-mono text-sm">{data.resourceId}</p>
            </div>
          </div>
          
          {data.details && (
            <div className="mt-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Additional Details</p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">
                {JSON.stringify(data.details, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
