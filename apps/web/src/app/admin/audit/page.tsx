import { PageHeader } from "@/components/shared/PageHeader";
import { AuditTable } from "@/features/admin/components/AuditTable";
import { FilterBar } from "@/components/shared/FilterBar";

export default function AdminAuditPage() {
  const auditFilters = [
    {
      paramName: "category",
      placeholder: "Category",
      options: [
        { label: "Auth", value: "AUTH" },
        { label: "Consent", value: "CONSENT" },
        { label: "Access", value: "ACCESS" },
        { label: "System", value: "SYSTEM" },
        { label: "Clinical", value: "CLINICAL" },
      ],
    },
    {
      paramName: "severity",
      placeholder: "Severity",
      options: [
        { label: "Info", value: "INFO" },
        { label: "Warning", value: "WARNING" },
        { label: "Critical", value: "CRITICAL" },
      ],
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Audit Logs" 
        description="Monitor system activity and security events" 
      />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1" />
        <FilterBar filters={auditFilters} />
      </div>
      <AuditTable />
    </div>
  );
}
