export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  users: (filters?: Record<string, any>) => [...adminKeys.all, "users", filters] as const,
  user: (id: string) => [...adminKeys.all, "users", id] as const,
  providers: (filters?: Record<string, any>) => [...adminKeys.all, "providers", filters] as const,
  provider: (id: string) => [...adminKeys.all, "providers", id] as const,
  audit: (filters?: Record<string, any>) => [...adminKeys.all, "audit", filters] as const,
  auditEvent: (id: string) => [...adminKeys.all, "audit", id] as const,
  accessGrants: (filters?: Record<string, any>) => [...adminKeys.all, "access-grants", filters] as const,
  accessRequests: (filters?: Record<string, any>) => [...adminKeys.all, "access-requests", filters] as const,
};
