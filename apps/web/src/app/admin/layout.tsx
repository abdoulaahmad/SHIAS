import { RoleGuard } from "@/components/shared/RoleGuard";
import Link from "next/link";
import { LayoutDashboard, Users, UserRound, Shield, FileText } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
          <div className="h-14 flex items-center px-6 border-b border-border font-semibold text-primary">
            SHIAS Admin
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              <li>
                <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/users" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Users className="h-4 w-4" />
                  Users
                </Link>
              </li>
              <li>
                <Link href="/admin/providers" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                  <UserRound className="h-4 w-4" />
                  Providers
                </Link>
              </li>
              <li>
                <Link href="/admin/audit" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                  <FileText className="h-4 w-4" />
                  Audit Logs
                </Link>
              </li>
              <li>
                <Link href="/admin/access" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Shield className="h-4 w-4" />
                  Access Monitoring
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-background flex flex-col">
          <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card md:hidden">
            <span className="font-semibold text-primary">SHIAS Admin</span>
          </header>
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
