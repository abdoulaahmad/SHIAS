import { IProviderRepository, ProviderNotFoundError } from '../../../domain/provider';

export interface UpdateProviderRequest {
  id: string;
  name?: string;
}

export class UpdateProviderUseCase {
  constructor(private readonly providerRepository: IProviderRepository) {}

  async execute(req: UpdateProviderRequest): Promise<void> {
    const provider = await this.providerRepository.findById(req.id);
    if (!provider) {
      throw new ProviderNotFoundError(req.id);
    }

    if (req.name) {
      provider.name = req.name;
    }
    provider.updatedAt = new Date();

    await this.providerRepository.save(provider);
  }
}
