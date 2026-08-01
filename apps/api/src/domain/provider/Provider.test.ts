import { describe, it, expect } from 'vitest';
import { Provider } from './Provider';
import { ProviderStatus } from './ProviderStatus';
import { ProviderSuspendedError, InvalidProviderStateTransitionError } from './ProviderError';

describe('Provider Domain Entity', () => {
  it('creates an active provider by default', () => {
    const provider = Provider.create({
      id: '1',
      npi: '1234567890',
      name: 'Test Clinic',
      type: 'clinic'
    });
    
    expect(provider.status).toBe(ProviderStatus.ACTIVE);
    expect(provider.npi).toBe('1234567890');
    expect(provider.name).toBe('Test Clinic');
    expect(provider.type.value).toBe('CLINIC');
  });

  it('can be suspended', () => {
    const provider = Provider.create({
      id: '1',
      npi: '1234567890',
      name: 'Test Clinic',
      type: 'clinic'
    });
    
    provider.suspend();
    expect(provider.status).toBe(ProviderStatus.SUSPENDED);
    expect(provider.deletedAt).toBeNull();
  });

  it('can be reactivated from suspended state', () => {
    const provider = Provider.create({
      id: '1',
      npi: '1234567890',
      name: 'Test Clinic',
      type: 'clinic'
    });
    
    provider.suspend();
    provider.reactivate();
    expect(provider.status).toBe(ProviderStatus.ACTIVE);
  });

  it('throws error when reactivating an already active provider', () => {
    const provider = Provider.create({
      id: '1',
      npi: '1234567890',
      name: 'Test Clinic',
      type: 'clinic'
    });
    
    expect(() => provider.reactivate()).toThrow(InvalidProviderStateTransitionError);
  });
});
