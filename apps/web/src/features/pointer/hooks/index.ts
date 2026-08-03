import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pointerApi } from "../api";
import { RegisterPointerDto, UpdatePointerDto } from "../types";

export const pointerKeys = {
  all: ["pointers"] as const,
  lists: () => [...pointerKeys.all, "list"] as const,
  list: (providerId: string) => [...pointerKeys.lists(), providerId] as const,
};

export const useProviderPointers = (providerId: string | undefined) => {
  return useQuery({
    queryKey: pointerKeys.list(providerId!),
    queryFn: () => pointerApi.getProviderPointers(providerId!),
    enabled: !!providerId,
  });
};

export const usePatientPointers = (patientId: string | undefined) => {
  return useQuery({
    queryKey: pointerKeys.list(patientId!),
    queryFn: () => pointerApi.getPatientPointers(patientId!),
    enabled: !!patientId,
  });
};

export const useRegisterPointerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterPointerDto) => pointerApi.registerPointer(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: pointerKeys.list(variables.providerId) });
    },
  });
};

export const useUpdatePointerMutation = (providerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pointerId, data }: { pointerId: string; data: UpdatePointerDto }) => 
      pointerApi.updatePointerStatus(pointerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pointerKeys.list(providerId) });
    },
  });
};

export const useArchivePointerMutation = (providerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pointerId: string) => pointerApi.archivePointer(pointerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pointerKeys.list(providerId) });
    },
  });
};

export const usePatientSearch = (query: string) => {
  return useQuery({
    queryKey: ["patients", "search", query],
    queryFn: () => pointerApi.searchPatients(query),
    enabled: query.length >= 2,
  });
};
