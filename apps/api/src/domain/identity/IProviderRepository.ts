import { Provider } from './Provider';

export interface IProviderRepository {
  findById(id: string): Promise<Provider | null>;
  findByNpi(npi: string): Promise<Provider | null>;
  save(provider: Provider): Promise<void>;
  update(provider: Provider): Promise<void>;
}
