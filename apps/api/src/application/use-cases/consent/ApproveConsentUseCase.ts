import { IConsentRepository, Consent, ConsentNotFoundError, UnauthorizedConsentApprovalError } from '../../../domain/consent';

export interface ApproveConsentRequest {
  consentId: string;
  patientId: string; // The patient who is approving
}

import { IDomainEventPublisher } from '../../../domain/events/IDomainEventPublisher';

export class ApproveConsentUseCase {
  constructor(
    private readonly consentRepository: IConsentRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(req: ApproveConsentRequest): Promise<Consent> {
    const consent = await this.consentRepository.findById(req.consentId);
    if (!consent) {
      throw new ConsentNotFoundError(req.consentId);
    }
    
    if (consent.patientId !== req.patientId) {
      throw new UnauthorizedConsentApprovalError();
    }

    consent.approve();
    await this.consentRepository.save(consent);

    await this.eventPublisher.publish({
      eventName: 'ConsentApproved',
      occurredOn: new Date(),
      actorId: consent.patientId,
      consentId: consent.id,
      patientId: consent.patientId,
      providerId: consent.providerId
    } as any);

    return consent;
  }
}
