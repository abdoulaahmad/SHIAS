import { PrismaClient, Pointer as PrismaPointer } from '@shias/database';
import { 
  Pointer, 
  IPointerRepository, 
  PointerStatus,
  RecordType,
  PointerMetadata,
  StorageLocation
} from '../../../domain/pointer';

export class PrismaPointerRepository implements IPointerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(record: PrismaPointer): Pointer {
    const metadata = new PointerMetadata({
      externalSystemId: record.externalSystemId,
      externalRecordId: record.externalRecordId,
      externalUri: new StorageLocation(record.externalUri),
      recordType: record.recordType as RecordType,
      recordCreatedAt: record.recordCreatedAt,
    });

    return Pointer.reconstruct({
      id: record.id,
      patientId: record.patientId,
      providerId: record.providerId,
      metadata,
      status: record.status as PointerStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      archivedAt: record.archivedAt,
      deletedAt: record.deletedAt,
    });
  }

  public async save(pointer: Pointer): Promise<void> {
    await this.prisma.pointer.upsert({
      where: { id: pointer.id },
      update: {
        status: pointer.status,
        archivedAt: pointer.archivedAt,
        deletedAt: pointer.deletedAt,
        updatedAt: pointer.updatedAt,
      },
      create: {
        id: pointer.id,
        patientId: pointer.patientId,
        providerId: pointer.providerId,
        recordType: pointer.metadata.recordType,
        externalSystemId: pointer.metadata.externalSystemId,
        externalRecordId: pointer.metadata.externalRecordId,
        externalUri: pointer.metadata.externalUri.value,
        status: pointer.status,
        recordCreatedAt: pointer.metadata.recordCreatedAt,
        createdAt: pointer.createdAt,
        updatedAt: pointer.updatedAt,
        archivedAt: pointer.archivedAt,
        deletedAt: pointer.deletedAt,
      },
    });
  }

  public async findById(id: string): Promise<Pointer | null> {
    const record = await this.prisma.pointer.findUnique({
      where: { id },
    });
    return record ? this.mapToDomain(record) : null;
  }

  public async findByPatient(patientId: string): Promise<Pointer[]> {
    const records = await this.prisma.pointer.findMany({
      where: { patientId },
    });
    return records.map((r: PrismaPointer) => this.mapToDomain(r));
  }

  public async findByProvider(providerId: string): Promise<Pointer[]> {
    const records = await this.prisma.pointer.findMany({
      where: { providerId },
    });
    return records.map((r: PrismaPointer) => this.mapToDomain(r));
  }

  public async findByExternalReference(providerId: string, externalSystemId: string, externalRecordId: string): Promise<Pointer | null> {
    const record = await this.prisma.pointer.findUnique({
      where: {
        providerId_externalSystemId_externalRecordId: {
          providerId,
          externalSystemId,
          externalRecordId,
        }
      }
    });
    return record ? this.mapToDomain(record) : null;
  }

  public async archive(id: string): Promise<void> {
    await this.prisma.pointer.update({
      where: { id },
      data: {
        status: PointerStatus.ARCHIVED,
        archivedAt: new Date(),
      }
    });
  }
}
