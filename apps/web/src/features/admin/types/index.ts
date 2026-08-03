export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserSummaryDto {
  id: string;
  name: string;
  email: string;
  role: string;
  healthId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderDto {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEventDto {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  action: string;
  resourceId: string;
  resourceType: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  category: "AUTH" | "CONSENT" | "ACCESS" | "SYSTEM" | "CLINICAL";
  details?: Record<string, any>;
  ipAddress?: string;
}

export interface AccessGrantDto {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  purpose: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface AccessRequestDto {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  purpose: string;
  status: string;
  createdAt: string;
}
