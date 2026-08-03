"use client";

import { Sidebar } from "./Sidebar";
import { UserNav } from "./UserNav";
import { RoleGuard } from "../shared/RoleGuard";

interface AppShellProps {
  children: React.ReactNode;
  allowedRoles?: Array<"PATIENT" | "PROVIDER" | "SYSTEM_ADMIN">;
}

export function AppShell({ children, allowedRoles }: AppShellProps) {
  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <div className="grid min-h-screen w-full md:grid-cols-[250px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-between">
            <div className="w-full flex-1">
              {/* Mobile menu toggle could go here */}
            </div>
            <UserNav />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
