"use client";

import { useAuditEvents } from "../hooks";
import { AdminTable } from "@/components/shared/AdminTable";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { Badge } from "@/components/ui/badge";
import { AuditEventDto } from "../types";
import { useSearchParams, useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared/EmptyState";

export function AuditTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const page = Number(searchParams?.get("page")) || 1;
  const limit = Number(searchParams?.get("limit")) || 20;
  const category = searchParams?.get("category") || undefined;
  const severity = searchParams?.get("severity") || undefined;
  const sortBy = searchParams?.get("sortBy") || "timestamp";
  const sortOrder = searchParams?.get("sortOrder") as "asc" | "desc" || "desc";

  const { data, isLoading, isError } = useAuditEvents({ page, limit, category, severity, sortBy, sortOrder });

  const handleSort = (key: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (sortBy === key) {
      params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", key);
      params.set("sortOrder", "asc");
    }
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const columns = [
    { key: "timestamp", header: "Timestamp", sortable: true, cell: (item: AuditEventDto) => new Date(item.timestamp).toLocaleString() },
    { key: "action", header: "Action", sortable: true, cell: (item: AuditEventDto) => item.action },
    { key: "category", header: "Category", sortable: true, cell: (item: AuditEventDto) => item.category },
    { key: "severity", header: "Severity", sortable: true, cell: (item: AuditEventDto) => (
      <Badge variant={item.severity === "CRITICAL" ? "destructive" : item.severity === "WARNING" ? "secondary" : "outline"}>
        {item.severity}
      </Badge>
    )},
    { key: "actorRole", header: "Actor", sortable: false, cell: (item: AuditEventDto) => item.actorRole },
  ];

  if (isError) return <EmptyState title="Error loading audit events" description="Please try again later." />;

  return (
    <div className="space-y-4">
      <AdminTable
        data={data?.items || []}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onRowClick={(item) => router.push(`/admin/audit/${item.id}`)}
        emptyState={<EmptyState title="No audit events found" />}
      />
      {data && data.total > 0 && (
        <PaginationControls
          page={page}
          pageSize={limit}
          total={data.total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
