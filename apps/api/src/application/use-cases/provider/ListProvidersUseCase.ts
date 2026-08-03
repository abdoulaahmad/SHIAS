import { IProviderRepository, ListProvidersOptions } from '../../../domain/provider';
import { PaginatedResult } from '../../../domain/common';

export interface ProviderSummaryDto {
  id: string;
  npi: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
}

export class ListProvidersUseCase {
  constructor(private readonly providerRepository: IProviderRepository) {}

  async execute(options: ListProvidersOptions): Promise<PaginatedResult<ProviderSummaryDto>> {
    const result = await this.providerRepository.findMany(options);
    
    return {
      items: result.items.map(provider => ({
        id: provider.id,
        npi: provider.npi,
        name: provider.name,
        type: provider.type.value,
        status: provider.status,
        createdAt: provider.createdAt.toISOString()
      })),
      page: result.page,
      pageSize: result.pageSize,
      total: result.total
    };
  }
}
