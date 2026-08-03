"use client";

import { useProviders } from "../hooks";
import { AdminTable } from "@/components/shared/AdminTable";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { Badge } from "@/components/ui/badge";
import { ProviderDto } from "../types";
import { useSearchParams, useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared/EmptyState";

export function ProviderTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const page = Number(searchParams?.get("page")) || 1;
  const limit = Number(searchParams?.get("limit")) || 20;
  const search = searchParams?.get("search") || undefined;
  const status = searchParams?.get("status") || undefined;
  const sortBy = searchParams?.get("sortBy") || "createdAt";
  const sortOrder = searchParams?.get("sortOrder") as "asc" | "desc" || "desc";

  const { data, isLoading, isError } = useProviders({ page, limit, search, status, sortBy, sortOrder });

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
    { key: "name", header: "Name", sortable: true, cell: (item: ProviderDto) => item.name },
    { key: "type", header: "Type", sortable: true, cell: (item: ProviderDto) => item.type },
    { key: "status", header: "Status", sortable: true, cell: (item: ProviderDto) => (
      <Badge variant={item.status === "ACTIVE" ? "default" : "secondary"}>{item.status}</Badge>
    )},
    { key: "createdAt", header: "Registered", sortable: true, cell: (item: ProviderDto) => new Date(item.createdAt).toLocaleDateString() },
  ];

  if (isError) return <EmptyState title="Error loading providers" description="Please try again later." />;

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
        onRowClick={(item) => router.push(`/admin/providers/${item.id}`)}
        emptyState={<EmptyState title="No providers found" />}
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
