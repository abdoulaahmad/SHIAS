export class AccessStateTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Cannot transition access grant from ${from} to ${to}`);
    this.name = 'AccessStateTransitionError';
  }
}

export class AccessGrantExpiredError extends Error {
  constructor() {
    super('Access grant is expired');
    this.name = 'AccessGrantExpiredError';
  }
}

export class AccessGrantNotFoundError extends Error {
  constructor(id: string) {
    super(`Access grant with id ${id} not found`);
    this.name = 'AccessGrantNotFoundError';
  }
}

export class UnauthorizedAccessRevocationError extends Error {
  constructor() {
    super('Unauthorized access revocation');
    this.name = 'UnauthorizedAccessRevocationError';
  }
}
