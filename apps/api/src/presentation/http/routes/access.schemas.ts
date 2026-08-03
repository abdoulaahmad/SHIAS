import { Type } from '@sinclair/typebox';
import { AccessStatus } from '../../../domain/access';
import { ConsentPurpose } from '../../../domain/consent';

export const AccessGrantSchema = Type.Object({
  id: Type.String(),
  requestId: Type.String(),
  patientId: Type.String(),
  providerId: Type.String(),
  consentId: Type.String(),
  pointerIds: Type.Array(Type.String()),
  purpose: Type.Enum(ConsentPurpose),
  status: Type.Enum(AccessStatus),
  expiresAt: Type.String({ format: 'date-time' }),
  createdAt: Type.String({ format: 'date-time' }),
  revokedAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()])
});

export const RequestAccessSchema = {
  body: Type.Object({
    patientId: Type.String(),
    providerId: Type.String(),
    purpose: Type.Enum(ConsentPurpose),
    pointerIds: Type.Array(Type.String(), { minItems: 1 })
  }),
  response: {
    201: Type.Object({
      grantId: Type.Optional(Type.String()),
      token: Type.Optional(Type.String()),
      status: Type.String(),
      reason: Type.Optional(Type.String())
    }),
    403: Type.Object({
      status: Type.String(),
      reason: Type.Optional(Type.String())
    })
  }
};

export const GetAccessGrantSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    200: AccessGrantSchema
  }
};

export const ListProviderGrantsSchema = {
  params: Type.Object({
    providerId: Type.String()
  }),
  response: {
    200: Type.Array(AccessGrantSchema)
  }
};

export const ListProviderAccessRequestsSchema = {
  params: Type.Object({
    providerId: Type.String()
  }),
  response: {
    200: Type.Array(Type.Object({
      id: Type.String(),
      patientId: Type.String(),
      providerId: Type.String(),
      purpose: Type.Enum(ConsentPurpose),
      pointerIds: Type.Array(Type.String()),
      createdAt: Type.String({ format: 'date-time' })
    }))
  }
};

export const RevokeAccessGrantSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    200: AccessGrantSchema
  }
};

export const ValidateTokenSchema = {
  body: Type.Object({
    token: Type.String()
  }),
  response: {
    200: Type.Object({
      valid: Type.Boolean(),
      reason: Type.Optional(Type.String()),
      grantId: Type.Optional(Type.String())
    })
  }
};

export const AccessGrantSummarySchema = Type.Object({
  id: Type.String(),
  providerId: Type.String(),
  providerName: Type.String(),
  patientId: Type.String(),
  patientHealthId: Type.Union([Type.String(), Type.Null()]),
  patientName: Type.String(),
  purpose: Type.String(),
  status: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  expiresAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()])
});

export const AccessRequestSummarySchema = Type.Object({
  id: Type.String(),
  providerId: Type.String(),
  providerName: Type.String(),
  patientId: Type.String(),
  patientHealthId: Type.Union([Type.String(), Type.Null()]),
  patientName: Type.String(),
  purpose: Type.String(),
  createdAt: Type.String({ format: 'date-time' })
});

export const ListAccessGrantsQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  status: Type.Optional(Type.Enum(AccessStatus)),
  providerId: Type.Optional(Type.String()),
  patientId: Type.Optional(Type.String()),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')]))
});

export const ListAccessRequestsQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  providerId: Type.Optional(Type.String()),
  patientId: Type.Optional(Type.String()),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')]))
});

export const PaginatedAccessGrantsSchema = Type.Object({
  items: Type.Array(AccessGrantSummarySchema),
  page: Type.Number(),
  pageSize: Type.Number(),
  total: Type.Number()
});

export const PaginatedAccessRequestsSchema = Type.Object({
  items: Type.Array(AccessRequestSummarySchema),
  page: Type.Number(),
  pageSize: Type.Number(),
  total: Type.Number()
});

export const ListAllAccessGrantsSchema = {
  querystring: ListAccessGrantsQuerySchema,
  response: {
    200: PaginatedAccessGrantsSchema
  }
};

export const ListAllAccessRequestsSchema = {
  querystring: ListAccessRequestsQuerySchema,
  response: {
    200: PaginatedAccessRequestsSchema
  }
};
