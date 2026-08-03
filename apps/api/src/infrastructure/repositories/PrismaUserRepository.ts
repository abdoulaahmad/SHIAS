import { PrismaClient } from '@shias/database';
import { User, Role, IUserRepository } from '../../domain/identity';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(record: Record<string, unknown>): User {
    return new User(
      record.id as string,
      record.healthId as string | null,
      record.name as string,
      record.email as string,
      record.password as string,
      record.role as Role,
      record.createdAt as Date,
      record.updatedAt as Date,
      record.deletedAt as Date | null
    );
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    if (!record || record.deletedAt) return null;
    return this.mapToDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    if (!record || record.deletedAt) return null;
    return this.mapToDomain(record);
  }

  async findByHealthId(healthId: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { healthId } });
    if (!record || record.deletedAt) return null;
    return this.mapToDomain(record);
  }

  async searchPatients(query: string): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      where: {
        role: 'PATIENT' as any,
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 20
    });
    return records.map(r => this.mapToDomain(r));
  }

  async findMany(options: any): Promise<any> {
    const { page = 1, limit = 20, search, role, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (role) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { healthId: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, records] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
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

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        healthId: user.healthId,
        name: user.name,
        email: user.email,
        password: user.passwordHash,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        healthId: user.healthId,
        name: user.name,
        email: user.email,
        password: user.passwordHash,
        role: user.role,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt
      }
    });
  }
}
