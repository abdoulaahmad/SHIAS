import { describe, it, expect } from 'vitest';
import { Pointer, PointerProps } from './Pointer';
import { PointerMetadata, StorageLocation } from './ValueObjects';
import { PointerStatus, RecordType } from './Enums';
import { ClinicalPayloadError, InvalidPointerStateError, InvalidStorageLocationError } from './Errors';

describe('Pointer Domain Entity', () => {
  const validMetadata = new PointerMetadata({
    externalSystemId: 'sys-123',
    externalRecordId: 'rec-456',
    externalUri: new StorageLocation('https://secure.hospital.com/records/rec-456'),
    recordType: RecordType.ENCOUNTER,
    recordCreatedAt: new Date(),
  });

  it('should create an active pointer', () => {
    const pointer = Pointer.create({
      patientId: 'patient-1',
      providerId: 'provider-1',
      metadata: validMetadata,
    });

    expect(pointer.status).toBe(PointerStatus.ACTIVE);
    expect(pointer.patientId).toBe('patient-1');
    expect(pointer.providerId).toBe('provider-1');
    expect(pointer.metadata.externalSystemId).toBe('sys-123');
  });

  it('should prevent storing clinical payload data', () => {
    expect(() => {
      Pointer.reconstruct({
        id: '123',
        patientId: 'pat',
        providerId: 'prov',
        metadata: validMetadata,
        status: PointerStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: null,
        deletedAt: null,
        clinicalData: { some: 'data' }
      } as unknown as PointerProps);
    }).toThrow(ClinicalPayloadError);
  });

  it('should prevent archiving an already archived pointer', () => {
    const pointer = Pointer.create({
      patientId: 'patient-1',
      providerId: 'provider-1',
      metadata: validMetadata,
    });

    pointer.archive();
    expect(() => pointer.archive()).toThrow(InvalidPointerStateError);
  });

  it('should prevent archiving a revoked pointer', () => {
    const pointer = Pointer.create({
      patientId: 'patient-1',
      providerId: 'provider-1',
      metadata: validMetadata,
    });

    pointer.revoke();
    expect(() => pointer.archive()).toThrow(InvalidPointerStateError);
  });
});

describe('StorageLocation Value Object', () => {
  it('should accept valid HTTPS URIs', () => {
    const location = new StorageLocation('https://secure.host.com/data');
    expect(location.value).toBe('https://secure.host.com/data');
  });

  it('should reject HTTP URIs', () => {
    expect(() => new StorageLocation('http://insecure.host.com/data')).toThrow(InvalidStorageLocationError);
  });

  it('should reject invalid URIs', () => {
    expect(() => new StorageLocation('not-a-uri')).toThrow(InvalidStorageLocationError);
  });
});
