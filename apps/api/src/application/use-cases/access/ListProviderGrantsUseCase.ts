import { IAccessGrantRepository, AccessGrant } from '../../../domain/access';

export class ListProviderGrantsUseCase {
  constructor(private readonly accessGrantRepository: IAccessGrantRepository) {}

  async execute(providerId: string): Promise<AccessGrant[]> {
    return this.accessGrantRepository.listByProviderId(providerId);
  }
}
