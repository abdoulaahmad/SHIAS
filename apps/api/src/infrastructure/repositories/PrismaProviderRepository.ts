import { PrismaClient } from '@shias/database';
import { Provider, IProviderRepository } from '../../domain/identity';

export class PrismaProviderRepository implements IProviderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(record: Record<string, unknown>): Provider {
    return new Provider(
      record.id as string,
      record.npi as string,
      record.name as string,
      record.type as string,
      record.createdAt as Date,
      record.updatedAt as Date,
      record.deletedAt as Date | null
    );
  }

  async findById(id: string): Promise<Provider | null> {
    const record = await this.prisma.provider.findUnique({ where: { id } });
    if (!record || record.deletedAt) return null;
    return this.mapToDomain(record);
  }

  async findByNpi(npi: string): Promise<Provider | null> {
    const record = await this.prisma.provider.findUnique({ where: { npi } });
    if (!record || record.deletedAt) return null;
    return this.mapToDomain(record);
  }

  async save(provider: Provider): Promise<void> {
    await this.prisma.provider.create({
      data: {
        id: provider.id,
        npi: provider.npi,
        name: provider.name,
        type: provider.type,
        createdAt: provider.createdAt,
        updatedAt: provider.updatedAt
      }
    });
  }

  async update(provider: Provider): Promise<void> {
    await this.prisma.provider.update({
      where: { id: provider.id },
      data: {
        npi: provider.npi,
        name: provider.name,
        type: provider.type,
        updatedAt: provider.updatedAt,
        deletedAt: provider.deletedAt
      }
    });
  }
}
