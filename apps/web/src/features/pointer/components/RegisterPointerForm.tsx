"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PatientSearchCombobox } from "./PatientSearchCombobox";
import { useRegisterPointerMutation } from "../../hooks";
import { useAuthStore } from "@/features/auth/store";
import { ProblemAlert } from "@/components/shared/ProblemAlert";
import { useRouter } from "next/navigation";

const RegisterPointerSchema = z.object({
  patientId: z.string().uuid("Please select a patient"),
  externalSystemId: z.string().min(1, "System ID is required"),
  externalRecordId: z.string().min(1, "Record ID is required"),
  externalUri: z.string().url("Must be a valid URL starting with https://"),
  recordType: z.enum(["ENCOUNTER", "LAB_RESULT", "PRESCRIPTION", "DOCUMENT"]),
  recordCreatedAt: z.string().min(1, "Creation date is required"),
});

type FormData = z.infer<typeof RegisterPointerSchema>;

export function RegisterPointerForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const registerMutation = useRegisterPointerMutation();
  const [error, setError] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(RegisterPointerSchema),
    defaultValues: {
      recordType: "DOCUMENT",
      recordCreatedAt: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: FormData) => {
    if (!user) return;
    
    setError(null);
    registerMutation.mutate(
      {
        ...data,
        providerId: user.id,
        recordCreatedAt: new Date(data.recordCreatedAt).toISOString(),
      },
      {
        onSuccess: () => {
          router.push("/provider/pointers");
        },
        onError: (err) => {
          setError(err);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-card p-6 rounded-xl border shadow-sm">
      <ProblemAlert error={error} />

      <div className="space-y-2">
        <label className="text-sm font-medium">Patient</label>
        <PatientSearchCombobox 
          onSelect={(id) => setValue("patientId", id, { shouldValidate: true })}
        />
        {errors.patientId && <p className="text-sm text-destructive">{errors.patientId.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">External System ID</label>
          <Input placeholder="e.g. EPIC-123" {...register("externalSystemId")} />
          {errors.externalSystemId && <p className="text-sm text-destructive">{errors.externalSystemId.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">External Record ID</label>
          <Input placeholder="e.g. REC-9982" {...register("externalRecordId")} />
          {errors.externalRecordId && <p className="text-sm text-destructive">{errors.externalRecordId.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">External URI</label>
        <Input placeholder="https://api.hospital.com/records/9982" type="url" {...register("externalUri")} />
        {errors.externalUri && <p className="text-sm text-destructive">{errors.externalUri.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Record Type</label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...register("recordType")}
          >
            <option value="DOCUMENT">Document</option>
            <option value="ENCOUNTER">Encounter</option>
            <option value="LAB_RESULT">Lab Result</option>
            <option value="PRESCRIPTION">Prescription</option>
          </select>
          {errors.recordType && <p className="text-sm text-destructive">{errors.recordType.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Record Created At</label>
          <Input type="date" {...register("recordCreatedAt")} />
          {errors.recordCreatedAt && <p className="text-sm text-destructive">{errors.recordCreatedAt.message}</p>}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? "Registering..." : "Register Pointer"}
        </Button>
      </div>
    </form>
  );
}
