import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { consentApi } from "../api";

export const consentKeys = {
  all: ["consents"] as const,
  lists: () => [...consentKeys.all, "list"] as const,
  list: (patientId: string) => [...consentKeys.lists(), patientId] as const,
  details: () => [...consentKeys.all, "detail"] as const,
  detail: (id: string) => [...consentKeys.details(), id] as const,
};

export const usePatientConsents = (patientId: string | undefined) => {
  return useQuery({
    queryKey: consentKeys.list(patientId!),
    queryFn: () => consentApi.getPatientConsents(patientId!),
    enabled: !!patientId,
  });
};

export const useConsentDetails = (consentId: string) => {
  return useQuery({
    queryKey: consentKeys.detail(consentId),
    queryFn: () => consentApi.getConsent(consentId),
    enabled: !!consentId,
  });
};

export const useApproveConsent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (consentId: string) => consentApi.approveConsent(consentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: consentKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: consentKeys.lists() });
    },
  });
};

export const useRejectConsent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (consentId: string) => consentApi.rejectConsent(consentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: consentKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: consentKeys.lists() });
    },
  });
};

export const useRevokeConsent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (consentId: string) => consentApi.revokeConsent(consentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: consentKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: consentKeys.lists() });
    },
  });
};
