import { IAccessRequestRepository, ListAccessRequestOptions } from '../../../domain/access';
import { IProviderRepository, IUserRepository } from '../../../domain/identity';
import { PaginatedResult } from '../../../domain/common';

export interface AccessRequestSummaryDto {
  id: string;
  providerId: string;
  providerName: string;
  patientId: string;
  patientHealthId: string | null;
  patientName: string;
  purpose: string;
  createdAt: string;
}

export class ListAllAccessRequestsUseCase {
  constructor(
    private readonly accessRequestRepository: IAccessRequestRepository,
    private readonly providerRepository: IProviderRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(options: ListAccessRequestOptions): Promise<PaginatedResult<AccessRequestSummaryDto>> {
    const result = await this.accessRequestRepository.findMany(options);
    
    // Resolve related names
    const items = await Promise.all(
      result.items.map(async (request) => {
        const [provider, patient] = await Promise.all([
          this.providerRepository.findById(request.providerId),
          this.userRepository.findById(request.patientId)
        ]);
        
        return {
          id: request.id,
          providerId: request.providerId,
          providerName: provider?.name || 'Unknown Provider',
          patientId: request.patientId,
          patientName: patient?.name || 'Unknown Patient',
          patientHealthId: patient?.healthId || null,
          purpose: request.purpose,
          createdAt: request.createdAt.toISOString()
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
