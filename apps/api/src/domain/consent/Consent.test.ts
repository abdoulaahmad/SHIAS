import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Consent, ConsentProps } from './Consent';
import { ConsentId, ConsentScope, ConsentDuration } from './ValueObjects';
import { ConsentStatus, ConsentPurpose } from './Enums';
import { ConsentStateTransitionError, ConsentExpiredError, InvalidConsentScopeError, InvalidConsentDurationError } from './Errors';

describe('Consent', () => {
  let baseProps: ConsentProps;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T10:00:00Z'));
    baseProps = {
      id: new ConsentId('consent-1'),
      patientId: 'patient-1',
      providerId: 'provider-1',
      status: ConsentStatus.PENDING,
      scope: new ConsentScope(['ENCOUNTER']),
      purpose: ConsentPurpose.TREATMENT,
      duration: new ConsentDuration(new Date('2023-01-01T10:00:00Z'), new Date('2024-01-01T10:00:00Z')),
      createdAt: new Date(),
      updatedAt: new Date(),
      revokedAt: null,
      archivedAt: null
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Value Objects', () => {
    it('ConsentScope throws if empty scope and not allRecords', () => {
      expect(() => new ConsentScope([])).toThrow(InvalidConsentScopeError);
    });

    it('ConsentScope works for allRecords', () => {
      const scope = new ConsentScope([], true);
      expect(scope.hasAccess('ANY')).toBe(true);
    });

    it('ConsentDuration throws if expires before start', () => {
      expect(() => new ConsentDuration(new Date('2023-01-01T10:00:00Z'), new Date('2022-01-01T10:00:00Z'))).toThrow(InvalidConsentDurationError);
    });

    it('ConsentDuration correctly calculates expiration', () => {
      const duration = new ConsentDuration(new Date('2023-01-01T10:00:00Z'), new Date('2023-12-31T23:59:59Z'));
      expect(duration.isExpired(new Date('2023-06-01T10:00:00Z'))).toBe(false);
      expect(duration.isExpired(new Date('2024-01-01T10:00:00Z'))).toBe(true);
    });
  });

  describe('Lifecycle methods', () => {
    it('should approve a PENDING consent', () => {
      const consent = new Consent({ ...baseProps });
      consent.approve();
      expect(consent.status).toBe(ConsentStatus.APPROVED);
    });

    it('should not approve an already APPROVED consent', () => {
      const consent = new Consent({ ...baseProps, status: ConsentStatus.APPROVED });
      expect(() => consent.approve()).toThrow(ConsentStateTransitionError);
    });

    it('should not approve an EXPIRED consent', () => {
      const consent = new Consent({ ...baseProps, status: ConsentStatus.EXPIRED });
      expect(() => consent.approve()).toThrow(ConsentStateTransitionError);
    });

    it('should reject a PENDING consent', () => {
      const consent = new Consent({ ...baseProps });
      consent.reject();
      expect(consent.status).toBe(ConsentStatus.REJECTED);
    });

    it('should not reject an APPROVED consent', () => {
      const consent = new Consent({ ...baseProps, status: ConsentStatus.APPROVED });
      expect(() => consent.reject()).toThrow(ConsentStateTransitionError);
    });

    it('should revoke an APPROVED consent', () => {
      const consent = new Consent({ ...baseProps, status: ConsentStatus.APPROVED });
      consent.revoke();
      expect(consent.status).toBe(ConsentStatus.REVOKED);
      expect(consent.revokedAt).not.toBeNull();
    });

    it('should not revoke a PENDING consent', () => {
      const consent = new Consent({ ...baseProps });
      expect(() => consent.revoke()).toThrow(ConsentStateTransitionError);
    });

    it('should archive any consent not already archived', () => {
      const consent = new Consent({ ...baseProps, status: ConsentStatus.REVOKED });
      consent.archive();
      expect(consent.status).toBe(ConsentStatus.ARCHIVED);
      expect(consent.archivedAt).not.toBeNull();
    });

    it('should not archive an ARCHIVED consent', () => {
      const consent = new Consent({ ...baseProps, status: ConsentStatus.ARCHIVED });
      expect(() => consent.archive()).toThrow(ConsentStateTransitionError);
    });

    it('should expire a PENDING or APPROVED consent', () => {
      const consent = new Consent({ ...baseProps });
      consent.expire();
      expect(consent.status).toBe(ConsentStatus.EXPIRED);
    });

    it('should not approve if duration is expired', () => {
      vi.setSystemTime(new Date('2024-02-01T10:00:00Z'));
      const consent = new Consent({ ...baseProps });
      expect(() => consent.approve()).toThrow(ConsentExpiredError);
    });
  });
});
