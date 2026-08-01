import { AuditEvent } from './AuditEvent';

export interface IAuditRepository {
  append(event: AuditEvent): Promise<void>;
  findById(id: string): Promise<AuditEvent | null>;
  findByCorrelationId(correlationId: string): Promise<AuditEvent[]>;
  findByActor(actorId: string): Promise<AuditEvent[]>;
  findByResource(resourceId: string): Promise<AuditEvent[]>;
  search(filters: {
    category?: string;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
    actorId?: string;
    resourceId?: string;
    correlationId?: string;
  }): Promise<AuditEvent[]>;
}
