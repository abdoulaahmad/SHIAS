"use client";

import { AppShell } from "@/components/layout/AppShell";

export default function AdminDashboard() {
  return (
    <AppShell allowedRoles={["ADMIN"]}>
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-4 text-muted-foreground">Manage system configuration and users.</p>
      </div>
    </AppShell>
  );
}
