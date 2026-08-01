import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { SearchPatientsSchema } from './patient.schemas';
import { searchPatientsUseCase, tokenService } from '../../../infrastructure/di/container';

export const patientRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

  // Extract auth checking logic
  server.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Missing or invalid authorization header');
      }
      const token = authHeader.split(' ')[1];
      const payload = tokenService.verifyAccessToken(token);
      if (!payload) throw new Error('Invalid token');
      (request as unknown as { user: unknown }).user = payload;
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized', message: err instanceof Error ? err.message : 'Invalid token' });
    }
  });

  server.get('/patients', { schema: SearchPatientsSchema }, async (request, reply) => {
    const query = request.query as { search: string };
    const patients = await searchPatientsUseCase.execute(query.search);
    return reply.status(200).send(
      patients.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email
      }))
    );
  });
};
