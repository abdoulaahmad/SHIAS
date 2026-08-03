import { AuditEvent } from './AuditEvent';

import { PaginationOptions, PaginatedResult } from '../common';

export interface ListAuditEventsOptions extends PaginationOptions {
  category?: string;
  severity?: string;
  startDate?: Date;
  endDate?: Date;
  actorId?: string;
  resourceId?: string;
  correlationId?: string;
}

export interface IAuditRepository {
  append(event: AuditEvent): Promise<void>;
  findById(id: string): Promise<AuditEvent | null>;
  findByCorrelationId(correlationId: string): Promise<AuditEvent[]>;
  findByActor(actorId: string): Promise<AuditEvent[]>;
  findByResource(resourceId: string): Promise<AuditEvent[]>;
  findMany(options: ListAuditEventsOptions): Promise<PaginatedResult<AuditEvent>>;
}
