import { IAccessRequestRepository, AccessRequest } from '../../../domain/access';

export class ListProviderAccessRequestsUseCase {
  constructor(private readonly accessRequestRepository: IAccessRequestRepository) {}

  async execute(providerId: string): Promise<AccessRequest[]> {
    return this.accessRequestRepository.listByProviderId(providerId);
  }
}
