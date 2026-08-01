import { IConsentRepository, Consent, ConsentNotFoundError, UnauthorizedConsentApprovalError } from '../../../domain/consent';

export interface RejectConsentRequest {
  consentId: string;
  patientId: string;
}

import { IDomainEventPublisher } from '../../../domain/events/IDomainEventPublisher';

export class RejectConsentUseCase {
  constructor(
    private readonly consentRepository: IConsentRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(req: RejectConsentRequest): Promise<Consent> {
    const consent = await this.consentRepository.findById(req.consentId);
    if (!consent) {
      throw new ConsentNotFoundError(req.consentId);
    }
    
    if (consent.patientId !== req.patientId) {
      throw new UnauthorizedConsentApprovalError(); // Reused for unauthorized action
    }

    consent.reject();
    await this.consentRepository.save(consent);

    await this.eventPublisher.publish({
      eventName: 'ConsentRejected',
      occurredOn: new Date(),
      actorId: consent.patientId,
      consentId: consent.id,
      patientId: consent.patientId,
      providerId: consent.providerId
    } as any);

    return consent;
  }
}
