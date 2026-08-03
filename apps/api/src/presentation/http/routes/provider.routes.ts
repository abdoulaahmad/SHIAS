import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { 
  CreateProviderSchema, 
  UpdateProviderSchema, 
  GetProviderSchema, 
  ListProvidersSchema, 
  AddProviderStaffSchema,
  RemoveProviderStaffSchema,
  ListProviderStaffSchema
} from './provider.schemas';
import { Provider, ProviderStaff } from '../../../domain/provider';
import { 
  createProviderUseCase, 
  updateProviderUseCase, 
  getProviderUseCase, 
  listProvidersUseCase, 
  suspendProviderUseCase,
  addProviderStaffUseCase,
  removeProviderStaffUseCase,
  listProviderStaffUseCase,
  tokenService 
} from '../../../infrastructure/di/container';

function mapProvider(provider: Provider) {
  return {
    id: provider.id,
    npi: provider.npi,
    name: provider.name,
    type: provider.type.value,
    status: provider.status,
    createdAt: provider.createdAt.toISOString(),
    updatedAt: provider.updatedAt.toISOString(),
    deletedAt: provider.deletedAt?.toISOString() ?? null
  };
}

function mapProviderStaff(staff: ProviderStaff) {
  return {
    id: staff.id,
    providerId: staff.providerId,
    userId: staff.userId,
    role: staff.role,
    createdAt: staff.createdAt.toISOString(),
    updatedAt: staff.updatedAt.toISOString()
  };
}

export const providerRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

  // Extract auth checking logic to be used where necessary
  server.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Missing or invalid authorization header');
      }
      const token = authHeader.split(' ')[1];
      const payload = tokenService.verifyAccessToken(token);
      if (!payload) throw new Error('Invalid token');
      (request as any).user = payload;
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized', message: err instanceof Error ? err.message : 'Invalid token' });
    }
  });

  server.post('/providers', { schema: CreateProviderSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as any;
    const provider = await createProviderUseCase.execute({
      npi: body.npi,
      name: body.name,
      type: body.type
    });
    return reply.status(201).send(mapProvider(provider));
  });

  server.get('/providers', { schema: ListProvidersSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as any;
    const result = await listProvidersUseCase.execute({
      page: query.page,
      limit: query.limit,
      search: query.search,
      includeDeleted: query.includeDeleted,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder
    });
    return reply.status(200).send(result);
  });

  server.get('/providers/:id', { schema: GetProviderSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const provider = await getProviderUseCase.execute(params.id);
    return reply.status(200).send(mapProvider(provider));
  });

  server.patch('/providers/:id', { schema: UpdateProviderSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const body = request.body as any;
    await updateProviderUseCase.execute({
      id: params.id,
      name: body.name
    });
    const provider = await getProviderUseCase.execute(params.id);
    return reply.status(200).send(mapProvider(provider));
  });

  server.delete('/providers/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    await suspendProviderUseCase.execute(params.id);
    return reply.status(204).send();
  });

  server.post('/providers/:id/staff', { schema: AddProviderStaffSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const body = request.body as any;
    const staff = await addProviderStaffUseCase.execute({
      providerId: params.id,
      userId: body.userId,
      role: body.role
    });
    return reply.status(201).send(mapProviderStaff(staff));
  });

  server.delete('/providers/:id/staff/:userId', { schema: RemoveProviderStaffSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string, userId: string };
    await removeProviderStaffUseCase.execute({
      providerId: params.id,
      userId: params.userId
    });
    return reply.status(204).send();
  });

  server.get('/providers/:id/staff', { schema: ListProviderStaffSchema }, async (request: any, reply: any) => {
    const params = request.params;
    const staff = await listProviderStaffUseCase.execute(params.id);
    return reply.status(200).send(staff.map(mapProviderStaff));
  });
};
