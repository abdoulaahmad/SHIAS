export type ConsentStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'REVOKED' | 'EXPIRED';

export interface ConsentScope {
  action: 'READ' | 'WRITE';
  resourceType: string;
}

export interface Consent {
  id: string;
  patientId: string;
  providerId: string;
  status: ConsentStatus;
  scope: ConsentScope[];
  purpose: string;
  startsAt: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  revokedAt: string | null;
  archivedAt: string | null;
}
