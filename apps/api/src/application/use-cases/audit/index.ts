import { IAuditRepository, ListAuditEventsOptions, AuditEvent } from '../../../domain/audit';
import { PaginatedResult } from '../../../domain/common';

export class SearchAuditEventsUseCase {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async execute(options: ListAuditEventsOptions): Promise<PaginatedResult<AuditEvent>> {
    return this.auditRepository.findMany(options);
  }
}

export class GetAuditEventUseCase {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async execute(id: string) {
    const event = await this.auditRepository.findById(id);
    if (!event) throw new Error('Audit event not found');
    return event;
  }
}

export class GetAuditEventsByActorUseCase {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async execute(actorId: string) {
    return this.auditRepository.findByActor(actorId);
  }
}

export class GetAuditEventsByResourceUseCase {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async execute(resourceId: string) {
    return this.auditRepository.findByResource(resourceId);
  }
}
