import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accessApi } from '../api/accessApi';
import { accessKeys } from '../api/queryKeys';
import { RequestAccessDto } from '../types';

export function useProviderGrants(providerId: string) {
  return useQuery({
    queryKey: accessKeys.grants(providerId),
    queryFn: () => accessApi.listProviderGrants(providerId),
    enabled: !!providerId,
  });
}

export function useProviderAccessRequests(providerId: string) {
  return useQuery({
    queryKey: accessKeys.requests(providerId),
    queryFn: () => accessApi.listProviderAccessRequests(providerId),
    enabled: !!providerId,
  });
}

export function useAccessGrant(grantId: string) {
  return useQuery({
    queryKey: accessKeys.grantDetails(grantId),
    queryFn: () => accessApi.getAccessGrant(grantId),
    enabled: !!grantId,
  });
}

export function useRequestAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestAccessDto) => accessApi.requestAccess(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accessKeys.requests(variables.providerId) });
      queryClient.invalidateQueries({ queryKey: accessKeys.grants(variables.providerId) });
    },
  });
}

export function useRevokeAccessGrant(providerId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (grantId: string) => accessApi.revokeAccessGrant(grantId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: accessKeys.grantDetails(data.id) });
      if (providerId) {
        queryClient.invalidateQueries({ queryKey: accessKeys.grants(providerId) });
      }
    },
  });
}
