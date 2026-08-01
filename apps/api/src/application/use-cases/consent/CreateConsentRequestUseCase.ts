import { randomUUID } from 'crypto';
import { IConsentRepository, Consent, ConsentId, ConsentScope, ConsentDuration, ConsentStatus, ConsentPurpose } from '../../../domain/consent';
import { IProviderRepository } from '../../../domain/provider';

export interface CreateConsentRequestDto {
  patientId: string;
  providerId: string;
  purpose: ConsentPurpose;
  allowedTypes: string[];
  allRecords: boolean;
  expiresAt: Date | null;
}

export class CreateConsentRequestUseCase {
  constructor(
    private readonly consentRepository: IConsentRepository,
    private readonly providerRepository: IProviderRepository
  ) {}

  async execute(req: CreateConsentRequestDto): Promise<Consent> {
    const provider = await this.providerRepository.findById(req.providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const consent = new Consent({
      id: new ConsentId(randomUUID()),
      patientId: req.patientId,
      providerId: req.providerId,
      status: ConsentStatus.PENDING,
      scope: new ConsentScope(req.allowedTypes, req.allRecords),
      purpose: req.purpose,
      duration: new ConsentDuration(new Date(), req.expiresAt),
      createdAt: new Date(),
      updatedAt: new Date(),
      revokedAt: null,
      archivedAt: null
    });

    await this.consentRepository.save(consent);
    return consent;
  }
}
