import { PrismaClient, ProviderStatus as PrismaProviderStatus } from '@shias/database';
import { Provider, ProviderStatus, ProviderType, IProviderRepository } from '../../../domain/provider';

export class PrismaProviderRepository implements IProviderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(record: Record<string, unknown>): Provider {
    return new Provider(
      record.id as string,
      record.npi as string,
      record.name as string,
      new ProviderType(record.type as string),
      (record.status as string) === 'ACTIVE' ? ProviderStatus.ACTIVE : ProviderStatus.SUSPENDED,
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

  async findMany(options: any): Promise<any> {
    const { page = 1, limit = 20, search, includeDeleted = false, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (!includeDeleted) {
      where.deletedAt = null;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { npi: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, records] = await Promise.all([
      this.prisma.provider.count({ where }),
      this.prisma.provider.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      })
    ]);

    return {
      items: records.map(r => this.mapToDomain(r)),
      page,
      pageSize: limit,
      total
    };
  }

  async save(provider: Provider): Promise<void> {
    const data = {
      npi: provider.npi,
      name: provider.name,
      type: provider.type.value,
      status: provider.status === ProviderStatus.ACTIVE ? PrismaProviderStatus.ACTIVE : PrismaProviderStatus.SUSPENDED,
      updatedAt: provider.updatedAt,
      deletedAt: provider.deletedAt
    };

    await this.prisma.provider.upsert({
      where: { id: provider.id },
      create: {
        id: provider.id,
        createdAt: provider.createdAt,
        ...data
      },
      update: data
    });
  }
}
