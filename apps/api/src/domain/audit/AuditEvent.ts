import { AuditEventId, Actor, Resource, AuditMetadata } from './ValueObjects';
import { AuditCategory, AuditSeverity, AuditOutcome } from './Enums';

export interface AuditEventProps {
  id: AuditEventId;
  correlationId: string;
  category: AuditCategory;
  severity: AuditSeverity;
  outcome: AuditOutcome;
  action: string;
  actor: Actor;
  resource: Resource;
  metadata: AuditMetadata;
  ipAddress?: string;
  createdAt: Date;
}

export class AuditEvent {
  private constructor(private readonly props: AuditEventProps) {}

  static create(props: Omit<AuditEventProps, 'id' | 'createdAt'>, id?: AuditEventId, createdAt?: Date): AuditEvent {
    return new AuditEvent({
      ...props,
      id: id ?? AuditEventId.create(),
      createdAt: createdAt ?? new Date()
    });
  }

  get id(): AuditEventId { return this.props.id; }
  get correlationId(): string { return this.props.correlationId; }
  get category(): AuditCategory { return this.props.category; }
  get severity(): AuditSeverity { return this.props.severity; }
  get outcome(): AuditOutcome { return this.props.outcome; }
  get action(): string { return this.props.action; }
  get actor(): Actor { return this.props.actor; }
  get resource(): Resource { return this.props.resource; }
  get metadata(): AuditMetadata { return this.props.metadata; }
  get ipAddress(): string | undefined { return this.props.ipAddress; }
  get createdAt(): Date { return this.props.createdAt; }
}
