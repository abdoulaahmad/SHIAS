import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { DomainError } from '../../../domain/identity';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof DomainError) {
    const status = getStatusForErrorCode(error.code);
    return reply.status(status).send({
      type: `https://api.shias.example.com/errors/${error.code.toLowerCase()}`,
      title: error.message,
      status,
      detail: error.message,
      instance: request.url
    });
  }

  // Handle validation errors from Fastify (e.g. schema validation)
  if (error.validation) {
    return reply.status(400).send({
      type: 'https://api.shias.example.com/errors/bad-request',
      title: 'Bad Request',
      status: 400,
      detail: error.message,
      instance: request.url
    });
  }

  console.error(error);

  return reply.status(500).send({
    type: 'https://api.shias.example.com/errors/internal-server-error',
    title: 'Internal Server Error',
    status: 500,
    detail: 'An unexpected error occurred.',
    instance: request.url
  });
}

function getStatusForErrorCode(code: string): number {
  switch (code) {
    case 'DUPLICATE_EMAIL':
    case 'DUPLICATE_HEALTH_ID':
    case 'DUPLICATE_NPI':
      return 409;
    case 'UNAUTHORIZED':
    case 'TOKEN_EXPIRED':
      return 401;
    case 'PROVIDER_NOT_FOUND':
    case 'USER_NOT_FOUND':
      return 404;
    default:
      return 400;
  }
}
