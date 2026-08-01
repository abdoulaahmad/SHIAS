import { PrismaClient, Consent as PrismaConsent } from '@shias/database';
import { IConsentRepository, Consent, ConsentId, ConsentScope, ConsentDuration, ConsentStatus, ConsentPurpose } from '../../../domain/consent';

export class PrismaConsentRepository implements IConsentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(prismaConsent: PrismaConsent): Consent {
    const scopeData = prismaConsent.scope as { allowedTypes?: string[], allRecords?: boolean } | null;
    const allowedTypes = scopeData?.allowedTypes || [];
    const allRecords = scopeData?.allRecords || false;
    
    // Fallback startsAt to createdAt if null
    const startsAt = prismaConsent.startsAt || prismaConsent.createdAt;
    
    return new Consent({
      id: new ConsentId(prismaConsent.id),
      patientId: prismaConsent.patientId,
      providerId: prismaConsent.providerId,
      status: prismaConsent.status as ConsentStatus,
      scope: new ConsentScope(allowedTypes, allRecords),
      purpose: prismaConsent.purpose as ConsentPurpose,
      duration: new ConsentDuration(startsAt, prismaConsent.expiresAt),
      createdAt: prismaConsent.createdAt,
      updatedAt: prismaConsent.updatedAt,
      revokedAt: prismaConsent.revokedAt,
      archivedAt: prismaConsent.archivedAt
    });
  }

  async save(consent: Consent): Promise<void> {
    const scopeJson = consent.scope.toJSON();
    const data = {
      patientId: consent.patientId,
      providerId: consent.providerId,
      status: consent.status,
      scope: scopeJson,
      purpose: consent.purpose,
      startsAt: consent.duration.startsAt,
      expiresAt: consent.duration.expiresAt,
      createdAt: consent.createdAt,
      updatedAt: consent.updatedAt,
      revokedAt: consent.revokedAt,
      archivedAt: consent.archivedAt
    };

    await this.prisma.consent.upsert({
      where: { id: consent.id.value },
      update: data,
      create: {
        id: consent.id.value,
        ...data
      }
    });
  }

  async findById(id: string): Promise<Consent | null> {
    const consent = await this.prisma.consent.findUnique({
      where: { id, deletedAt: null }
    });
    return consent ? this.toDomain(consent) : null;
  }

  async findActiveConsent(patientId: string, providerId: string): Promise<Consent | null> {
    const consent = await this.prisma.consent.findFirst({
      where: {
        patientId,
        providerId,
        status: 'ACTIVE' as any,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
    return consent ? this.toDomain(consent) : null;
  }

  async findPatientConsents(patientId: string): Promise<Consent[]> {
    const consents = await this.prisma.consent.findMany({
      where: { patientId, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
    return consents.map(this.toDomain.bind(this));
  }

  async findProviderConsents(providerId: string): Promise<Consent[]> {
    const consents = await this.prisma.consent.findMany({
      where: { providerId, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
    return consents.map(this.toDomain.bind(this));
  }
}
