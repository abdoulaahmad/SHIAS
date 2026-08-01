import { ConsentPurpose } from '../consent/types';

export type AccessStatus = 'PENDING' | 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'DENIED';

export interface AccessGrant {
  id: string;
  requestId: string;
  patientId: string;
  providerId: string;
  consentId: string;
  pointerIds: string[];
  purpose: ConsentPurpose;
  status: AccessStatus;
  expiresAt: string;
  createdAt: string;
  revokedAt: string | null;
}

export interface AccessRequest {
  id: string;
  patientId: string;
  providerId: string;
  purpose: ConsentPurpose;
  pointerIds: string[];
  createdAt: string;
}

export interface RequestAccessDto {
  patientId: string;
  providerId: string;
  purpose: ConsentPurpose;
  pointerIds: string[];
}

export interface RequestAccessResponse {
  grantId?: string;
  token?: string;
  status: string;
  reason?: string;
}

export interface ValidateAccessResponse {
  valid: boolean;
  reason?: string;
  grantId?: string;
}
