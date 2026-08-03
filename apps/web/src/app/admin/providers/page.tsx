import { PageHeader } from "@/components/shared/PageHeader";
import { ProviderTable } from "@/features/admin/components/ProviderTable";
import { SearchToolbar } from "@/components/shared/SearchToolbar";
import { FilterBar } from "@/components/shared/FilterBar";

export default function AdminProvidersPage() {
  const statusFilters = [
    {
      paramName: "status",
      placeholder: "Status",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Suspended", value: "SUSPENDED" },
        { label: "Pending", value: "PENDING" },
      ],
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Providers" 
        description="Manage healthcare providers and clinics" 
      />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchToolbar placeholder="Search by name or type..." />
        <FilterBar filters={statusFilters} />
      </div>
      <ProviderTable />
    </div>
  );
}
