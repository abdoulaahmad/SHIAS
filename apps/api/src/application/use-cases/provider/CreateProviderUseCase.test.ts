import { describe, it, expect, vi } from 'vitest';
import { CreateProviderUseCase } from './CreateProviderUseCase';
import { IProviderRepository, ProviderStatus } from '../../../domain/provider';
import { DuplicateNpiError } from '../../../domain/identity';

describe('CreateProviderUseCase', () => {
  it('creates a provider successfully', async () => {
    const mockRepo: IProviderRepository = {
      findById: vi.fn(),
      findByNpi: vi.fn().mockResolvedValue(null),
      findAll: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined)
    };

    const useCase = new CreateProviderUseCase(mockRepo);
    const result = await useCase.execute({
      npi: '1234567890',
      name: 'Test Clinic',
      type: 'clinic'
    });

    expect(result.npi).toBe('1234567890');
    expect(result.status).toBe(ProviderStatus.ACTIVE);
    expect(mockRepo.save).toHaveBeenCalledWith(result);
  });

  it('throws DuplicateNpiError if NPI already exists', async () => {
    const mockRepo: IProviderRepository = {
      findById: vi.fn(),
      findByNpi: vi.fn().mockResolvedValue({ id: 'existing' }),
      findAll: vi.fn(),
      save: vi.fn()
    };

    const useCase = new CreateProviderUseCase(mockRepo);

    await expect(useCase.execute({
      npi: '1234567890',
      name: 'Test Clinic',
      type: 'clinic'
    })).rejects.toThrow(DuplicateNpiError);
  });
});
