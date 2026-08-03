import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";
import { adminKeys } from "../api/queryKeys";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminApi.getDashboardMetrics(),
  });
}

export function useUsers(filters?: Record<string, any>) {
  return useQuery({
    queryKey: adminKeys.users(filters),
    queryFn: () => adminApi.getUsers(filters).then(res => res.data),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => adminApi.getUser(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useProviders(filters?: Record<string, any>) {
  return useQuery({
    queryKey: adminKeys.providers(filters),
    queryFn: () => adminApi.getProviders(filters).then(res => res.data),
  });
}

export function useProvider(id: string) {
  return useQuery({
    queryKey: adminKeys.provider(id),
    queryFn: () => adminApi.getProvider(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useAuditEvents(filters?: Record<string, any>) {
  return useQuery({
    queryKey: adminKeys.audit(filters),
    queryFn: () => adminApi.getAuditEvents(filters).then(res => res.data),
  });
}

export function useAuditEvent(id: string) {
  return useQuery({
    queryKey: adminKeys.auditEvent(id),
    queryFn: () => adminApi.getAuditEvent(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useAccessGrants(filters?: Record<string, any>) {
  return useQuery({
    queryKey: adminKeys.accessGrants(filters),
    queryFn: () => adminApi.getAccessGrants(filters).then(res => res.data),
  });
}

export function useAccessRequests(filters?: Record<string, any>) {
  return useQuery({
    queryKey: adminKeys.accessRequests(filters),
    queryFn: () => adminApi.getAccessRequests(filters).then(res => res.data),
  });
}
