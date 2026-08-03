"use client";

import { useProvider } from "@/features/admin/hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminProviderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading, isError } = useProvider(id);

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
          <Link href="/admin/providers">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Providers
          </Link>
        </Button>
        <EmptyState title="Provider not found" description="The provider you are looking for does not exist." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/providers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader 
          title={data.name} 
          description={data.type} 
          className="pb-0"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="font-mono text-sm">{data.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={data.status === "ACTIVE" ? "default" : "secondary"}>{data.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p>{data.type || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Registered</p>
              <p>{new Date(data.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
