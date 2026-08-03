import { Type } from '@sinclair/typebox';

export const ProviderSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  npi: Type.String(),
  name: Type.String(),
  type: Type.String(),
  status: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

export const ProviderStaffSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  providerId: Type.String({ format: 'uuid' }),
  userId: Type.String({ format: 'uuid' }),
  role: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

export const CreateProviderSchema = {
  body: Type.Object({
    npi: Type.String({ minLength: 10, maxLength: 10 }),
    name: Type.String({ minLength: 1 }),
    type: Type.String()
  }),
  response: {
    201: ProviderSchema
  }
};

export const UpdateProviderSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' })
  }),
  body: Type.Object({
    name: Type.Optional(Type.String({ minLength: 1 }))
  }),
  response: {
    200: ProviderSchema
  }
};

export const GetProviderSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' })
  }),
  response: {
    200: ProviderSchema
  }
};

export const ListProvidersQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  search: Type.Optional(Type.String()),
  includeDeleted: Type.Optional(Type.Boolean()),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')]))
});

export const PaginatedProvidersSchema = Type.Object({
  items: Type.Array(ProviderSchema),
  page: Type.Number(),
  pageSize: Type.Number(),
  total: Type.Number()
});

export const ListProvidersSchema = {
  querystring: ListProvidersQuerySchema,
  response: {
    200: PaginatedProvidersSchema
  }
};

export const AddProviderStaffSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' })
  }),
  body: Type.Object({
    userId: Type.String({ format: 'uuid' }),
    role: Type.String({ minLength: 1 })
  }),
  response: {
    201: ProviderStaffSchema
  }
};

export const RemoveProviderStaffSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' }),
    userId: Type.String({ format: 'uuid' })
  }),
  response: {
    204: Type.Null()
  }
};

export const ListProviderStaffSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' })
  }),
  response: {
    200: Type.Array(ProviderStaffSchema)
  }
};
