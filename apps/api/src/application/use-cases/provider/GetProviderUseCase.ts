import { Provider, IProviderRepository, ProviderNotFoundError } from '../../../domain/provider';

export class GetProviderUseCase {
  constructor(private readonly providerRepository: IProviderRepository) {}

  async execute(id: string): Promise<Provider> {
    const provider = await this.providerRepository.findById(id);
    if (!provider) {
      throw new ProviderNotFoundError(id);
    }
    return provider;
  }
}
