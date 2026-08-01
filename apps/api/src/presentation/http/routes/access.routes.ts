import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { 
  RequestAccessSchema, 
  GetAccessGrantSchema, 
  RevokeAccessGrantSchema,
  ValidateTokenSchema,
  ListProviderGrantsSchema,
  ListProviderAccessRequestsSchema
} from './access.schemas';
import { AccessGrant, AccessRequest } from '../../../domain/access';
import { 
  requestAccessUseCase,
  getAccessGrantUseCase,
  revokeAccessGrantUseCase,
  validateTokenUseCase,
  listProviderGrantsUseCase,
  listProviderAccessRequestsUseCase,
  tokenService
} from '../../../infrastructure/di/container';

function mapAccessGrant(grant: AccessGrant) {
  return {
    id: grant.id.value,
    requestId: grant.requestId,
    patientId: grant.patientId,
    providerId: grant.providerId,
    consentId: grant.consentId,
    pointerIds: grant.pointerIds,
    purpose: grant.purpose,
    status: grant.status,
    expiresAt: grant.expiresAt.toISOString(),
    createdAt: grant.createdAt.toISOString(),
    revokedAt: grant.revokedAt?.toISOString() ?? null
  };
}

function mapAccessRequest(request: AccessRequest) {
  return {
    id: request.id,
    patientId: request.patientId,
    providerId: request.providerId,
    purpose: request.purpose,
    pointerIds: request.pointerIds,
    createdAt: request.createdAt.toISOString()
  };
}

export const accessRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
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

  server.post('/access/request', { schema: RequestAccessSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as any;
    const result = await requestAccessUseCase.execute({
      patientId: body.patientId,
      providerId: body.providerId,
      purpose: body.purpose,
      pointerIds: body.pointerIds
    });
    if (result.status === 'DENIED') {
      return reply.status(403).send(result);
    }
    return reply.status(201).send(result);
  });

  server.get('/access/grants/:id', { schema: GetAccessGrantSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const grant = await getAccessGrantUseCase.execute(params.id);
    return reply.status(200).send(mapAccessGrant(grant));
  });

  server.post('/access/grants/:id/revoke', { schema: RevokeAccessGrantSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const user = (request as any).user;
    
    const grant = await revokeAccessGrantUseCase.execute({
      grantId: params.id,
      patientId: user.sub // the patient who is logged in
    });
    return reply.status(200).send(mapAccessGrant(grant));
  });

  server.post('/access/validate', { schema: ValidateTokenSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as any;
    const result = await validateTokenUseCase.execute(body.token);
    return reply.status(200).send(result);
  });

  server.get('/providers/:providerId/grants', { schema: ListProviderGrantsSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { providerId: string };
    const grants = await listProviderGrantsUseCase.execute(params.providerId);
    return reply.status(200).send(grants.map(mapAccessGrant));
  });

  server.get('/providers/:providerId/access-requests', { schema: ListProviderAccessRequestsSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { providerId: string };
    const requests = await listProviderAccessRequestsUseCase.execute(params.providerId);
    return reply.status(200).send(requests.map(mapAccessRequest));
  });
};
