import { Type } from '@sinclair/typebox';

export const UserSummarySchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  role: Type.String(),
  healthId: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String({ format: 'date-time' })
});

export const ListUsersQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  search: Type.Optional(Type.String()),
  role: Type.Optional(Type.String()),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')]))
});

export const PaginatedUsersSchema = Type.Object({
  items: Type.Array(UserSummarySchema),
  page: Type.Number(),
  pageSize: Type.Number(),
  total: Type.Number()
});

export const GetUserSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    200: UserSummarySchema,
    404: Type.Object({
      error: Type.String(),
      message: Type.String()
    })
  }
};

export const ListUsersSchema = {
  querystring: ListUsersQuerySchema,
  response: {
    200: PaginatedUsersSchema
  }
};
