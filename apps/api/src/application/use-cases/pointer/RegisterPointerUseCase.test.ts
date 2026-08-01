import { describe, it, expect, vi } from 'vitest';
import { RegisterPointerUseCase } from './RegisterPointerUseCase';
import { IPointerRepository, DuplicatePointerError, RecordType } from '../../../domain/pointer';

describe('RegisterPointerUseCase', () => {
  it('should register a pointer successfully', async () => {
    const mockRepo: IPointerRepository = {
      findById: vi.fn(),
      findByPatient: vi.fn(),
      findByProvider: vi.fn(),
      findByExternalReference: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
      archive: vi.fn(),
    };
    const mockEventPublisher = {
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(),
    };

    const useCase = new RegisterPointerUseCase(mockRepo, mockEventPublisher);
    const pointer = await useCase.execute({
      patientId: 'patient-1',
      providerId: 'provider-1',
      externalSystemId: 'sys-1',
      externalRecordId: 'rec-1',
      externalUri: 'https://test.com/data',
      recordType: RecordType.DOCUMENT,
      recordCreatedAt: new Date(),
    });

    expect(pointer.patientId).toBe('patient-1');
    expect(pointer.metadata.externalSystemId).toBe('sys-1');
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('should throw DuplicatePointerError if reference exists', async () => {
    const mockRepo: IPointerRepository = {
      findById: vi.fn(),
      findByPatient: vi.fn(),
      findByProvider: vi.fn(),
      findByExternalReference: vi.fn().mockResolvedValue({ id: 'existing' }),
      save: vi.fn(),
      archive: vi.fn(),
    };

    const mockEventPublisher = {
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(),
    };

    const useCase = new RegisterPointerUseCase(mockRepo, mockEventPublisher);
    await expect(useCase.execute({
      patientId: 'patient-1',
      providerId: 'provider-1',
      externalSystemId: 'sys-1',
      externalRecordId: 'rec-1',
      externalUri: 'https://test.com/data',
      recordType: RecordType.DOCUMENT,
      recordCreatedAt: new Date(),
    })).rejects.toThrow(DuplicatePointerError);
  });
});
