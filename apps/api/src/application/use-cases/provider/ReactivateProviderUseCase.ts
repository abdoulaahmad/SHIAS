import { IProviderRepository, ProviderNotFoundError } from '../../../domain/provider';

export class ReactivateProviderUseCase {
  constructor(private readonly providerRepository: IProviderRepository) {}

  async execute(id: string): Promise<void> {
    const provider = await this.providerRepository.findById(id);
    if (!provider) {
      throw new ProviderNotFoundError(id);
    }

    provider.reactivate();
    await this.providerRepository.save(provider);
  }
}
