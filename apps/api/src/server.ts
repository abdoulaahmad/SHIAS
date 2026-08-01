import Fastify from 'fastify';
import { prisma } from '@shias/database';
import crypto from 'crypto';
import { correlationContext } from './infrastructure/logging/CorrelationContext';
import { logger } from './infrastructure/di/container';
import { errorHandler } from './presentation/http/plugins/ErrorHandler';
import { authRoutes } from './presentation/http/routes/auth.routes';
import { providerRoutes } from './presentation/http/routes/provider.routes';
import { pointerRoutes } from './presentation/http/routes/pointer.routes';
import { consentRoutes } from './presentation/http/routes/consent.routes';
import { accessRoutes } from './presentation/http/routes/access.routes';
import { auditRoutes } from './presentation/http/routes/audit.routes';

import { patientRoutes } from './presentation/http/routes/patient.routes';

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
  }
});

server.addHook('onRequest', (request, reply, done) => {
  const correlationId = (request.headers['x-correlation-id'] as string) || crypto.randomUUID();
  request.id = correlationId;
  correlationContext.run({ correlationId }, done);
});

server.setErrorHandler(errorHandler);
server.register(authRoutes, { prefix: '/api/v1/auth' });
server.register(providerRoutes, { prefix: '/api/v1' });
server.register(pointerRoutes, { prefix: '/api/v1' });
server.register(consentRoutes, { prefix: '/api/v1/consents' });
server.register(accessRoutes, { prefix: '/api/v1' });
server.register(auditRoutes, { prefix: '/api/v1/audit' });
server.register(patientRoutes, { prefix: '/api/v1' });

server.get('/v1/health', async (request, reply) => {
  try {
    // Perform a simple query to ensure DB is connected
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  } catch (error) {
    server.log.error(error);
    reply.status(500).send({ status: 'error', database: 'disconnected' });
  }
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening on port 3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
