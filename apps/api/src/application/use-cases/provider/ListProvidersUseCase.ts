import { Provider, IProviderRepository } from '../../../domain/provider';

export class ListProvidersUseCase {
  constructor(private readonly providerRepository: IProviderRepository) {}

  async execute(skip: number = 0, take: number = 10, includeDeleted: boolean = false): Promise<Provider[]> {
    return this.providerRepository.findAll(skip, take, includeDeleted);
  }
}
