import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { 
  CreateConsentRequestSchema, 
  GetConsentSchema, 
  ListConsentsSchema,
  ActionConsentSchema 
} from './consent.schemas';
import { Consent } from '../../../domain/consent';
import { 
  createConsentRequestUseCase,
  approveConsentUseCase,
  rejectConsentUseCase,
  revokeConsentUseCase,
  getConsentUseCase,
  listPatientConsentsUseCase,
  listProviderConsentsUseCase,
  tokenService
} from '../../../infrastructure/di/container';

function mapConsent(consent: Consent) {
  return {
    id: consent.id.value,
    patientId: consent.patientId,
    providerId: consent.providerId,
    status: consent.status,
    scope: consent.scope.toJSON(),
    purpose: consent.purpose,
    startsAt: consent.duration.startsAt.toISOString(),
    expiresAt: consent.duration.expiresAt?.toISOString() ?? null,
    createdAt: consent.createdAt.toISOString(),
    updatedAt: consent.updatedAt.toISOString(),
    revokedAt: consent.revokedAt?.toISOString() ?? null,
    archivedAt: consent.archivedAt?.toISOString() ?? null
  };
}

export const consentRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
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

  server.post('/consents', { schema: CreateConsentRequestSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as any;
    // We assume any authenticated user (provider or patient) can create a consent request.
    const consent = await createConsentRequestUseCase.execute({
      patientId: body.patientId,
      providerId: body.providerId,
      purpose: body.purpose,
      allowedTypes: body.allowedTypes,
      allRecords: body.allRecords,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
    });
    return reply.status(201).send(mapConsent(consent));
  });

  server.get('/consents/:id', { schema: GetConsentSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const consent = await getConsentUseCase.execute(params.id);
    return reply.status(200).send(mapConsent(consent));
  });

  server.post('/consents/:id/approve', { schema: ActionConsentSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const user = (request as any).user;
    
    // In a real system, verify that user.sub matches the patientId
    const consent = await approveConsentUseCase.execute({
      consentId: params.id,
      patientId: user.sub // the patient who is logged in
    });
    return reply.status(200).send(mapConsent(consent));
  });

  server.post('/consents/:id/reject', { schema: ActionConsentSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const user = (request as any).user;
    
    const consent = await rejectConsentUseCase.execute({
      consentId: params.id,
      patientId: user.sub
    });
    return reply.status(200).send(mapConsent(consent));
  });

  server.post('/consents/:id/revoke', { schema: ActionConsentSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const user = (request as any).user;
    
    const consent = await revokeConsentUseCase.execute({
      consentId: params.id,
      patientId: user.sub
    });
    return reply.status(200).send(mapConsent(consent));
  });

  server.get('/patients/:patientId/consents', { schema: ListConsentsSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { patientId: string };
    const consents = await listPatientConsentsUseCase.execute(params.patientId);
    return reply.status(200).send(consents.map(mapConsent));
  });

  server.get('/providers/:providerId/consents', { schema: ListConsentsSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { providerId: string };
    const consents = await listProviderConsentsUseCase.execute(params.providerId);
    return reply.status(200).send(consents.map(mapConsent));
  });
};
