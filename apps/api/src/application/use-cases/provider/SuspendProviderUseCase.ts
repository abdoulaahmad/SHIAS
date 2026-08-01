import { IProviderRepository, ProviderNotFoundError } from '../../../domain/provider';

export class SuspendProviderUseCase {
  constructor(private readonly providerRepository: IProviderRepository) {}

  async execute(id: string): Promise<void> {
    const provider = await this.providerRepository.findById(id);
    if (!provider) {
      throw new ProviderNotFoundError(id);
    }

    provider.suspend();
    await this.providerRepository.save(provider);
  }
}
