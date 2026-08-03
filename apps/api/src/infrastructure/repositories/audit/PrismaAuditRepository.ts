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

  async findMany(options: any): Promise<any> {
    const { page = 1, limit = 20, category, severity, startDate, endDate, actorId, resourceId, correlationId, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) where.category = category;
    if (severity) where.severity = severity;
    if (actorId) where.actorId = actorId;
    if (resourceId) where.resource = resourceId;
    if (correlationId) where.correlationId = correlationId;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [total, records] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      })
    ]);

    return {
      items: records.map(r => this.mapToDomain(r)),
      page,
      pageSize: limit,
      total
    };
  }
}
