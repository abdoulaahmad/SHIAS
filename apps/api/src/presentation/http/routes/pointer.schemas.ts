import { Type } from '@sinclair/typebox';

export const PointerResponseSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  patientId: Type.String(),
  providerId: Type.String(),
  status: Type.String(),
  metadata: Type.Object({
    externalSystemId: Type.String(),
    externalRecordId: Type.String(),
    externalUri: Type.String({ format: 'uri' }),
    recordType: Type.String(),
    recordCreatedAt: Type.String({ format: 'date-time' })
  }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  archivedAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()])
});

export const RegisterPointerSchema = {
  body: Type.Object({
    patientId: Type.String({ format: 'uuid' }),
    providerId: Type.String({ format: 'uuid' }),
    externalSystemId: Type.String(),
    externalRecordId: Type.String(),
    externalUri: Type.String({ format: 'uri', pattern: '^https://' }),
    recordType: Type.Enum({
      ENCOUNTER: 'ENCOUNTER',
      LAB_RESULT: 'LAB_RESULT',
      PRESCRIPTION: 'PRESCRIPTION',
      DOCUMENT: 'DOCUMENT'
    }),
    recordCreatedAt: Type.String({ format: 'date-time' })
  }),
  response: {
    201: PointerResponseSchema
  }
};

export const GetPointerSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' })
  }),
  response: {
    200: PointerResponseSchema
  }
};

export const UpdatePointerSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' })
  }),
  body: Type.Object({
    status: Type.Enum({
      REVOKED: 'REVOKED',
      ARCHIVED: 'ARCHIVED'
    })
  }),
  response: {
    200: PointerResponseSchema
  }
};

export const ArchivePointerSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' })
  }),
  response: {
    204: Type.Null()
  }
};

export const ListPatientPointersSchema = {
  params: Type.Object({
    patientId: Type.String({ format: 'uuid' })
  }),
  response: {
    200: Type.Array(PointerResponseSchema)
  }
};

export const ListProviderPointersSchema = {
  params: Type.Object({
    providerId: Type.String({ format: 'uuid' })
  }),
  response: {
    200: Type.Array(PointerResponseSchema)
  }
};
