import { Type } from '@sinclair/typebox';

export const AuditEventSchema = Type.Object({
  id: Type.String(),
  correlationId: Type.String(),
  category: Type.String(),
  severity: Type.String(),
  outcome: Type.String(),
  action: Type.String(),
  actor: Type.Object({ id: Type.String() }),
  resource: Type.Object({ id: Type.String() }),
  metadata: Type.Object({ details: Type.Record(Type.String(), Type.Any()) }),
  ipAddress: Type.Optional(Type.String()),
  createdAt: Type.String({ format: 'date-time' })
});

export const SearchAuditEventsQuerySchema = Type.Object({
  category: Type.Optional(Type.String()),
  severity: Type.Optional(Type.String()),
  startDate: Type.Optional(Type.String({ format: 'date-time' })),
  endDate: Type.Optional(Type.String({ format: 'date-time' })),
  actorId: Type.Optional(Type.String()),
  resourceId: Type.Optional(Type.String()),
  correlationId: Type.Optional(Type.String())
});
