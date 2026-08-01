import { IConsentRepository, Consent } from '../../../domain/consent';

export class ListPatientConsentsUseCase {
  constructor(private readonly consentRepository: IConsentRepository) {}

  async execute(patientId: string): Promise<Consent[]> {
    return this.consentRepository.findPatientConsents(patientId);
  }
}
