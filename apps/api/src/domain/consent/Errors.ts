export class ConsentStateTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Cannot transition consent from ${from} to ${to}`);
    this.name = 'ConsentStateTransitionError';
  }
}

export class ConsentExpiredError extends Error {
  constructor() {
    super('Consent is expired');
    this.name = 'ConsentExpiredError';
  }
}

export class InvalidConsentScopeError extends Error {
  constructor() {
    super('Invalid consent scope');
    this.name = 'InvalidConsentScopeError';
  }
}

export class InvalidConsentDurationError extends Error {
  constructor() {
    super('Consent expiration must be after the start time and in the future');
    this.name = 'InvalidConsentDurationError';
  }
}

export class UnauthorizedConsentApprovalError extends Error {
  constructor() {
    super('Unauthorized consent approval');
    this.name = 'UnauthorizedConsentApprovalError';
  }
}

export class ConsentNotFoundError extends Error {
  constructor(id: string) {
    super(`Consent with id ${id} not found`);
    this.name = 'ConsentNotFoundError';
  }
}
