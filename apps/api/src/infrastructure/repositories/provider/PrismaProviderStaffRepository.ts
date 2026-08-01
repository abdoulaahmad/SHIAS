import { PrismaClient } from '@shias/database';
import { ProviderStaff, IProviderStaffRepository } from '../../../domain/provider';

export class PrismaProviderStaffRepository implements IProviderStaffRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(record: Record<string, unknown>): ProviderStaff {
    return new ProviderStaff(
      record.id as string,
      record.providerId as string,
      record.userId as string,
      record.role as string,
      record.createdAt as Date,
      record.updatedAt as Date
    );
  }

  async findByProviderId(providerId: string): Promise<ProviderStaff[]> {
    const records = await this.prisma.providerStaff.findMany({
      where: { providerId, deletedAt: null }
    });
    return records.map(r => this.mapToDomain(r));
  }

  async findByUserId(userId: string): Promise<ProviderStaff[]> {
    const records = await this.prisma.providerStaff.findMany({
      where: { userId, deletedAt: null }
    });
    return records.map(r => this.mapToDomain(r));
  }

  async findByProviderAndUser(providerId: string, userId: string): Promise<ProviderStaff | null> {
    const record = await this.prisma.providerStaff.findUnique({
      where: { providerId_userId: { providerId, userId } }
    });
    if (!record || record.deletedAt) return null;
    return this.mapToDomain(record);
  }

  async save(staff: ProviderStaff): Promise<void> {
    await this.prisma.providerStaff.upsert({
      where: { id: staff.id },
      create: {
        id: staff.id,
        providerId: staff.providerId,
        userId: staff.userId,
        role: staff.role,
        createdAt: staff.createdAt,
        updatedAt: staff.updatedAt
      },
      update: {
        role: staff.role,
        updatedAt: staff.updatedAt,
        deletedAt: null
      }
    });
  }

  async delete(providerId: string, userId: string): Promise<void> {
    await this.prisma.providerStaff.update({
      where: { providerId_userId: { providerId, userId } },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }
}
