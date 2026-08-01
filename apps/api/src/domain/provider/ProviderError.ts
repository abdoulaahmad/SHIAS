import { DomainError } from '../identity/Errors';


export class ProviderSuspendedError extends DomainError {
  constructor(id: string) {
    super(`Provider with ID ${id} is suspended`, 'PROVIDER_SUSPENDED');
  }
}

export class DuplicateProviderNpiError extends DomainError {
  constructor(npi: string) {
    super(`Provider with NPI ${npi} already exists`, 'DUPLICATE_PROVIDER_NPI');
  }
}

export class InvalidProviderStateTransitionError extends DomainError {
  constructor(from: string, to: string) {
    super(`Cannot transition provider from ${from} to ${to}`, 'INVALID_PROVIDER_STATE_TRANSITION');
  }
}

export class UserNotProviderStaffError extends DomainError {
  constructor(userId: string, providerId: string) {
    super(`User ${userId} is not staff for provider ${providerId}`, 'USER_NOT_PROVIDER_STAFF');
  }
}

export class ProviderNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Provider with ID ${id} not found`, 'PROVIDER_NOT_FOUND');
  }
}
