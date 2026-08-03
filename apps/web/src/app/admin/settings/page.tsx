"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Configuration" 
        description="Manage global SHIAS network settings and security parameters." 
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Security Policies</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Strict Pointer Verification</h4>
                <p className="text-xs text-muted-foreground mt-1">Require external URI validation for all new clinical pointers before registration.</p>
              </div>
              <Switch checked={true} disabled />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Automatic Consent Expiration</h4>
                <p className="text-xs text-muted-foreground mt-1">Automatically revoke patient consent grants after 1 year of inactivity.</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Audit Log Retention</h4>
                <p className="text-xs text-muted-foreground mt-1">Keep system access logs indefinitely. (Currently enforced by law)</p>
              </div>
              <Switch checked={true} disabled />
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm py-2 border-b border-border/50">
              <span className="text-muted-foreground">Database Connectivity</span>
              <span className="font-medium text-green-500 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Operational
              </span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-border/50">
              <span className="text-muted-foreground">External Node Sync</span>
              <span className="font-medium text-green-500">Operational</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-border/50">
              <span className="text-muted-foreground">API Rate Limiting</span>
              <span className="font-medium text-amber-500">Throttling active</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Button variant="outline" className="w-full">Run System Diagnostics</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
