import { Type } from '@sinclair/typebox';

export const SearchPatientsSchema = {
  querystring: Type.Object({
    search: Type.String({ minLength: 2 })
  }),
  response: {
    200: Type.Array(Type.Object({
      id: Type.String(),
      name: Type.String(),
      email: Type.String()
    }))
  }
};
