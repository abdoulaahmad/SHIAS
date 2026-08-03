import { PageHeader } from "@/components/shared/PageHeader";
import { UserTable } from "@/features/admin/components/UserTable";
import { SearchToolbar } from "@/components/shared/SearchToolbar";
import { FilterBar } from "@/components/shared/FilterBar";

export default function AdminUsersPage() {
  const roleFilters = [
    {
      paramName: "role",
      placeholder: "Role",
      options: [
        { label: "Admin", value: "SYSTEM_ADMIN" },
        { label: "Patient", value: "PATIENT" },
        { label: "Provider Staff", value: "PROVIDER" },
      ],
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Users" 
        description="Manage system users and access roles" 
      />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchToolbar placeholder="Search by name, email, or health ID..." />
        <FilterBar filters={roleFilters} />
      </div>
      <UserTable />
    </div>
  );
}
