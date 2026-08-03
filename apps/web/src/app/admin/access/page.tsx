"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { AccessGrantTable } from "@/features/admin/components/AccessGrantTable";
import { AccessRequestTable } from "@/features/admin/components/AccessRequestTable";
import { FilterBar } from "@/components/shared/FilterBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function AdminAccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams?.get("tab") || "grants";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", value);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const grantFilters = [
    {
      paramName: "status",
      placeholder: "Status",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Revoked", value: "REVOKED" },
        { label: "Expired", value: "EXPIRED" },
      ],
    }
  ];

  const requestFilters = [
    {
      paramName: "status",
      placeholder: "Status",
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
      ],
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Access Monitoring" 
        description="Monitor system-wide access requests and active grants" 
      />

      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="grants">Active Grants</TabsTrigger>
            <TabsTrigger value="requests">Access Requests</TabsTrigger>
          </TabsList>
          
          <div>
            {currentTab === "grants" ? (
              <FilterBar filters={grantFilters} />
            ) : (
              <FilterBar filters={requestFilters} />
            )}
          </div>
        </div>

        <TabsContent value="grants">
          <AccessGrantTable />
        </TabsContent>
        <TabsContent value="requests">
          <AccessRequestTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
