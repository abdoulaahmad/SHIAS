import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { ListUsersSchema, GetUserSchema } from './user.schemas';
import { listUsersUseCase, getUserUseCase, tokenService } from '../../../infrastructure/di/container';

export const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

  server.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Missing or invalid authorization header');
      }
      const token = authHeader.split(' ')[1];
      const payload = tokenService.verifyAccessToken(token);
      if (!payload) throw new Error('Invalid token');
      
      if (payload.role !== 'ADMIN') {
        return reply.status(403).send({ error: 'Forbidden', message: 'Admin access required' });
      }
      
      (request as any).user = payload;
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized', message: err instanceof Error ? err.message : 'Invalid token' });
    }
  });

  server.get('/users', { schema: ListUsersSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as any;
    const users = await listUsersUseCase.execute({
      page: query.page,
      limit: query.limit,
      search: query.search,
      role: query.role,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder
    });
    return reply.status(200).send(users);
  });

  server.get('/users/:id', { schema: GetUserSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as { id: string };
      const user = await getUserUseCase.execute(params.id);
      return reply.status(200).send(user);
    } catch (error: any) {
      if (error.name === 'UserNotFoundError') {
        return reply.status(404).send({ error: 'Not Found', message: error.message });
      }
      throw error;
    }
  });
};
