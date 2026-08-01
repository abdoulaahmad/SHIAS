import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AccessGrant, AccessGrantProps } from './AccessGrant';
import { AccessGrantId } from './ValueObjects';
import { AccessStatus } from './Enums';
import { AccessStateTransitionError } from './Errors';
import { ConsentPurpose } from '../consent';

describe('Access Domain', () => {
  describe('AccessGrant', () => {
    let baseProps: AccessGrantProps;

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-01-01T10:00:00Z'));
      baseProps = {
        id: new AccessGrantId('grant-1'),
        requestId: 'req-1',
        patientId: 'patient-1',
        providerId: 'provider-1',
        consentId: 'consent-1',
        pointerIds: ['ptr-1'],
        purpose: ConsentPurpose.TREATMENT,
        status: AccessStatus.ACTIVE,
        expiresAt: new Date('2023-01-01T11:00:00Z'), // 1 hour later
        createdAt: new Date(),
        revokedAt: null
      };
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should create an active grant', () => {
      const grant = new AccessGrant(baseProps);
      expect(grant.status).toBe(AccessStatus.ACTIVE);
    });

    it('should accurately detect expiration', () => {
      const grant = new AccessGrant(baseProps);
      expect(grant.isExpired(new Date('2023-01-01T10:30:00Z'))).toBe(false);
      expect(grant.isExpired(new Date('2023-01-01T11:00:01Z'))).toBe(true);
    });

    it('should allow revoking an active grant', () => {
      const grant = new AccessGrant(baseProps);
      grant.revoke();
      expect(grant.status).toBe(AccessStatus.REVOKED);
      expect(grant.revokedAt).not.toBeNull();
    });

    it('should not allow revoking an already revoked grant', () => {
      const grant = new AccessGrant({ ...baseProps, status: AccessStatus.REVOKED });
      expect(() => grant.revoke()).toThrow(AccessStateTransitionError);
    });

    it('should allow expiring an active grant', () => {
      const grant = new AccessGrant(baseProps);
      grant.expire();
      expect(grant.status).toBe(AccessStatus.EXPIRED);
    });

    it('should not allow expiring a revoked grant', () => {
      const grant = new AccessGrant({ ...baseProps, status: AccessStatus.REVOKED });
      expect(() => grant.expire()).toThrow(AccessStateTransitionError);
    });
  });
});
