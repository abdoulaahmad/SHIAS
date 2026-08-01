import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { registerPatientUseCase, registerProviderUseCase, authenticateUserUseCase, refreshSessionUseCase } from '../../../infrastructure/di/container';
import { randomUUID } from 'crypto';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static } from '@sinclair/typebox';
import { RegisterPatientSchema, RegisterProviderSchema, LoginSchema, RefreshSessionSchema } from './schemas';

export const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
  server.post('/register/patient', { schema: RegisterPatientSchema }, async (request, reply) => {
    const body = request.body as unknown as Static<typeof RegisterPatientSchema.body>;
    await registerPatientUseCase.execute({
      id: randomUUID(),
      healthId: body.healthId,
      name: body.name,
      email: body.email,
      password: body.password
    });
    return reply.status(201).send();
  });

  server.post('/register/provider', { schema: RegisterProviderSchema }, async (request, reply) => {
    const body = request.body as unknown as Static<typeof RegisterProviderSchema.body>;
    await registerProviderUseCase.execute({
      providerId: randomUUID(),
      userId: randomUUID(),
      npi: body.npi,
      providerName: body.providerName,
      type: body.type,
      userName: body.userName,
      email: body.email,
      password: body.password
    });
    return reply.status(201).send();
  });

  server.post('/login', { schema: LoginSchema }, async (request, reply) => {
    const body = request.body as unknown as Static<typeof LoginSchema.body>;
    const response = await authenticateUserUseCase.execute({
      email: body.email,
      password: body.password
    });
    return reply.status(200).send(response);
  });

  server.post('/refresh', { schema: RefreshSessionSchema }, async (request, reply) => {
    const body = request.body as unknown as Static<typeof RefreshSessionSchema.body>;
    const tokens = await refreshSessionUseCase.execute({
      refreshToken: body.refreshToken
    });
    return reply.status(200).send(tokens);
  });
};
