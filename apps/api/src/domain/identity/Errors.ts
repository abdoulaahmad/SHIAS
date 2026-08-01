export abstract class DomainError extends Error {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export class DuplicateEmailError extends DomainError {
  constructor(email: string) {
    super(`A user with email ${email} already exists.`, 'DUPLICATE_EMAIL');
  }
}

export class DuplicateHealthIdError extends DomainError {
  constructor(healthId: string) {
    super(`A patient with Health ID ${healthId} already exists.`, 'DUPLICATE_HEALTH_ID');
  }
}

export class DuplicateNpiError extends DomainError {
  constructor(npi: string) {
    super(`A provider with NPI ${npi} already exists.`, 'DUPLICATE_NPI');
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Email or password is incorrect.', 'INVALID_CREDENTIALS');
  }
}

export class InvalidTokenError extends DomainError {
  constructor() {
    super('The supplied token is invalid or expired.', 'TOKEN_EXPIRED');
  }
}

export class ProviderNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Provider with ID ${id} not found.`, 'PROVIDER_NOT_FOUND');
  }
}

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super(`User with ID ${id} not found`, 'USER_NOT_FOUND');
  }
}
