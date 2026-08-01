import { IConsentRepository, Consent, ConsentNotFoundError } from '../../../domain/consent';

export class GetConsentUseCase {
  constructor(private readonly consentRepository: IConsentRepository) {}

  async execute(id: string): Promise<Consent> {
    const consent = await this.consentRepository.findById(id);
    if (!consent) {
      throw new ConsentNotFoundError(id);
    }
    return consent;
  }
}
