"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store";
import { Home, Users, FileText, Settings, ShieldAlert, Activity } from "lucide-react";

type Role = "PATIENT" | "PROVIDER_STAFF" | "ADMIN";

const NAV_ITEMS: Record<Role, { title: string; href: string; icon: React.ElementType }[]> = {
  PATIENT: [
    { title: "Dashboard", href: "/patient/dashboard", icon: Home },
    { title: "My Records", href: "/patient/records", icon: FileText },
    { title: "Consent", href: "/patient/consent", icon: ShieldAlert },
    { title: "Settings", href: "/patient/settings", icon: Settings },
  ],
  PROVIDER_STAFF: [
    { title: "Dashboard", href: "/provider/dashboard", icon: Home },
    { title: "Patients", href: "/provider/patients", icon: Users },
    { title: "Access Requests", href: "/provider/requests", icon: Activity },
    { title: "Settings", href: "/provider/settings", icon: Settings },
  ],
  ADMIN: [
    { title: "Dashboard", href: "/admin/dashboard", icon: Home },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "System Logs", href: "/admin/logs", icon: Activity },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const items = NAV_ITEMS[user.role] || [];

  return (
    <div className="hidden border-r bg-muted/40 md:block w-64 min-h-screen">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Activity className="h-6 w-6 text-primary" />
            <span className="">SHIAS</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
