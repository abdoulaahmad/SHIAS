import { Type } from '@sinclair/typebox';
import { ConsentStatus, ConsentPurpose } from '../../../domain/consent';

export const ConsentSchema = Type.Object({
  id: Type.String(),
  patientId: Type.String(),
  providerId: Type.String(),
  status: Type.Enum(ConsentStatus),
  scope: Type.Object({
    allowedTypes: Type.Array(Type.String()),
    allRecords: Type.Boolean()
  }),
  purpose: Type.Enum(ConsentPurpose),
  startsAt: Type.String({ format: 'date-time' }),
  expiresAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  revokedAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
  archivedAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()])
});

export const CreateConsentRequestSchema = {
  body: Type.Object({
    patientId: Type.String(),
    providerId: Type.String(),
    purpose: Type.Enum(ConsentPurpose),
    allowedTypes: Type.Array(Type.String()),
    allRecords: Type.Boolean(),
    expiresAt: Type.Optional(Type.String({ format: 'date-time' }))
  }),
  response: {
    201: ConsentSchema
  }
};

export const GetConsentSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    200: ConsentSchema
  }
};

export const ListConsentsSchema = {
  response: {
    200: Type.Array(ConsentSchema)
  }
};

export const ActionConsentSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    200: ConsentSchema
  }
};
