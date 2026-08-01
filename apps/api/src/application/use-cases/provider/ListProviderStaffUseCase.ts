import { ProviderStaff, IProviderStaffRepository, ProviderNotFoundError, IProviderRepository } from '../../../domain/provider';

export class ListProviderStaffUseCase {
  constructor(
    private readonly providerStaffRepository: IProviderStaffRepository,
    private readonly providerRepository: IProviderRepository
  ) {}

  async execute(providerId: string): Promise<ProviderStaff[]> {
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new ProviderNotFoundError(providerId);
    }
    return this.providerStaffRepository.findByProviderId(providerId);
  }
}
