"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PatientSettingsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <AppShell allowedRoles={["PATIENT"]}>
      <PageHeader 
        title="Settings" 
        description="Manage your account profile and security preferences."
      />

      <div className="max-w-2xl mt-6 space-y-8">
        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={user?.name || ""} disabled />
              <p className="text-xs text-muted-foreground">Your name is verified by your healthcare provider and cannot be changed here.</p>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input value={user?.email || ""} disabled />
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm border-destructive/20">
          <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and remove all your data from the health information exchange. This action cannot be undone.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </AppShell>
  );
}
