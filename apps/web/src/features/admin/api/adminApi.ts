import { api } from "@/services/api";
import { 
  PaginatedResult, 
  UserSummaryDto, 
  ProviderDto, 
  AuditEventDto, 
  AccessGrantDto, 
  AccessRequestDto 
} from "../types";

export const adminApi = {
  getUsers: async (params?: Record<string, any>) => {
    return api.get<any, { data: PaginatedResult<UserSummaryDto> }>("/users", { params });
  },
  getUser: async (id: string) => {
    return api.get<any, { data: UserSummaryDto }>(`/users/${id}`);
  },
  getProviders: async (params?: Record<string, any>) => {
    return api.get<any, { data: PaginatedResult<ProviderDto> }>("/providers", { params });
  },
  getProvider: async (id: string) => {
    return api.get<any, { data: ProviderDto }>(`/providers/${id}`);
  },
  getAuditEvents: async (params?: Record<string, any>) => {
    return api.get<any, { data: PaginatedResult<AuditEventDto> }>("/audit/events", { params });
  },
  getAuditEvent: async (id: string) => {
    return api.get<any, { data: AuditEventDto }>(`/audit/events/${id}`);
  },
  getAccessGrants: async (params?: Record<string, any>) => {
    return api.get<any, { data: PaginatedResult<AccessGrantDto> }>("/access/grants", { params });
  },
  getAccessRequests: async (params?: Record<string, any>) => {
    return api.get<any, { data: PaginatedResult<AccessRequestDto> }>("/access/requests", { params });
  },
  getDashboardMetrics: async () => {
    const [users, providers, grants, requests] = await Promise.all([
      api.get<any, { data: PaginatedResult<UserSummaryDto> }>("/users", { params: { limit: 1 } }),
      api.get<any, { data: PaginatedResult<ProviderDto> }>("/providers", { params: { limit: 1 } }),
      api.get<any, { data: PaginatedResult<AccessGrantDto> }>("/access/grants", { params: { status: "ACTIVE", limit: 1 } }),
      api.get<any, { data: PaginatedResult<AccessRequestDto> }>("/access/requests", { params: { status: "PENDING", limit: 1 } }),
    ]);

    return {
      totalUsers: users.data.total,
      totalProviders: providers.data.total,
      activeGrants: grants.data.total,
      pendingRequests: requests.data.total,
    };
  }
};
