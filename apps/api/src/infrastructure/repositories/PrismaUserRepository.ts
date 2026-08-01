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
