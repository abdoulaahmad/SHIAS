import { Provider, IProviderRepository } from '../../../domain/provider';
import { DuplicateNpiError } from '../../../domain/identity';

export interface CreateProviderRequest {
  id?: string;
  npi: string;
  name: string;
  type: string;
}

export class CreateProviderUseCase {
  constructor(private readonly providerRepository: IProviderRepository) {}

  async execute(req: CreateProviderRequest): Promise<Provider> {
    const existing = await this.providerRepository.findByNpi(req.npi);
    if (existing) {
      throw new DuplicateNpiError(req.npi);
    }
    
    // In production we'd use a crypto random UUID generator for default ID
    // but we can expect the controller to pass one if needed, or rely on UUIDv4
    const providerId = req.id || crypto.randomUUID();
    
    const provider = Provider.create({
      id: providerId,
      npi: req.npi,
      name: req.name,
      type: req.type
    });

    await this.providerRepository.save(provider);
    return provider;
  }
}
