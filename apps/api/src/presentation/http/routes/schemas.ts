import { Type } from '@sinclair/typebox';

export const RegisterPatientSchema = {
  body: Type.Object({
    healthId: Type.String(),
    name: Type.String(),
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8 })
  })
};

export const RegisterProviderSchema = {
  body: Type.Object({
    npi: Type.String(),
    providerName: Type.String(),
    type: Type.String(),
    userName: Type.String(),
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8 })
  })
};

export const LoginSchema = {
  body: Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String()
  })
};

export const RefreshSessionSchema = {
  body: Type.Object({
    refreshToken: Type.String()
  })
};
