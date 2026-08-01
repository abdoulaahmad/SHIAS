import { IDomainEventPublisher } from '../../domain/events/IDomainEventPublisher';
import { IAuditRepository, AuditEvent, AuditCategory, AuditSeverity, AuditOutcome, Actor, Resource, AuditMetadata } from '../../domain/audit';
import { Logger } from '@shias/observability';

export class AuditEventSubscriber {
  constructor(
    private readonly eventPublisher: IDomainEventPublisher,
    private readonly auditRepository: IAuditRepository,
    private readonly logger: Logger
  ) {
    this.registerSubscribers();
  }

  private registerSubscribers() {
    this.eventPublisher.subscribe('AccessRequested', this.handleAccessRequested.bind(this));
    this.eventPublisher.subscribe('AccessGranted', this.handleAccessGranted.bind(this));
    this.eventPublisher.subscribe('AccessDenied', this.handleAccessDenied.bind(this));
    
    // We will add more event handlers here for other domains as they are wired up
    this.eventPublisher.subscribe('PatientRegistered', this.handleGenericEvent('PatientRegistered', AuditCategory.REGISTRATION, AuditSeverity.INFO));
    this.eventPublisher.subscribe('ProviderCreated', this.handleGenericEvent('ProviderCreated', AuditCategory.REGISTRATION, AuditSeverity.INFO));
    this.eventPublisher.subscribe('PointerRegistered', this.handleGenericEvent('PointerRegistered', AuditCategory.SYSTEM, AuditSeverity.INFO));
    this.eventPublisher.subscribe('ConsentApproved', this.handleGenericEvent('ConsentApproved', AuditCategory.CONSENT, AuditSeverity.INFO));
    this.eventPublisher.subscribe('ConsentRejected', this.handleGenericEvent('ConsentRejected', AuditCategory.CONSENT, AuditSeverity.INFO));
    this.eventPublisher.subscribe('ConsentRevoked', this.handleGenericEvent('ConsentRevoked', AuditCategory.CONSENT, AuditSeverity.WARNING));
  }

  private async handleAccessRequested(event: any, correlationId?: string) {
    await this.logEvent(correlationId || 'system', AuditCategory.ACCESS, AuditSeverity.INFO, 'AccessRequested', event.providerId, event.requestId, { pointerIds: event.pointerIds, purpose: event.purpose });
  }

  private async handleAccessGranted(event: any, correlationId?: string) {
    await this.logEvent(correlationId || 'system', AuditCategory.ACCESS, AuditSeverity.INFO, 'AccessGranted', event.providerId, event.grantId, { consentId: event.consentId });
  }

  private async handleAccessDenied(event: any, correlationId?: string) {
    await this.logEvent(correlationId || 'system', AuditCategory.ACCESS, AuditSeverity.WARNING, 'AccessDenied', event.providerId, event.requestId, { reason: event.reason });
  }

  private handleGenericEvent(action: string, category: AuditCategory, severity: AuditSeverity) {
    return async (event: any, correlationId?: string) => {
      const actorId = event.actorId || event.patientId || event.providerId || 'system';
      const resourceId = event.resourceId || event.id || event.pointerId || event.consentId || 'unknown';
      // filter out passwords/PHI
      const { password, ...safeMetadata } = event;
      await this.logEvent(correlationId || 'system', category, severity, action, actorId, resourceId, safeMetadata);
    };
  }

  private async logEvent(
    correlationId: string,
    category: AuditCategory,
    severity: AuditSeverity,
    action: string,
    actorId: string,
    resourceId: string,
    metadata: Record<string, any>
  ) {
    try {
      const auditEvent = AuditEvent.create({
        correlationId,
        category,
        severity,
        outcome: AuditOutcome.SUCCESS,
        action,
        actor: new Actor(actorId),
        resource: new Resource(resourceId),
        metadata: new AuditMetadata(metadata),
      });
      await this.auditRepository.append(auditEvent);
      this.logger.debug(`Audit event appended for ${action}`);
    } catch (error: any) {
      this.logger.error(`Failed to append audit event for ${action}`, { error: error.message });
      // Do not throw! Audit failure should not break business workflow
    }
  }
}
