import { PrismaClient, AccessRequest as PrismaAccessRequest } from '@shias/database';
import { IAccessRequestRepository, AccessRequest } from '../../../domain/access';
import { ConsentPurpose } from '../../../domain/consent';

export class PrismaAccessRequestRepository implements IAccessRequestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(prismaReq: PrismaAccessRequest): AccessRequest {
    return new AccessRequest({
      id: prismaReq.id,
      patientId: prismaReq.patientId,
      providerId: prismaReq.providerId,
      purpose: prismaReq.purpose as ConsentPurpose,
      pointerIds: prismaReq.pointerIds,
      createdAt: prismaReq.createdAt
    });
  }

  async save(request: AccessRequest): Promise<void> {
    const data = {
      patientId: request.patientId,
      providerId: request.providerId,
      purpose: request.purpose,
      pointerIds: request.pointerIds,
      createdAt: request.createdAt
    };

    await this.prisma.accessRequest.upsert({
      where: { id: request.id },
      update: data,
      create: {
        id: request.id,
        ...data
      }
    });
  }

  async findById(id: string): Promise<AccessRequest | null> {
    const request = await this.prisma.accessRequest.findUnique({
      where: { id }
    });
    return request ? this.toDomain(request) : null;
  }
}
