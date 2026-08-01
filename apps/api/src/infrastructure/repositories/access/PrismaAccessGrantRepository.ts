import { PrismaClient, AccessGrant as PrismaAccessGrant } from '@shias/database';
import { IAccessGrantRepository, AccessGrant, AccessGrantId, AccessStatus } from '../../../domain/access';
import { ConsentPurpose } from '../../../domain/consent';

export class PrismaAccessGrantRepository implements IAccessGrantRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(prismaGrant: PrismaAccessGrant): AccessGrant {
    return new AccessGrant({
      id: new AccessGrantId(prismaGrant.id),
      requestId: prismaGrant.requestId,
      patientId: prismaGrant.patientId,
      providerId: prismaGrant.providerId,
      consentId: prismaGrant.consentId,
      pointerIds: prismaGrant.pointerIds,
      purpose: prismaGrant.purpose as ConsentPurpose,
      status: prismaGrant.status as AccessStatus,
      expiresAt: prismaGrant.expiresAt,
      createdAt: prismaGrant.createdAt,
      revokedAt: prismaGrant.revokedAt
    });
  }

  async save(grant: AccessGrant): Promise<void> {
    const data = {
      requestId: grant.requestId,
      patientId: grant.patientId,
      providerId: grant.providerId,
      consentId: grant.consentId,
      pointerIds: grant.pointerIds,
      purpose: grant.purpose,
      status: grant.status,
      expiresAt: grant.expiresAt,
      createdAt: grant.createdAt,
      revokedAt: grant.revokedAt
    };

    await this.prisma.accessGrant.upsert({
      where: { id: grant.id.value },
      update: data,
      create: {
        id: grant.id.value,
        ...data
      }
    });
  }

  async findById(id: string): Promise<AccessGrant | null> {
    const grant = await this.prisma.accessGrant.findUnique({
      where: { id }
    });
    return grant ? this.toDomain(grant) : null;
  }

  async findActiveGrant(patientId: string, providerId: string): Promise<AccessGrant | null> {
    const grant = await this.prisma.accessGrant.findFirst({
      where: {
        patientId,
        providerId,
        status: 'ACTIVE' as any
      },
      orderBy: { createdAt: 'desc' }
    });
    return grant ? this.toDomain(grant) : null;
  }

  async listByProviderId(providerId: string): Promise<AccessGrant[]> {
    const grants = await this.prisma.accessGrant.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' }
    });
    return grants.map(g => this.toDomain(g));
  }
}
