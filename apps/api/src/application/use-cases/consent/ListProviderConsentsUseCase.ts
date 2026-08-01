import { IConsentRepository, Consent } from '../../../domain/consent';

export class ListProviderConsentsUseCase {
  constructor(private readonly consentRepository: IConsentRepository) {}

  async execute(providerId: string): Promise<Consent[]> {
    return this.consentRepository.findProviderConsents(providerId);
  }
}
