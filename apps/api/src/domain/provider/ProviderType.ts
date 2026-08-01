import { DomainError } from '../identity/Errors'; // Reuse or extract generic domain error

export class InvalidProviderTypeError extends DomainError {
  constructor(type: string) {
    super(`Invalid provider type: ${type}`, 'INVALID_PROVIDER_TYPE');
  }
}

export class ProviderType {
  private static readonly VALID_TYPES = ['HOSPITAL', 'CLINIC', 'PRACTICE', 'PHARMACY', 'LABORATORY'];

  public readonly value: string;

  constructor(value: string) {
    const upperValue = value.toUpperCase();
    if (!ProviderType.VALID_TYPES.includes(upperValue)) {
      throw new InvalidProviderTypeError(value);
    }
    this.value = upperValue;
  }
}
