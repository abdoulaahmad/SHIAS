"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuthStore } from "@/features/auth/store";
import { Input } from "@/components/ui/input";

export default function ProviderSettingsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <AppShell allowedRoles={["PROVIDER"]}>
      <PageHeader 
        title="Organization Settings" 
        description="Manage your healthcare organization's profile and staff access."
      />

      <div className="max-w-2xl mt-6 space-y-8">
        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Organization Details</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Staff Name</label>
              <Input value={user?.name || ""} disabled />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Contact Email</label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Provider ID</label>
              <Input value={user?.providerId || ""} disabled className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">Internal system ID used for clinical data pointers.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
