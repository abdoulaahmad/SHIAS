import { IAuditRepository } from '../../../domain/audit';

export class SearchAuditEventsUseCase {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async execute(filters: { category?: string; severity?: string; startDate?: Date; endDate?: Date; actorId?: string; resourceId?: string; correlationId?: string; }) {
    return this.auditRepository.search(filters);
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
