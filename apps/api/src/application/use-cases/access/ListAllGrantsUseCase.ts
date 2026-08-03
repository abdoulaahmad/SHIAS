import { IAccessGrantRepository, ListAccessGrantOptions } from '../../../domain/access';
import { IProviderRepository, IUserRepository } from '../../../domain/identity';
import { PaginatedResult } from '../../../domain/common';

export interface AccessGrantSummaryDto {
  id: string;
  providerId: string;
  providerName: string;
  patientId: string;
  patientHealthId: string | null;
  patientName: string;
  purpose: string;
  status: string;
  createdAt: string;
  expiresAt: string | null;
}

export class ListAllGrantsUseCase {
  constructor(
    private readonly accessGrantRepository: IAccessGrantRepository,
    private readonly providerRepository: IProviderRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(options: ListAccessGrantOptions): Promise<PaginatedResult<AccessGrantSummaryDto>> {
    const result = await this.accessGrantRepository.findMany(options);
    
    // Resolve related names
    const items = await Promise.all(
      result.items.map(async (grant) => {
        const [provider, patient] = await Promise.all([
          this.providerRepository.findById(grant.providerId),
          this.userRepository.findById(grant.patientId)
        ]);
        
        return {
          id: grant.id.value,
          providerId: grant.providerId,
          providerName: provider?.name || 'Unknown Provider',
          patientId: grant.patientId,
          patientName: patient?.name || 'Unknown Patient',
          patientHealthId: patient?.healthId || null,
          purpose: grant.purpose,
          status: grant.status,
          createdAt: grant.createdAt.toISOString(),
          expiresAt: grant.expiresAt?.toISOString() || null
        };
      })
    );

    return {
      items,
      page: result.page,
      pageSize: result.pageSize,
      total: result.total
    };
  }
}
