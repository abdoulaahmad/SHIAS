import { randomUUID } from 'crypto';
import { 
  IAccessRequestRepository, 
  IAccessGrantRepository, 
  IAccessTokenService,
  AccessRequest,
  AccessGrant,
  AccessGrantId,
  AccessStatus,
  AccessToken,
  AccessRequestedEvent,
  AccessGrantedEvent,
  AccessDeniedEvent
} from '../../../domain/access';
import { ConsentPurpose } from '../../../domain/consent';
import { IDomainEventPublisher } from '../../../domain/events/IDomainEventPublisher';
import { GetPointerUseCase } from '../pointer';
import { GetProviderUseCase } from '../provider';
import { EvaluateConsentUseCase } from '../consent';

export interface RequestAccessDto {
  patientId: string;
  providerId: string;
  purpose: ConsentPurpose;
  pointerIds: string[];
}

export interface RequestAccessResult {
  grantId?: string;
  token?: string;
  status: string;
  reason?: string;
}

export class RequestAccessUseCase {
  constructor(
    private readonly accessReqRepo: IAccessRequestRepository,
    private readonly accessGrantRepo: IAccessGrantRepository,
    private readonly tokenService: IAccessTokenService,
    private readonly eventPublisher: IDomainEventPublisher,
    private readonly getPointerUseCase: GetPointerUseCase,
    private readonly getProviderUseCase: GetProviderUseCase,
    private readonly evaluateConsentUseCase: EvaluateConsentUseCase
  ) {}

  async execute(req: RequestAccessDto): Promise<RequestAccessResult> {
    const requestId = randomUUID();
    
    // 1. Log Request
    const accessReq = new AccessRequest({
      id: requestId,
      patientId: req.patientId,
      providerId: req.providerId,
      purpose: req.purpose,
      pointerIds: req.pointerIds,
      createdAt: new Date()
    });
    await this.accessReqRepo.save(accessReq);
    
    await this.eventPublisher.publish(new AccessRequestedEvent(
      requestId, req.patientId, req.providerId, req.purpose
    ));

    try {
      // 2. Validate Provider
      const provider = await this.getProviderUseCase.execute(req.providerId);
      if (!provider) {
        throw new Error('Provider not found');
      }

      // 3. Locate Pointers and 4. Evaluate Consent for each
      let consentId = null;

      for (const pointerId of req.pointerIds) {
        const pointer = await this.getPointerUseCase.execute(pointerId);
        if (!pointer || pointer.patientId !== req.patientId) {
          throw new Error(`Pointer ${pointerId} not found or invalid`);
        }

        const decision = await this.evaluateConsentUseCase.execute({
          patientId: req.patientId,
          providerId: req.providerId,
          requestedPurpose: req.purpose,
          requestedRecordType: pointer.metadata.recordType
        });

        if (!decision.authorized) {
          throw new Error(`Consent denied: ${decision.reason}`);
        }
        
        consentId = decision.consentId;
      }

      // 5. Create AccessGrant
      const grantId = randomUUID();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes TTL

      const grant = new AccessGrant({
        id: new AccessGrantId(grantId),
        requestId: requestId,
        patientId: req.patientId,
        providerId: req.providerId,
        consentId: consentId || 'unknown',
        pointerIds: req.pointerIds,
        purpose: req.purpose,
        status: AccessStatus.ACTIVE,
        expiresAt: expiresAt,
        createdAt: new Date(),
        revokedAt: null
      });

      await this.accessGrantRepo.save(grant);

      // 6. Generate Token
      const token = await this.tokenService.generateToken(grant);

      await this.eventPublisher.publish(new AccessGrantedEvent(
        grantId, requestId, req.patientId, req.providerId
      ));

      return {
        grantId: grant.id.value,
        token: token.value,
        status: 'GRANTED'
      };

    } catch (err: any) {
      const reason = err.message || 'Unknown error';
      await this.eventPublisher.publish(new AccessDeniedEvent(
        req.patientId, req.providerId, reason
      ));
      
      return {
        status: 'DENIED',
        reason
      };
    }
  }
}
