import { Provider } from './Provider';
import { ProviderStaff } from './ProviderStaff';
import { PaginationOptions, PaginatedResult } from '../common';

export interface ListProvidersOptions extends PaginationOptions {
  includeDeleted?: boolean;
}

export interface IProviderRepository {
  findById(id: string): Promise<Provider | null>;
  findByNpi(npi: string): Promise<Provider | null>;
  findMany(options: ListProvidersOptions): Promise<PaginatedResult<Provider>>;
  save(provider: Provider): Promise<void>;
}

export interface IProviderStaffRepository {
  findByProviderId(providerId: string): Promise<ProviderStaff[]>;
  findByUserId(userId: string): Promise<ProviderStaff[]>;
  findByProviderAndUser(providerId: string, userId: string): Promise<ProviderStaff | null>;
  save(staff: ProviderStaff): Promise<void>;
  delete(providerId: string, userId: string): Promise<void>;
}
