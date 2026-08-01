"use client";

import { useState } from "react";
import { usePatientSearch } from "../../hooks";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface PatientSearchComboboxProps {
  onSelect: (patientId: string) => void;
  selectedPatientId?: string;
}

export function PatientSearchCombobox({ onSelect, selectedPatientId }: PatientSearchComboboxProps) {
  const [query, setQuery] = useState("");
  const { data: patients, isLoading, error } = usePatientSearch(query);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patient by name or email..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9"
        />
        {isLoading && query.length >= 2 && (
          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          {error ? (
            <div className="p-4 text-sm text-destructive text-center">
              Failed to search patients. Backend endpoint /patients is missing.
            </div>
          ) : patients && patients.length > 0 ? (
            <ul className="max-h-60 overflow-auto p-1">
              {patients.map((patient) => (
                <li
                  key={patient.id}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    onSelect(patient.id);
                    setQuery(patient.name);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{patient.name}</span>
                    <span className="text-xs text-muted-foreground">{patient.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : !isLoading ? (
            <div className="p-4 text-sm text-center text-muted-foreground">
              No patients found.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
