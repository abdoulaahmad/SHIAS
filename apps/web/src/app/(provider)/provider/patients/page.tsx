"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { usePatientSearch } from "@/features/pointer/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "@/lib/date-fns";

export default function ProviderPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: searchResults, isLoading, error } = usePatientSearch(debouncedQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
  };

  return (
    <AppShell allowedRoles={["PROVIDER"]}>
      <PageHeader 
        title="Patient Directory" 
        description="Search for patients across the HIE network to request access or register new clinical data."
      />

      <div className="mt-6 space-y-6">
        <div className="p-6 border rounded-lg bg-card shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by patient name, email, or Health ID (minimum 2 characters)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" disabled={searchQuery.length < 2 || isLoading}>
              {isLoading ? "Searching..." : "Search Network"}
            </Button>
          </form>
        </div>

        {debouncedQuery.length >= 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              Search Results for "{debouncedQuery}"
            </h3>
            
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">
                Failed to search patients. Please try again.
              </div>
            )}

            {!isLoading && searchResults?.length === 0 && (
              <div className="p-8 text-center border rounded-lg bg-muted/50 text-muted-foreground">
                No patients found matching your search criteria.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults?.map((patient) => (
                <div key={patient.id} className="p-5 border rounded-lg bg-card shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{patient.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{patient.email}</p>
                    <div className="mt-4 text-xs font-mono bg-muted p-2 rounded truncate">
                      ID: {patient.id}
                    </div>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" size="sm" className="w-full flex-1" asChild>
                      <Link href={`/provider/pointers/new?patientId=${patient.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Add Record
                      </Link>
                    </Button>
                    <Button size="sm" className="w-full flex-1" asChild>
                      <Link href={`/provider/access/new?patientId=${patient.id}`}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Request Access
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
