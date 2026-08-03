"use client";

import { useAccessRequests } from "../hooks";
import { AdminTable } from "@/components/shared/AdminTable";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { Badge } from "@/components/ui/badge";
import { AccessRequestDto } from "../types";
import { useSearchParams, useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared/EmptyState";

export function AccessRequestTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const page = Number(searchParams?.get("page")) || 1;
  const limit = Number(searchParams?.get("limit")) || 20;
  const status = searchParams?.get("status") || undefined;
  const sortBy = searchParams?.get("sortBy") || "createdAt";
  const sortOrder = searchParams?.get("sortOrder") as "asc" | "desc" || "desc";

  const { data, isLoading, isError } = useAccessRequests({ page, limit, status, sortBy, sortOrder });

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
    { key: "patientName", header: "Patient", sortable: false, cell: (item: AccessRequestDto) => item.patientName },
    { key: "providerName", header: "Provider", sortable: false, cell: (item: AccessRequestDto) => item.providerName },
    { key: "purpose", header: "Purpose", sortable: false, cell: (item: AccessRequestDto) => item.purpose },
    { key: "status", header: "Status", sortable: true, cell: (item: AccessRequestDto) => (
      <Badge variant={item.status === "PENDING" ? "secondary" : "outline"}>{item.status}</Badge>
    )},
    { key: "createdAt", header: "Requested On", sortable: true, cell: (item: AccessRequestDto) => new Date(item.createdAt).toLocaleDateString() },
  ];

  if (isError) return <EmptyState title="Error loading access requests" description="Please try again later." />;

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
        emptyState={<EmptyState title="No access requests found" />}
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
