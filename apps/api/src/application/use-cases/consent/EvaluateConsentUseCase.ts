import { IConsentRepository, ConsentStatus, ConsentPurpose, ConsentDecision } from '../../../domain/consent';

export interface EvaluateConsentRequest {
  patientId: string;
  providerId: string;
  requestedPurpose: ConsentPurpose;
  requestedRecordType: string;
}

export class EvaluateConsentUseCase {
  constructor(private readonly consentRepository: IConsentRepository) {}

  async execute(req: EvaluateConsentRequest): Promise<ConsentDecision> {
    const consent = await this.consentRepository.findActiveConsent(req.patientId, req.providerId);
    
    if (!consent) {
      return ConsentDecision.denied('No active consent found for the given patient and provider');
    }

    if (consent.status !== ConsentStatus.APPROVED) {
      return ConsentDecision.denied(`Consent status is ${consent.status}, expected APPROVED`);
    }

    if (consent.duration.isExpired()) {
      return ConsentDecision.denied('Consent is expired');
    }

    if (consent.purpose !== req.requestedPurpose) {
      return ConsentDecision.denied(`Requested purpose ${req.requestedPurpose} does not match consent purpose ${consent.purpose}`);
    }

    if (!consent.scope.hasAccess(req.requestedRecordType)) {
      return ConsentDecision.denied(`Consent scope does not include record type ${req.requestedRecordType}`);
    }

    return ConsentDecision.authorized(consent.id.value);
  }
}
