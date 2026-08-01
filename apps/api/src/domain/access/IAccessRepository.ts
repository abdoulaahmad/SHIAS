import { AccessRequest } from './AccessRequest';
import { AccessGrant } from './AccessGrant';

export interface IAccessRequestRepository {
  save(request: AccessRequest): Promise<void>;
  findById(id: string): Promise<AccessRequest | null>;
  listByProviderId(providerId: string): Promise<AccessRequest[]>;
}

export interface IAccessGrantRepository {
  save(grant: AccessGrant): Promise<void>;
  findById(id: string): Promise<AccessGrant | null>;
  findActiveGrant(patientId: string, providerId: string): Promise<AccessGrant | null>;
  listByProviderId(providerId: string): Promise<AccessGrant[]>;
}
