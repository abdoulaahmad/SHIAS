"use client";

import { useLogoutMutation, useCurrentUser } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserNav() {
  const { data: user } = useCurrentUser();
  const logout = useLogoutMutation();
  const router = useRouter();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      {user && (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:flex flex-col text-sm">
            <span className="font-medium leading-none">{user.email}</span>
            <span className="text-xs text-muted-foreground mt-1">{user.role}</span>
          </div>
        </div>
      )}
      <Button onClick={handleLogout} className="gap-2 bg-transparent border border-input text-foreground hover:bg-accent hover:text-accent-foreground h-9 px-3">
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
}
