import { AccessRequest } from './AccessRequest';
import { AccessGrant } from './AccessGrant';
import { PaginationOptions, PaginatedResult } from '../common';
import { AccessStatus } from './AccessStatus';

export interface ListAccessRequestOptions extends PaginationOptions {
  status?: AccessStatus;
  providerId?: string;
  patientId?: string;
}

export interface ListAccessGrantOptions extends PaginationOptions {
  status?: AccessStatus;
  providerId?: string;
  patientId?: string;
}

export interface IAccessRequestRepository {
  save(request: AccessRequest): Promise<void>;
  findById(id: string): Promise<AccessRequest | null>;
  listByProviderId(providerId: string): Promise<AccessRequest[]>;
  findMany(options: ListAccessRequestOptions): Promise<PaginatedResult<AccessRequest>>;
}

export interface IAccessGrantRepository {
  save(grant: AccessGrant): Promise<void>;
  findById(id: string): Promise<AccessGrant | null>;
  findActiveGrant(patientId: string, providerId: string): Promise<AccessGrant | null>;
  listByProviderId(providerId: string): Promise<AccessGrant[]>;
  findMany(options: ListAccessGrantOptions): Promise<PaginatedResult<AccessGrant>>;
}
