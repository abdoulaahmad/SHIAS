import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { AuditEventSchema, SearchAuditEventsQuerySchema, PaginatedAuditEventsSchema } from './audit.schemas';
import { 
  searchAuditEventsUseCase, 
  getAuditEventUseCase, 
  getAuditEventsByActorUseCase, 
  getAuditEventsByResourceUseCase,
  tokenService
} from '../../../infrastructure/di/container';

export async function auditRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing or invalid authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = tokenService.verifyAccessToken(token);
      (request as any).user = payload;
    } catch (e) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  });

  fastify.get('/events', {
    schema: {
      querystring: SearchAuditEventsQuerySchema,
      response: {
        200: PaginatedAuditEventsSchema
      }
    }
  }, async (request, reply) => {
    const query = request.query as any;
    const filters = {
      ...query,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined
    };
    const result = await searchAuditEventsUseCase.execute(filters);
    return {
      items: result.items.map(e => ({
        id: e.id.value,
        correlationId: e.correlationId,
        category: e.category,
        severity: e.severity,
        outcome: e.outcome,
        action: e.action,
        actor: { id: e.actor.id },
        resource: { id: e.resource.id },
        metadata: { details: e.metadata.details },
        ipAddress: e.ipAddress,
        createdAt: e.createdAt.toISOString()
      })),
      page: result.page,
      pageSize: result.pageSize,
      total: result.total
    };
  });

  fastify.get('/events/:id', {
    schema: {
      params: Type.Object({ id: Type.String() }),
      response: {
        200: AuditEventSchema
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as any;
    const e = await getAuditEventUseCase.execute(id);
    return {
      id: e.id.value,
      correlationId: e.correlationId,
      category: e.category,
      severity: e.severity,
      outcome: e.outcome,
      action: e.action,
      actor: { id: e.actor.id },
      resource: { id: e.resource.id },
      metadata: { details: e.metadata.details },
      ipAddress: e.ipAddress,
      createdAt: e.createdAt.toISOString()
    };
  });

  fastify.get('/actors/:actorId', {
    schema: {
      params: Type.Object({ actorId: Type.String() }),
      response: {
        200: Type.Array(AuditEventSchema)
      }
    }
  }, async (request, reply) => {
    const { actorId } = request.params as any;
    const events = await getAuditEventsByActorUseCase.execute(actorId);
    return events.map(e => ({
      id: e.id.value,
      correlationId: e.correlationId,
      category: e.category,
      severity: e.severity,
      outcome: e.outcome,
      action: e.action,
      actor: { id: e.actor.id },
      resource: { id: e.resource.id },
      metadata: { details: e.metadata.details },
      ipAddress: e.ipAddress,
      createdAt: e.createdAt.toISOString()
    }));
  });

  fastify.get('/resources/:resourceId', {
    schema: {
      params: Type.Object({ resourceId: Type.String() }),
      response: {
        200: Type.Array(AuditEventSchema)
      }
    }
  }, async (request, reply) => {
    const { resourceId } = request.params as any;
    const events = await getAuditEventsByResourceUseCase.execute(resourceId);
    return events.map(e => ({
      id: e.id.value,
      correlationId: e.correlationId,
      category: e.category,
      severity: e.severity,
      outcome: e.outcome,
      action: e.action,
      actor: { id: e.actor.id },
      resource: { id: e.resource.id },
      metadata: { details: e.metadata.details },
      ipAddress: e.ipAddress,
      createdAt: e.createdAt.toISOString()
    }));
  });
}
