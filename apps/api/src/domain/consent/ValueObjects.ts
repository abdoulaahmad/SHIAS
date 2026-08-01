import { InvalidConsentScopeError, InvalidConsentDurationError } from './Errors';

export class ConsentId {
  constructor(public readonly value: string) {}
}

export class ConsentScope {
  constructor(public readonly allowedTypes: string[], public readonly allRecords: boolean = false) {
    if (!allRecords && (!allowedTypes || allowedTypes.length === 0)) {
      throw new InvalidConsentScopeError();
    }
  }

  hasAccess(type: string): boolean {
    if (this.allRecords) return true;
    return this.allowedTypes.includes(type);
  }

  toJSON() {
    return {
      allowedTypes: this.allowedTypes,
      allRecords: this.allRecords
    };
  }
}

export class ConsentDuration {
  constructor(public readonly startsAt: Date, public readonly expiresAt: Date | null) {
    if (expiresAt && expiresAt <= startsAt) {
      throw new InvalidConsentDurationError();
    }
  }

  isExpired(at: Date = new Date()): boolean {
    if (!this.expiresAt) return false;
    return at >= this.expiresAt;
  }
}

export class ConsentDecision {
  constructor(public readonly authorized: boolean, public readonly reason?: string, public readonly consentId?: string) {}

  static authorized(consentId: string): ConsentDecision {
    return new ConsentDecision(true, undefined, consentId);
  }

  static denied(reason: string): ConsentDecision {
    return new ConsentDecision(false, reason);
  }
}
