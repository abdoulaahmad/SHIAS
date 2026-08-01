import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import {
  RegisterPointerSchema,
  GetPointerSchema,
  UpdatePointerSchema,
  ArchivePointerSchema,
  ListPatientPointersSchema,
  ListProviderPointersSchema
} from './pointer.schemas';
import { Pointer, RecordType, PointerStatus } from '../../../domain/pointer';
import {
  registerPointerUseCase,
  updatePointerUseCase,
  getPointerUseCase,
  listPatientPointersUseCase,
  listProviderPointersUseCase,
  archivePointerUseCase,
  tokenService
} from '../../../infrastructure/di/container';

function mapPointer(pointer: Pointer) {
  return {
    id: pointer.id,
    patientId: pointer.patientId,
    providerId: pointer.providerId,
    status: pointer.status,
    metadata: {
      externalSystemId: pointer.metadata.externalSystemId,
      externalRecordId: pointer.metadata.externalRecordId,
      externalUri: pointer.metadata.externalUri.value,
      recordType: pointer.metadata.recordType,
      recordCreatedAt: pointer.metadata.recordCreatedAt.toISOString()
    },
    createdAt: pointer.createdAt.toISOString(),
    updatedAt: pointer.updatedAt.toISOString(),
    archivedAt: pointer.archivedAt?.toISOString() ?? null
  };
}

export const pointerRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

  // Use tokenService for authentication
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

  server.post('/pointers', { schema: RegisterPointerSchema }, async (request, reply) => {
    const body = request.body as any;
    const pointer = await registerPointerUseCase.execute({
      patientId: body.patientId,
      providerId: body.providerId,
      externalSystemId: body.externalSystemId,
      externalRecordId: body.externalRecordId,
      externalUri: body.externalUri,
      recordType: body.recordType as RecordType,
      recordCreatedAt: new Date(body.recordCreatedAt)
    });
    return reply.status(201).send(mapPointer(pointer));
  });

  server.get('/pointers/:id', { schema: GetPointerSchema }, async (request, reply) => {
    const params = request.params as { id: string };
    const pointer = await getPointerUseCase.execute(params.id);
    return reply.status(200).send(mapPointer(pointer));
  });

  server.patch('/pointers/:id', { schema: UpdatePointerSchema }, async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as { status: string };
    const pointer = await updatePointerUseCase.execute({
      id: params.id,
      status: body.status as PointerStatus
    });
    return reply.status(200).send(mapPointer(pointer));
  });

  server.delete('/pointers/:id', { schema: ArchivePointerSchema }, async (request, reply) => {
    const params = request.params as { id: string };
    await archivePointerUseCase.execute(params.id);
    return reply.status(204).send();
  });

  server.get('/patients/:patientId/pointers', { schema: ListPatientPointersSchema }, async (request, reply) => {
    const params = request.params as { patientId: string };
    const pointers = await listPatientPointersUseCase.execute(params.patientId);
    return reply.status(200).send(pointers.map(mapPointer));
  });

  server.get('/providers/:providerId/pointers', { schema: ListProviderPointersSchema }, async (request, reply) => {
    const params = request.params as { providerId: string };
    const pointers = await listProviderPointersUseCase.execute(params.providerId);
    return reply.status(200).send(pointers.map(mapPointer));
  });
};
