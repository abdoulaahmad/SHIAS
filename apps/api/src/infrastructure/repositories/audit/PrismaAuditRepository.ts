import { PrismaClient } from '@shias/database';
import { IAuditRepository, AuditEvent, AuditEventId, Actor, Resource, AuditMetadata, AuditCategory, AuditSeverity, AuditOutcome } from '../../../domain/audit';

export class PrismaAuditRepository implements IAuditRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(record: any): AuditEvent {
    return AuditEvent.create({
      correlationId: record.correlationId,
      category: record.category as AuditCategory,
      severity: record.severity as AuditSeverity,
      outcome: record.outcome as AuditOutcome,
      action: record.action,
      actor: new Actor(record.actorId),
      resource: new Resource(record.resource),
      metadata: new AuditMetadata(record.details as Record<string, any>),
      ipAddress: record.ipAddress || undefined,
    }, AuditEventId.from(record.id), record.createdAt);
  }

  async append(event: AuditEvent): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        id: event.id.value,
        correlationId: event.correlationId,
        category: event.category,
        severity: event.severity,
        outcome: event.outcome,
        action: event.action,
        actorId: event.actor.id,
        resource: event.resource.id,
        details: event.metadata.details,
        ipAddress: event.ipAddress,
        createdAt: event.createdAt
      }
    });
  }

  async findById(id: string): Promise<AuditEvent | null> {
    const record = await this.prisma.auditLog.findUnique({ where: { id } });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findByCorrelationId(correlationId: string): Promise<AuditEvent[]> {
    const records = await this.prisma.auditLog.findMany({
      where: { correlationId },
      orderBy: { createdAt: 'desc' }
    });
    return records.map(r => this.mapToDomain(r));
  }

  async findByActor(actorId: string): Promise<AuditEvent[]> {
    const records = await this.prisma.auditLog.findMany({
      where: { actorId },
      orderBy: { createdAt: 'desc' }
    });
    return records.map(r => this.mapToDomain(r));
  }

  async findByResource(resourceId: string): Promise<AuditEvent[]> {
    const records = await this.prisma.auditLog.findMany({
      where: { resource: resourceId },
      orderBy: { createdAt: 'desc' }
    });
    return records.map(r => this.mapToDomain(r));
  }

  async search(filters: { category?: string; severity?: string; startDate?: Date; endDate?: Date; actorId?: string; resourceId?: string; correlationId?: string; }): Promise<AuditEvent[]> {
    const where: any = {};
    if (filters.category) where.category = filters.category;
    if (filters.severity) where.severity = filters.severity;
    if (filters.actorId) where.actorId = filters.actorId;
    if (filters.resourceId) where.resource = filters.resourceId;
    if (filters.correlationId) where.correlationId = filters.correlationId;
    
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const records = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return records.map(r => this.mapToDomain(r));
  }
}
