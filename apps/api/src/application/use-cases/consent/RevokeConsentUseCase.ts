import { IConsentRepository, Consent, ConsentNotFoundError, UnauthorizedConsentApprovalError } from '../../../domain/consent';

export interface RevokeConsentRequest {
  consentId: string;
  patientId: string;
}

import { IDomainEventPublisher } from '../../../domain/events/IDomainEventPublisher';

export class RevokeConsentUseCase {
  constructor(
    private readonly consentRepository: IConsentRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(req: RevokeConsentRequest): Promise<Consent> {
    const consent = await this.consentRepository.findById(req.consentId);
    if (!consent) {
      throw new ConsentNotFoundError(req.consentId);
    }
    
    if (consent.patientId !== req.patientId) {
      throw new UnauthorizedConsentApprovalError();
    }

    consent.revoke();
    await this.consentRepository.save(consent);

    await this.eventPublisher.publish({
      eventName: 'ConsentRevoked',
      occurredOn: new Date(),
      actorId: consent.patientId,
      consentId: consent.id,
      patientId: consent.patientId,
      providerId: consent.providerId
    } as any);

    return consent;
  }
}
